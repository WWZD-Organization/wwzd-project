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
    ModifierMouseArgs,
} from "scichart";
import { DataPoint } from "../interfaces/DataPoint";
import { fetchData } from "../ApiService";
import { ApiResponse } from "../interfaces/ApiResponse";

interface  TMetadata extends DataPoint  {
    color: string;
    vertexColor: number;
    pointScale: number;
};

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
        new ResetCamera3DModifier(),
    );

    const tooltipModifier = new TooltipModifier3D({ tooltipLegendOffsetX: 10, tooltipLegendOffsetY: 10 });
    tooltipModifier.tooltipDataTemplate = (seriesInfo: SeriesInfo3D) => {
        const valuesWithLabels: string[] = [];
        if (seriesInfo && seriesInfo.isHit) {
            const md = (seriesInfo as XyzSeriesInfo3D).pointMetadata as TMetadata;
            valuesWithLabels.push(md.name);
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

    tooltipModifier.modifierMouseEnter = (args) => {
        console.log("Mouse entered");
    }

    sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "X",
        visibleRange: new NumberRange(-50, 50),
    });
    sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "Y",
        visibleRange: new NumberRange(-50, 50),
    });
    sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "Z",
        visibleRange: new NumberRange(-50, 50),
    });


    const response: ApiResponse = await fetchData();
    const dogsData = response.data;

    const x = dogsData.map((item) => item.x);
    const y = dogsData.map((item) => item.y);
    const z = dogsData.map((item) => item.z);
    const name = dogsData.map((item) => item.name);

    const metadata = formatMetadata(dogsData, [
        { offset: 1, color: appTheme.VividPink },
        { offset: 0.9, color: appTheme.VividOrange },
        { offset: 0.7, color: appTheme.MutedRed },
        { offset: 0.5, color: appTheme.VividGreen },
        { offset: 0.3, color: appTheme.VividSkyBlue },
        { offset: 0.2, color: appTheme.Indigo },
        { offset: 0, color: appTheme.DarkIndigo },
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

function formatMetadata(dogsData: DataPoint[], gradientStops: TGradientStop[]){
    const valuesArray = dogsData.map((item) => item.x);
    const low = Math.min(...valuesArray);
    const high = Math.max(...valuesArray);

    const sGradientStops = gradientStops.sort((a, b) => (a.offset > b.offset ? 1 : -1));
    const metaData = [];
    for (const item of dogsData) {
        const x = item.x;
        const valueScale = (x - low) / (high - low);
        const index = sGradientStops.findIndex((gs) => gs.offset >= valueScale);
        const color = sGradientStops[index].color;
        const vertexColor = parseColorToUIntArgb(color);
        metaData.push({ name: item.name, pointScale: 1 + valueScale, vertexColor, color, prediction: item.prediction, file: item.file, x: item.x, y: item.y, z: item.z});
    }
    return metaData;
}
