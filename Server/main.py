from flask import Flask, jsonify, request, send_from_directory
import json
import os
import logging
from flask_cors import CORS
from utils.feature_extraction import extract_and_predict

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

app = Flask(__name__)
CORS(app, support_credentials=True)


@app.route("/", methods=["GET"])
def index():
    return "Hello, World!"


@app.route("/api/v1/data", methods=["GET"])
def init_data():
    data = []
    with open("./content/images.json", "r") as file:
        data = json.load(file)

    return jsonify({
        "data": data
    })

@app.route("/api/v1/data", methods=["POST"])
def get_output():
    try:
        logging.info("POST data request received")
        data = request.form
        name = data.get("name")
        description = data.get("description")
        if 'image' not in request.files:
            return jsonify({"error": "No image part in the request"}), 400

        file = request.files['image']

        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400

        file_path = os.path.join('content/images', file.filename)
        file.save(file_path)

        dimensions, prediction = extract_and_predict(file_path)

        response = {
            "name": name,
            "description": description,
            "prediction": prediction,
            "file": file.filename,
            "x": str(dimensions[0]),
            "y": str(dimensions[1]),
            "z": str(dimensions[2])
        }

        logging.info("Result of feature extractions: ", response)

        with open("./content/images.json", 'r') as file:
            data = json.load(file)
            data.append(response)
        with open("./content/images.json", 'w') as file:
            json.dump(data, file, indent=4)

        return jsonify(response)
    except Exception as e:
        logging.error(f"An error occurred: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/api/v1/images/<filename>", methods=["GET"])
def get_image(filename):
    return send_from_directory('content/images', filename)


if __name__ == "__main__":
    app.run(port=3000, debug=True)
