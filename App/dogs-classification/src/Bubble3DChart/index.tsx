import { SciChartReact } from "scichart-react";
import classes from "./Examples.module.scss";
import { drawInitData } from "./dogsChart";
import { IDataPoint } from "../interfaces";

interface Props {
    onDataPointClick: (dataPoint: IDataPoint) => void;
}

export default function ChartComponent({ onDataPointClick }: Props) {
    return <SciChartReact initChart={drawInitData(onDataPointClick)} className={classes.ChartWrapper} />;
}
