from flask import Flask
from flask import request

app = Flask(__name__)

@app.route("/hello")
def hello():
    return "Hello World!"
    
@app.route("/new_image", methods=['POST'])
def new_image():
    if request.method == 'POST':
        img = request.files['image']
        return 'get it!'

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080, debug=True)