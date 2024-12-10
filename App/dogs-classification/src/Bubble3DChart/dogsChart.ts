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
import { fetchData } from "../ApiService";
import { IApiResponse } from "../interfaces/IApiResponse";
import { IPrediction } from "../interfaces";

type TMetadata = {
    color: string;
    vertexColor: number;
    pointScale: number;
} & IDataPoint;

export const drawInitData = async (rootElement: string | HTMLDivElement) => {
    SciChart3DSurface.UseCommunityLicense();
    const { sciChart3DSurface, wasmContext } = await SciChart3DSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });
    sciChart3DSurface.camera = new CameraController(wasmContext, {
        position: new Vector3(-141.6, 310.29, 393.32),
        target: new Vector3(0, 50, 0),
    });

    sciChart3DSurface.chartModifiers.add(
        new MouseWheelZoomModifier3D(),
        new OrbitModifier3D(),
        new ResetCamera3DModifier()
    );

    const tooltipModifier = new TooltipModifier3D({ tooltipLegendOffsetX: 10, tooltipLegendOffsetY: 10 });
    tooltipModifier.tooltipDataTemplate = (seriesInfo: SeriesInfo3D, svgAnnotation: TooltipSvgAnnotation3D) => {
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
    sciChart3DSurface.chartModifiers.add(tooltipModifier);

    sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "X",
        visibleRange: new NumberRange(-35, 35),
    });
    sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "Y",
        visibleRange: new NumberRange(-35, 35),
    });
    sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "Z",
        visibleRange: new NumberRange(-35, 35),
    });

    const response: IApiResponse = await fetchData();
    const dogsData = response.data;

    const x = dogsData.map((item) => item.x);
    const y = dogsData.map((item) => item.y);
    const z = dogsData.map((item) => item.z);

    const metadata = formatMetadata(dogsData, [
        { offset: 0.95, color: appTheme.VividOrange },
        { offset: 0.9, color: appTheme.VividRed },
        { offset: 0.85, color: appTheme.MutedRed },
        { offset: 0.8, color: appTheme.MutedBlue },
        { offset: 0.75, color: appTheme.VividGreen },
        { offset: 0.7, color: appTheme.VividTeal },
        { offset: 0.65, color: appTheme.VividSkyBlue },
        { offset: 0.6, color: appTheme.Indigo },
        { offset: 0.55, color: appTheme.DarkIndigo },
        { offset: 0.5, color: appTheme.VividPink },
        { offset: 0.45, color: appTheme.MutedTeal },
        { offset: 0.4, color: appTheme.MutedOrange },
        { offset: 0.35, color: appTheme.VividPurple },
        { offset: 0.3, color: appTheme.PalePink },
        { offset: 0.25, color: appTheme.PaleTeal },
        { offset: 0.2, color: appTheme.PaleOrange },
        { offset: 0.15, color: appTheme.PaleBlue },
        { offset: 0.1, color: appTheme.PalePurple },
        { offset: 0.05, color: appTheme.MutedPurple },
        { offset: 0, color: appTheme.VividPurple },
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
    return prediction.sort((a, b) => (a.class > b.class ? 1 : -1))[0].class;
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
        const index = sGradientStops.findIndex((gs) => gs.offset >= valueScale);
        const color = sGradientStops[index].color;
        const vertexColor = parseColorToUIntArgb(color);
        metaData.push({ pointScale: 1, vertexColor: vertexColor, color: color, ...item });
    }
    return metaData;
}
