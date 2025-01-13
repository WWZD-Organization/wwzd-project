import { SciChartReact } from "scichart-react";
import classes from "./Examples.module.scss";
import { drawInitData } from "./dogsChart";
import { IDataPoint } from "../interfaces";

interface Props {
    onDataPointClick: (dataPoint: IDataPoint) => void;
    dataPoints: IDataPoint[],
    methodType: string;
}

export default function ChartComponent({ onDataPointClick, dataPoints, methodType }: Props) {
    return <SciChartReact key={dataPoints.length} initChart={drawInitData(onDataPointClick, dataPoints, methodType)} className={classes.ChartWrapper} />;
}
