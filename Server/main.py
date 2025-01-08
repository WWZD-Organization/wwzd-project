from flask import Flask, jsonify, request, send_from_directory
import json
import os
import logging
from flask_cors import CORS
from utils.feature_extraction import extract_and_predict, init

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

app = Flask(__name__)
CORS(app, support_credentials=True)


@app.route("/", methods=["GET"])
def index():
    return "Hello, World!"


@app.route("/api/v1/data", methods=["GET"])
def init_data():
    method = request.args.get('method', "pca")
    data = []
    if method == "tsne":
        with open("./content/tsne.json", "r") as file:
            data = json.load(file)
    else:
        with open("./content/pca.json", "r") as file:
            data = json.load(file)

    return jsonify({
        "data": data
    })

@app.route("/api/v1/data", methods=["POST"])
def get_output():
    try:
        method = request.args.get('method', "pca")
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

        dimensions_pca, dimensions_tsne, prediction = extract_and_predict(file_path)
    
        response_pca = {
            "name": name,
            "description": description,
            "prediction": prediction,
            "file": file.filename,
            "x": str(dimensions_pca[0]),
            "y": str(dimensions_pca[1]),
            "z": str(dimensions_pca[2])
        }

        response_tsne = {
            "name": name,
            "description": description,
            "prediction": prediction,
            "file": file.filename,
            "x": str(dimensions_tsne[0]),
            "y": str(dimensions_tsne[1]),
            "z": str(dimensions_tsne[2])
        }

        logging.info("Result of feature extractions: ", response_pca, response_tsne)

        with open("./content/pca.json", 'r') as file:
            data = json.load(file)
            data.append(response_pca)
        with open("./content/pca.json", 'w') as file:
            json.dump(data, file, indent=4)
        with open("./content/tsne.json", 'r') as file:
            data = json.load(file)
            data.append(response_tsne)
        with open("./content/tsne.json", 'w') as file:
            json.dump(data, file, indent=4)

        if method == "tsne":
            return jsonify(response_tsne)
        else:
            return jsonify(response_pca)
        
    except Exception as e:
        logging.error(f"An error occurred: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/api/v1/images/<filename>", methods=["GET"])
def get_image(filename):
    return send_from_directory('content/images', filename)


if __name__ == "__main__":
    init()
    app.run(port=3000, debug=True)
