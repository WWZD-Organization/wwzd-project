import React, { useState } from 'react';
import { getImageUrl, sendImageToProcess } from '../ApiService';
import { IDataPoint } from '../interfaces';
import Constants from '../utils/constants';
import classes from './SideBar.module.scss';
import Modal from 'react-modal';
import { IPostDog } from '../interfaces/IPostDog';

Modal.setAppElement('#root');

interface Props {
    dataPoint?: IDataPoint;
    addDataPoint: (dataPoint: IDataPoint) => void;
    sendCategoryToApp: (category: string) => void;
}

export default function SideBar({ dataPoint, addDataPoint, sendCategoryToApp}: Props) {
    const imageUrl = dataPoint?.file
        ? getImageUrl(dataPoint.file)
        : Constants.NoDataSelectedUrl;

    let subtitle: any;
    const [modalIsOpen, setIsOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('tsne'); // Nowy stan dla radio buttonów
    const [formData, setFormData] = useState({
        dogName: '',
        description: '',
        dogPhoto: null as File | null,
    });

    function openModal() {
        setIsOpen(true);
    }

    function afterOpenModal() {
        subtitle.style.color = '#f00';
    }

    function closeModal() {
        setIsOpen(false);
    }

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value, files } = event.target;
        if (name === 'dogPhoto' && files) {
            setFormData({ ...formData, dogPhoto: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    }

    function handleCategoryChange(event: React.ChangeEvent<HTMLInputElement>) {
        setSelectedCategory(event.target.value);
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!formData.dogPhoto) {
            return;
        }
        const dogData: IPostDog = {
            form: {
                name: formData.dogName,
                description: formData.description,
                image: formData.dogPhoto,
                category: selectedCategory, 
            },
        };
        const response = await sendImageToProcess(dogData);
        addDataPoint(response);
        closeModal();
    }

    return (
        <div className={classes.Wrapper}>
            <div className={classes.SideBarContainer}>
                <div>
                    <div className={classes.ImageContainer}>
                        <img src={imageUrl} alt="Selected data" />
                    </div>
                    <div className={classes.DataContainer}>
                        <h2>Name: {dataPoint?.name}</h2>
                        <h3>Coordinates:</h3>
                        <p>X: {dataPoint?.x}</p>
                        <p>Y: {dataPoint?.y}</p>
                        <p>Z: {dataPoint?.z}</p>
                        <h3>Predictions:</h3>
                        <ul>
                            {dataPoint?.prediction.map((prediction, index) => (
                                <li key={index}>
                                    {prediction.class}: {prediction.score.toFixed(2)}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div>
                    <button className={classes.UploadButton} onClick={openModal}>
                        Upload image
                    </button>
                    <div className={classes.radioContainer}>
                        <legend>Category</legend>
                        <label>
                            <div className={classes.radioItem}>
                                <div>tsne</div>
                                <input
                                    type="radio"
                                    name="category"
                                    value="tsne"
                                    checked={selectedCategory === 'tsne'}
                                    onChange={handleCategoryChange}
                                />
                            </div>
                        </label>
                        <label>
                            <div className={classes.radioItem}>
                                <div>pca</div>
                                <input
                                    type="radio"
                                    name="category"
                                    value="pca"
                                    checked={selectedCategory === 'pca'}
                                    onChange={handleCategoryChange}
                                />
                            </div>
                        </label>
                        <button 
                            className={classes.SendCategoryButton} 
                            onClick={() => sendCategoryToApp(selectedCategory)}>
                            Change method
                        </button>
                    </div>
                </div>
                <Modal
                    isOpen={modalIsOpen}
                    onAfterOpen={afterOpenModal}
                    onRequestClose={closeModal}
                    style={customModalStyles}
                    contentLabel="Example Modal"
                >
                    <form className={classes.ModalContainer} onSubmit={handleSubmit}>
                        <label>
                            Dog Name
                            <input
                                name="dogName"
                                value={formData.dogName}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Description
                            <input
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Dog photo
                            <input
                                type="file"
                                name="dogPhoto"
                                onChange={handleInputChange}
                            />
                        </label>
                        <div className={classes.ModalButtons}>
                            <button type="submit">Send</button>
                            <button type="button" onClick={closeModal}>
                                X
                            </button>
                        </div>
                    </form>
                </Modal>
            </div>
        </div>
    );
}

const customModalStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};
