import { MemoryUsageHelper } from 'scichart';
import ChartComponent from './Bubble3DChart/chartIndex.tsx';
import SideBar from './SideBar/SideBar.tsx';
import { IDataPoint } from './interfaces';
import { useEffect, useState } from 'react';
import { fetchData } from './ApiService';

MemoryUsageHelper.isMemoryUsageDebugEnabled = true;

function App() {
    const [selectedDataPoint, setSelectedDataPoint] = useState<IDataPoint>();
    const [dataPoints, setDataPoints] = useState<IDataPoint[]>([]);
    const [selectedMethod, setSelectedMethod] = useState<string>('tsne'); 

    useEffect(() => {
        init(selectedMethod);
    }, []);

    const init = async (method: string) => {
        const dataPoints = await fetchData(method);
        setDataPoints(dataPoints.data);
    };

    const sendMethodToApp = (method: string) => {
        setSelectedMethod(method);
        init(method);
    };

    return (
        <div className='App'>
            <ChartComponent
                key={dataPoints.map(dp => `${dp.x},${dp.y},${dp.z}`).join('|')} 
                onDataPointClick={(dataPoint) => setSelectedDataPoint(dataPoint)}
                dataPoints={dataPoints}
                methodType={selectedMethod}
            />
            <SideBar
                dataPoint={selectedDataPoint}
                addDataPoint={(dataPoint) => setDataPoints([...dataPoints, dataPoint])}
                sendMethodToApp={sendMethodToApp}
            />
        </div>
    );
}

export default App;
