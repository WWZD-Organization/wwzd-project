import { IPrediction } from ".";

export interface IDataPoint {
    name: string;
    prediction: IPrediction[];
    file: string;
    x: number;
    y: number;
    z: number;
}