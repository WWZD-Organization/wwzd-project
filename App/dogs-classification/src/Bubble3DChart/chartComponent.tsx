import { SciChartReact } from "scichart-react";
import classes from "./Examples.module.scss";
import { drawInitData } from "./dogsChartData";

export default function ChartComponent() {
    return <SciChartReact initChart={drawInitData} className={classes.ChartWrapper} />;
}
