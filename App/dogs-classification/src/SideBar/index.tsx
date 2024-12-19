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
}

export default function SideBar({ dataPoint, addDataPoint }: Props) {
    const imageUrl = dataPoint?.file
        ? getImageUrl(dataPoint.file)
        : Constants.NoDataSelectedUrl;

    let subtitle: any;
    const [modalIsOpen, setIsOpen] = useState(false);
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
            setFormData({ ...formData, dogPhoto: files[0],  });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if(!formData.dogPhoto) {
            return;
        }
        const dogData: IPostDog = { 
            form: {
                name: formData.dogName,
                description: formData.description,
                image: formData.dogPhoto
            }
        };
        const response = await sendImageToProcess(dogData);
        addDataPoint(response)
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
                <button className={classes.UploadButton} onClick={openModal}>
                    Upload
                </button>
                <Modal
                    isOpen={modalIsOpen}
                    onAfterOpen={afterOpenModal}
                    onRequestClose={closeModal}
                    style={customModalStyles}
                    contentLabel="Example Modal"
                >
                    <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Hello</h2>
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
                        <button type="submit">Send</button>
                        <button type="button" onClick={closeModal}>
                            X
                        </button>
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
