import { getImageUrl } from '../ApiService';
import { DataPoint } from '../interfaces';
import Constants from '../utils/Constants';
import classes from './SideBar.module.scss';

interface Props {
    dataPoint?: DataPoint;
}

export default function SideBar({dataPoint}: Props) {
    const imageUrl = dataPoint?.file
        ? getImageUrl(dataPoint.file)
        : Constants.NoDataSelectedUrl;

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
                                <li key={index}>{prediction.class}: {prediction.score.toFixed(2)}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                <button className={classes.UploadButton}>
                    Upload
                </button>
            </div>
        </div>
    );
}