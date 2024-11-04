from flask import Flask,request,jsonify
from flask_cors import CORS,cross_origin
import os

app = Flask(__name__)
CORS(app)

@app.route('/api/testing')

def hello_world():

    return 'Hello world!'

@app.route('/api/verify',methods=['POST'])
@cross_origin()

def verify():
    image_file=request.files['image']
    save_path=os.path.join('./images', image_file.filename)
    image_file.save(save_path)

    return "Hello World!"

if __name__=="__main__":
    app.run(port=3000,debug=True)