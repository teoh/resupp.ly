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
import json

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
M.load_weights('./MW.h5')

total_stuff = ['potato', 'carrot', 'egg', 'mushroom', 'pasta sauce'] 

app = Flask(__name__)

def post_request(labels):
    r = requests.post('http://52.228.33.184:8081/pushnewdata',data= json.dumps({'ingredients': labels}),headers={'content-type':'application/json'})

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
                print total_stuff
                print preds
    		#post_request(['eggs','coffee'])
                pred_list = list(preds[0])
                s = reduce(lambda x,y: x+y, pred_list)
                pred_list = [x/s for x in pred_list]

                chosen = [i for i,x in enumerate(pred_list) if x >= 0.2]
                #if len(chosen) > 1 and 1 in chosen:
                 #   chosen.remove(1)
                post_request([total_stuff[i] for i in chosen])
                return '\n'.join(map(str,zip(map(str,pred_list),map(str,total_stuff))))+'\n'+'success!'
        return 'wrong method!!!'

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=6000, debug=False)

    
