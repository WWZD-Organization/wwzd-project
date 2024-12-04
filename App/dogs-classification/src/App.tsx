import { ChangeEventHandler, MouseEventHandler, useRef, useState } from 'react';
import SciChart, { SciChartComponentAPI } from './SciChart';
import { createChart } from './chart-configurations';
import { ISciChartSurfaceBase, MemoryUsageHelper, SciChartSurface } from 'scichart';
import ChartComponent from './Bubble3DChart';
import { fetchData } from './ApiService';

// SciChartSurface.autoDisposeWasmContext = true;
MemoryUsageHelper.isMemoryUsageDebugEnabled = true;

//Awaited<ReturnType<TInitFunction>>['sciChartSurface']  extends ISciChartSurfaceBase
// type TChartAPI<TInitFunction> = 'sciChartSurface' keyof Awaited<ReturnType<TInitFunction>>
// ? SciChartComponentAPI<
//     Awaited<ReturnType<TInitFunction>>['sciChartSurface'],
//     Awaited<ReturnType<TInitFunction>>
//     : never
// >;
type TChartAPI = SciChartComponentAPI<
    Awaited<ReturnType<typeof createChart>>['sciChartSurface'],
    Awaited<ReturnType<typeof createChart>>
>;
function App() {
    // const chartRef = useRef<SciChartComponentAPI<TSurf, TInitResult>>(null);
    const chartRef = useRef<any>(null);
    const [drawChart, setDrawChart] = useState(true);

    const handleCheckbox: ChangeEventHandler<HTMLInputElement> = (e) => {
        setDrawChart(e.target.checked);
    };

    const handleClick: MouseEventHandler<HTMLInputElement> = () => {
        // @ts-ignore
        window.gc && window.gc();
        const state = MemoryUsageHelper.objectRegistry.getState();
        console.log('state', state);
        // chartRef.current.sciChartSurface;
        // chartRef.current.customChartProperties.startDemo();
    };

    return (
        <div className='App'>
            <ChartComponent/>
        </div>
    );
}

export default App;
