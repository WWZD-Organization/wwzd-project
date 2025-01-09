import { MemoryUsageHelper } from 'scichart';
import ChartComponent from './Bubble3DChart';
import SideBar from './SideBar/SideBar.tsx';
import { IDataPoint } from './interfaces';
import { useEffect, useState } from 'react';
import { fetchData } from './ApiService';

MemoryUsageHelper.isMemoryUsageDebugEnabled = true;

function App() {
    const [selectedDataPoint, setSelectedDataPoint] = useState<IDataPoint>();
    const [dataPoints, setDataPoints] = useState<IDataPoint[]>([]);
    const [selectedMethod, setSelectedMethod] = useState<string>('tsne');  // Stan na kategorię

    useEffect(() => {
        init(selectedMethod)
    }, []);

    const init = async (method: string) => {
        const response = await fetchData(method);
        setDataPoints(response.data);
    }

    const sendMethodToApp = (method: string) => {
        setSelectedMethod(method);  
        init(method); 
    };

    return (
        <div className='App'>
            <ChartComponent 
                onDataPointClick={(dataPoint) => setSelectedDataPoint(dataPoint)} 
                dataPoints={dataPoints}
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
