import tensorflow as tf
from tensorflow.keras.applications import EfficientNetB0
from tensorflow.keras.preprocessing.image import img_to_array, load_img
from tensorflow.keras.applications.efficientnet import preprocess_input, decode_predictions
import numpy as np
import os
import logging
import joblib
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE


# load model EfficientNetB0 z ImageNet from ImageNet without top layer
base_model = EfficientNetB0(weights='imagenet')

features_output = base_model.get_layer('avg_pool').output
# Model without final classification layers - we will use it only for feature extraction
model = tf.keras.Model(inputs=base_model.input, outputs=[features_output])
scaler = StandardScaler()
pca = PCA(n_components=3)
tsne = TSNE(n_components=3, random_state=42) # t-SNE is computationally expensive and non-deterministic (results can vary unless random_state is set).
all_features = np.empty((0, 1280))  # Empty array to store all features

image_size = (224, 224)  # Size for EfficientNetB0
images_folder = "content/images"

# Function to preprocess and load images
def preprocess_image(img_path):
    img = load_img(img_path, target_size=image_size)  # Load image and resize it
    img_array = img_to_array(img)                     # Convert image to NumPy array
    img_array = preprocess_input(img_array)           # Scale pixel values for EfficientNet
    return np.expand_dims(img_array, axis=0)          # Add dimension to array (for batch)


def extract_features(preprocessed_image):
    features = model.predict(preprocessed_image)
    logging.info("Extracted features shape: ", features.shape)
    # Scaling features to mean 0 and variance 1 (standard deviation of 1)
    features_scaled = scaler.transform(features)

    all_features = np.vstack([all_features, features_scaled])
    features_3d_pca = pca.transform(features_scaled)

    all_features_3d_tsne = tsne.fit_transform(all_features)    
    features_3d_tsne = all_features_3d_tsne[-1]

    return features_3d_pca[0], features_3d_tsne[0]

def predict_image(preprocessed_image):
    preds = base_model.predict(preprocessed_image)
    top_preds = decode_predictions(preds, top=3)[0]
    return [{"class": label, "score": round(score*100, 2)} for (i, label, score) in top_preds]

def extract_and_predict(img_path):
    preprocessed_image = preprocess_image(img_path)
    dimensions_pca, dimensions_tsne = extract_features(preprocessed_image)
    logging.info("Extracted dimensions:", "PCA:", dimensions_pca, "t-SNE:", dimensions_tsne)
    predictions = predict_image(preprocessed_image)
    logging.info("Predictions:", predictions)
    return dimensions_pca, dimensions_tsne, predictions

def fit_all():
    features = []
    for filename in os.listdir(images_folder):
        if filename.endswith(".jpg") or filename.endswith(".png"):
            img_path = os.path.join(images_folder, filename)
            img_array = preprocess_image(img_path)
            features.append(model.predict(img_array))  # Extract features using EfficientNet

    # Convert the list of features to a NumPy array
    features = np.array(features).squeeze()
    logging.info("Extracted features shape: %s", str(features.shape))

    features_scaled = scaler.fit_transform(features)
    all_features = features_scaled
    pca.fit_transform(features_scaled)

def init(): 
    logging.info("Initializing feature extraction...")

if not os.path.exists('scaler.pkl') or not os.path.exists('pca.pkl') or not os.path.exists('tsne.pkl'):
    logging.info("No pre-fitted scaler or PCA. Fitting new models...")
    try:
        fit_all()
        joblib.dump(scaler, 'scaler.pkl')
        joblib.dump(pca, 'pca.pkl')
    except Exception as e:
        logging.error(f"An error occurred: {e}")
else:
    logging.info("Loading pre-fitted scaler and PCA...")
    scaler = joblib.load('scaler.pkl')
    pca = joblib.load('pca.pkl')