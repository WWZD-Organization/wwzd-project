import { appTheme } from "./theme";

import {
    SciChart3DSurface,
    CameraController,
    Vector3,
    MouseWheelZoomModifier3D,
    OrbitModifier3D,
    ResetCamera3DModifier,
    NumericAxis3D,
    NumberRange,
    ScatterRenderableSeries3D,
    XyzDataSeries3D,
    SpherePointMarker3D,
    TGradientStop,
    parseColorToUIntArgb,
    TooltipModifier3D,
    SeriesInfo3D,
    TooltipSvgAnnotation3D,
    XyzSeriesInfo3D,
} from "scichart";
import { IDataPoint } from "../interfaces/IDataPoint";
import { IPrediction } from "../interfaces";

type TMetadata = {
    color: string;
    vertexColor: number;
    pointScale: number;
} & IDataPoint;

export const drawInitData = (onDataPointSelected: (dataPoint: IDataPoint) => void, dataPoints: IDataPoint[]) => {
    return async (rootElement: string | HTMLDivElement) => {
    SciChart3DSurface.UseCommunityLicense();
    const { sciChart3DSurface, wasmContext } = await SciChart3DSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });
    sciChart3DSurface.camera = new CameraController(wasmContext, {
        position: new Vector3(-141.6, 310.29, 393.32),
        target: new Vector3(0, 50, 0),
    });

    let selectedDog: IDataPoint | null = null;

    sciChart3DSurface.chartModifiers.add(
        new MouseWheelZoomModifier3D(),
        new OrbitModifier3D(),
        new ResetCamera3DModifier()
    );

    const tooltipModifier = new TooltipModifier3D({ tooltipLegendOffsetX: 10, tooltipLegendOffsetY: 10 });
    tooltipModifier.tooltipDataTemplate = (seriesInfo: SeriesInfo3D) => {
        const valuesWithLabels: string[] = [];
        if (seriesInfo && seriesInfo.isHit) {
            const md = (seriesInfo as XyzSeriesInfo3D).pointMetadata as TMetadata;
            const bestPrediction = getBestPrediction(md.prediction);
            const value = deterministicValue(bestPrediction);
            valuesWithLabels.push(`Name: ${md.name}`);
            valuesWithLabels.push(`Prediction: ${bestPrediction}`);
            valuesWithLabels.push(`Value: ${value}`);
            valuesWithLabels.push(`X: ${seriesInfo.xValue}`);
            valuesWithLabels.push(`Y: ${seriesInfo.yValue}`);
            valuesWithLabels.push(`Z: ${seriesInfo.zValue}`);
            selectedDog = md;
        }
        return valuesWithLabels;
    };
    const defaultTemplate = tooltipModifier.tooltipSvgTemplate;
    tooltipModifier.tooltipSvgTemplate = (seriesInfo: SeriesInfo3D, svgAnnotation: TooltipSvgAnnotation3D) => {
        if (seriesInfo) {
            const md = (seriesInfo as XyzSeriesInfo3D).pointMetadata as TMetadata;
            svgAnnotation.containerBackground = md.color;
            svgAnnotation.textStroke = "white";
        }
        return defaultTemplate(seriesInfo, svgAnnotation);
    };
    tooltipModifier.modifierMouseDown = () => {
        if (!selectedDog) {
            return;
        }
        onDataPointSelected(selectedDog);
    }
    sciChart3DSurface.chartModifiers.add(tooltipModifier);

    sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "X",
        visibleRange: new NumberRange(-25, 25),
    });
    sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "Y",
        visibleRange: new NumberRange(-25, 25),
    });
    sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "Z",
        visibleRange: new NumberRange(-25, 25),
    });

    const x = dataPoints.map((item) => item.x);
    const y = dataPoints.map((item) => item.y);
    const z = dataPoints.map((item) => item.z);

    const metadata = formatMetadata(dataPoints, [
        { offset: 0.975, color: appTheme.VividSkyBlue },
        { offset: 0.95, color: appTheme.VividPink },
        { offset: 0.925, color: appTheme.VividTeal },
        { offset: 0.9, color: appTheme.VividOrange },
        { offset: 0.875, color: appTheme.VividBlue },
        { offset: 0.85, color: appTheme.VividPurple },
        { offset: 0.825, color: appTheme.VividGreen },
        { offset: 0.8, color: appTheme.VividRed },
        { offset: 0.775, color: appTheme.DarkIndigo },
        { offset: 0.75, color: appTheme.Indigo },
        { offset: 0.725, color: appTheme.MutedSkyBlue },
        { offset: 0.7, color: appTheme.MutedPink },
        { offset: 0.675, color: appTheme.MutedTeal },
        { offset: 0.65, color: appTheme.MutedOrange },
        { offset: 0.625, color: appTheme.MutedBlue },
        { offset: 0.6, color: appTheme.MutedPurple },
        { offset: 0.575, color: appTheme.MutedRed },
        { offset: 0.55, color: appTheme.PaleSkyBlue },
        { offset: 0.525, color: appTheme.PalePink },
        { offset: 0.5, color: appTheme.PaleTeal },
        { offset: 0.475, color: appTheme.PaleOrange },
        { offset: 0.45, color: appTheme.PaleBlue },
        { offset: 0.425, color: appTheme.PalePurple },
        { offset: 0.4, color: appTheme.LightGray },
        { offset: 0.375, color: appTheme.DarkGray },
        { offset: 0.35, color: appTheme.LightGreen },
        { offset: 0.325, color: appTheme.DarkGreen },
        { offset: 0.3, color: appTheme.LightYellow },
        { offset: 0.275, color: appTheme.DarkYellow },
        { offset: 0.25, color: appTheme.LightCyan },
        { offset: 0.225, color: appTheme.DarkCyan },
        { offset: 0.2, color: appTheme.LightCoral },
        { offset: 0.175, color: appTheme.DarkCoral },
        { offset: 0.15, color: appTheme.LightSalmon },
        { offset: 0.125, color: appTheme.DarkSalmon },
        { offset: 0.1, color: appTheme.LightSlateGray },
        { offset: 0.075, color: appTheme.LightMagenta },
        { offset: 0.05, color: appTheme.DarkMagenta },
        { offset: 0.025, color: appTheme.LightGold },
        { offset: 0, color: appTheme.DarkGold },
    ]);

    sciChart3DSurface.renderableSeries.add(
        new ScatterRenderableSeries3D(wasmContext, {
            dataSeries: new XyzDataSeries3D(wasmContext, {
                xValues: x,
                yValues: y,
                zValues: z,
                metadata,
            }),
            pointMarker: new SpherePointMarker3D(wasmContext, { size: 10 }),
            opacity: 0.9,
        })
    );

    return { sciChartSurface: sciChart3DSurface };
};

function getBestPrediction(prediction: IPrediction[]): string {
    return prediction.sort((a, b) => (a.score > b.score ? -1 : 1))[0].class;
}

function deterministicValue(input: string): number {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
        const char = input.charCodeAt(i);
        hash = (hash << 7) - hash + char;
        hash |= 0;
    }
    const normalized = (hash >>> 0) / 0xFFFFFFFF;
    return normalized;
}


function formatMetadata(dogsData: IDataPoint[], gradientStops: TGradientStop[]): TMetadata[] {
    const sGradientStops = gradientStops.sort((a, b) => (a.offset > b.offset ? 1 : -1));
    const metaData: TMetadata[] = [];
    for (const item of dogsData) {
        const bestPrediction = getBestPrediction(item.prediction);
        const valueScale = deterministicValue(bestPrediction);
        let index = sGradientStops.findIndex((gs) => gs.offset >= valueScale);
        index = index === -1 ? sGradientStops.length - 1 : index;
        const color = sGradientStops[index].color;
        const vertexColor = parseColorToUIntArgb(color);
        metaData.push({ pointScale: 1, vertexColor: vertexColor, color: color, ...item });
    }
    return metaData;
}};
