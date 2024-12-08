import { MemoryUsageHelper } from 'scichart';
import ChartComponent from './Bubble3DChart';
import SideBar from './SideBar';
import { DataPoint } from './interfaces';

MemoryUsageHelper.isMemoryUsageDebugEnabled = true;

const placeholderData: DataPoint = {
    "x": 9.028751373291016,
    "y": -11.518657684326172,
    "z": -2.873061180114746,
    "name": "Basenji_2",
    "file": "Basenji_2.jpg",
    "prediction": [
        {
            "class": "basenji",
            "score": 55.93
        },
        {
            "class": "toy_terrier",
            "score": 15.0
        },
        {
            "class": "kelpie",
            "score": 2.9
        }
    ]
}

function App() {
    return (
        <div className='App'>
            <ChartComponent />
            <SideBar dataPoint={placeholderData} />
        </div>
    );
}

export default App;
