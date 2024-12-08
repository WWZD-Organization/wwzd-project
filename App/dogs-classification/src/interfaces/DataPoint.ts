import { Prediction } from ".";

export interface DataPoint {
    name: string;
    prediction: Prediction[];
    file: string;
    x: number;
    y: number;
    z: number;
}