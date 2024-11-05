from flask import Flask, request, jsonify
from flask_cors import CORS,cross_origin
import os
import cv2
from deepface import DeepFace
import io
import numpy as np

app = Flask(__name__)
CORS(app,supports_credentials=True)

@app.before_request
def before_request():
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }
        return ('', 204, headers)

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
    return response

@app.route('/api/verify', methods=['POST', 'OPTIONS'])
def verify():
    try:
        image_file = request.files['image']
        in_memory_file = io.BytesIO()
        image_file.save(in_memory_file)
        data = np.frombuffer(in_memory_file.getvalue(), dtype=np.uint8)
        img_array = cv2.imdecode(data, cv2.IMREAD_COLOR)

        analysis = DeepFace.analyze(img_path=img_array, actions=['gender'])
        gender = analysis[0]['dominant_gender']

        return jsonify({
            "message": "Gender verified as female" if gender.lower() == 'woman' else "Gender verified as male"
        }), 200 if gender.lower() == 'woman' else 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 3000))
    app.run(host='0.0.0.0', port=port)