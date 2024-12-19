import { MemoryUsageHelper } from 'scichart';
import ChartComponent from './Bubble3DChart';
import SideBar from './SideBar';
import { IDataPoint } from './interfaces';
import { useEffect, useState } from 'react';
import { fetchData } from './ApiService';

MemoryUsageHelper.isMemoryUsageDebugEnabled = true;

function App() {
    const [selectedDataPoint, setSelectedDataPoint] = useState<IDataPoint>();
    const [dataPoints, setDataPoints] = useState<IDataPoint[]>([]);

    useEffect(() => {
        init()
    }, []);

    const init = async () => {
        const response = await fetchData();
        setDataPoints(response.data);
    }

    return (
        <div className='App'>
            <ChartComponent 
                onDataPointClick={(dataPoint) => setSelectedDataPoint(dataPoint)} 
                dataPoints={dataPoints}
            />
            <SideBar 
                dataPoint={selectedDataPoint} 
                addDataPoint={(dataPoint) => setDataPoints([...dataPoints, dataPoint])}
            />
        </div>
    );
}

export default App;
