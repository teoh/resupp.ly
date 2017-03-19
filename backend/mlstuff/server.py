from flask import Flask
from flask import request
import os

app = Flask(__name__)

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
        return 'success!'
       

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080, debug=True)
