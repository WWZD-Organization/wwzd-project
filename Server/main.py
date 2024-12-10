from flask import Flask, jsonify, request, send_from_directory
import json
import random
from flask_cors import CORS

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
    data = request.form
    name = data.get("name")
    description = data.get("description")

    dog_breeds = ["Labrador", "Poodle", "Bulldog", "Beagle", "Chihuahua"]
    prediction = random.choice(dog_breeds)

    x = random.uniform(0, 100)
    y = random.uniform(0, 100)
    z = random.uniform(0, 100)

    response = {
        "name": name,
        "description": description,
        "prediction": prediction,
        "x": x,
        "y": y,
        "z": z
    }

    return jsonify(response)


@app.route("/api/v1/images/<filename>", methods=["GET"])
def get_image(filename):
    return send_from_directory('content/images', filename)


if __name__ == "__main__":
    app.run(port=3000, debug=True)
