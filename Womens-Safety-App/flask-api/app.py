from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import os
import cv2
from deepface import DeepFace
import io
import numpy as np

app = Flask(__name__)

# Configure CORS
CORS(app, resources={
    r"/api/*": {
        "origins": ["https://women-s-safety-app.vercel.app", "http://localhost:3000"],
        "methods": ["POST", "OPTIONS", "GET"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

@app.route('/api/testing')
@cross_origin()
def hello_world():
    return 'Hello world!'

@app.route('/api/verify', methods=['POST', 'OPTIONS'])
@cross_origin()
def verify():
    # Handle preflight requests
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'OK'})
        response.headers.add('Access-Control-Allow-Origin', 'https://women-s-safety-app.vercel.app')
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

        # Prepare response
        response = jsonify({
            "message": "Gender verified as female" if gender.lower() == 'woman' else "Gender verified as male"
        })
        
        # Set CORS headers for the response
        response.headers.add('Access-Control-Allow-Origin', 'https://women-s-safety-app.vercel.app')
        
        return response, 200 if gender.lower() == 'woman' else 500

    except Exception as e:
        error_response = jsonify({"error": str(e)})
        error_response.headers.add('Access-Control-Allow-Origin', 'https://women-s-safety-app.vercel.app')
        return error_response, 500

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 3000))
    app.run(host='0.0.0.0', port=port, debug=True)