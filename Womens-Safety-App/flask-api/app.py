from flask import Flask,request,jsonify
from flask_cors import CORS,cross_origin
import os
import cv2
from deepface import DeepFace
import io
import numpy as np

app = Flask(__name__)
CORS(app)

@app.route('/api/testing')

def hello_world():

    return 'Hello world!'

@app.route('/api/verify',methods=['POST'])

def verify():
    image_file=request.files['image']
    # save_path=os.path.join('./images', image_file.filename)
    # image_file.save(save_path)

    in_memory_file=io.BytesIO()
    image_file.save(in_memory_file)
    data=np.frombuffer(in_memory_file.getvalue(),dtype=np.uint8)

    img_array=cv2.imdecode(data,cv2.IMREAD_COLOR)

    analysis=DeepFace.analyze(img_path=img_array,actions=['gender'])
    gender=analysis[0]['dominant_gender']

    if gender.lower()=='woman':
        return jsonify({"message": "Gender verified as female"}), 200
    else:
        return jsonify({"message": "Gender verified as male"}), 500


if __name__=="__main__":
    port=int(os.environ.get('PORT',3000))
    app.run(host='0.0.0.0',port=port,debug=True)