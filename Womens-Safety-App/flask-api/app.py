from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import os
import cv2
from deepface import DeepFace
import io
import numpy as np

app = Flask(__name__)

# Enable CORS for all routes
CORS(app, resources={
    r"/*": {
        "origins": "*",
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

@app.after_request
def after_request(response):
    # Regardless of the path, add CORS headers
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

@app.route('/api/testing')
def hello_world():
    return make_response(jsonify({'message': 'Hello world!'}), 200)

@app.route('/api/verify', methods=['POST', 'OPTIONS'])
def verify():
    # Handle preflight requests
    if request.method == "OPTIONS":
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'POST,OPTIONS')
        return response

    try:
        image_file = request.files['image']
        
        # Read image into memory
        in_memory_file = io.BytesIO()
        image_file.save(in_memory_file)
        data = np.frombuffer(in_memory_file.getvalue(), dtype=np.uint8)
        img_array = cv2.imdecode(data, cv2.IMREAD_COLOR)

        # Perform gender analysis
        analysis = DeepFace.analyze(img_path=img_array, actions=['gender'])
        gender = analysis[0]['dominant_gender']

        response = make_response(
            jsonify({
                "message": "Gender verified as female" if gender.lower() == 'woman' else "Gender verified as male"
            }),
            200 if gender.lower() == 'woman' else 500
        )
        return response

    except Exception as e:
        response = make_response(
            jsonify({"error": str(e)}),
            500
        )
        return response

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 3000))
    app.run(host='0.0.0.0', port=port, debug=True)