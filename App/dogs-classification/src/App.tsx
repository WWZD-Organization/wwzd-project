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
    const [selectedCategory, setSelectedCategory] = useState<string>('tsne');  // Stan na kategorię

    useEffect(() => {
        init(selectedCategory)
    }, []);

    const init = async (category: string) => {
        const response = await fetchData(category);
        setDataPoints(response.data);
    }

    const sendCategoryToApp = (category: string) => {
        setSelectedCategory(category);  
        init(category); 
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
                sendCategoryToApp={sendCategoryToApp}
            />
        </div>
    );
}

export default App;
