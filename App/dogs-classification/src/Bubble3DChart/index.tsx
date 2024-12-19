import { SciChartReact } from "scichart-react";
import classes from "./Examples.module.scss";
import { drawInitData } from "./dogsChart";
import { IDataPoint } from "../interfaces";

interface Props {
    onDataPointClick: (dataPoint: IDataPoint) => void;
    dataPoints: IDataPoint[]
}

export default function ChartComponent({ onDataPointClick, dataPoints }: Props) {
    return <SciChartReact initChart={drawInitData(onDataPointClick, dataPoints)} className={classes.ChartWrapper} />;
}
