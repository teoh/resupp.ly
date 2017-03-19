from flask import Flask
from flask import request
import os

from keras.applications.resnet50 import ResNet50
from keras.preprocessing import image
from keras.applications.resnet50 import preprocess_input, decode_predictions
from keras.layers import Flatten, Dense, Input
from keras.models import Model
from keras.regularizers import l2

import numpy as np

import requests

# EVERYTHING MODELS 
def model(input_shape=[224,224,3], num_labels=5, reg=5e-2):
    X = Input(shape=input_shape)
    base_model = ResNet50(include_top=False, weights='imagenet', input_tensor=X)
    fl = Flatten()(base_model.output)
    predict = Dense(units=num_labels, activation='sigmoid', kernel_regularizer=l2(reg), kernel_initializer='he_uniform')(fl)
    
    _m = Model(inputs=X, outputs=predict)
    _m.compile(loss='binary_crossentropy', optimizer='Adam')
    
    return _m

def preprocess_image(path):
	img = image.load_img(path, target_size=(224, 224))
	x = image.img_to_array(img)
	x = np.expand_dims(x, axis=0)
	x = preprocess_input(x)
	return x

M = model()
# M.load_weights('./MW.h5')
app = Flask(__name__)

def post_request(labels):
	r = requests.get('52.228.33.184:8080/pushnewdata',json = {'ingredients': labels})

@app.route("/hello")
def hello():
    return "Hello World!"
    
@app.route("/new_image", methods=['POST'])
def new_image():
	if request.method == 'POST':
		if 'file' not in request.files:
			return 'please make sure that the key is called "file"'
		file = request.files['file']
		file.save('./TEST.png')
		x = preprocess_image('./TEST.png')
		preds = M.predict(x)
		post_request(['eggs','coffee'])
		

        return 'success!'

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080, debug=False)

    