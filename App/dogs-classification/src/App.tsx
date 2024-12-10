import { MemoryUsageHelper } from 'scichart';
import ChartComponent from './Bubble3DChart';
import SideBar from './SideBar';
import { IDataPoint } from './interfaces';
import { useState } from 'react';

MemoryUsageHelper.isMemoryUsageDebugEnabled = true;

function App() {
    const [selectedDataPoint, setSelectedDataPoint] = useState<IDataPoint>();

    return (
        <div className='App'>
                <ChartComponent onDataPointClick={(dataPoint) => setSelectedDataPoint(dataPoint)} />
                <SideBar dataPoint={selectedDataPoint} />
        </div>
    );
}

export default App;
