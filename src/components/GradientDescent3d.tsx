import { useEffect, useRef, useState, useCallback } from "react";
import { SurfaceData, FunctionType } from "../../wasm/pkg/owengombas";
import Plotly, { Layout, Data } from "plotly.js-dist-min";
import './GradientDescent.css';

function GradientDescent() {
    const plotContainerRef = useRef<HTMLDivElement>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const surfaceRef = useRef<SurfaceData | null>(null);
    const [pathData, setPathData] = useState<{ x: number[]; y: number[]; z: number[] }>({
        x: [],
        y: [],
        z: [],
    });

    const [is3D, setIs3D] = useState(false);

    const xMin = -10, xMax = 10, xSteps = 150;
    const yMin = -10, yMax = 10, ySteps = 150;

    const x = useRef<number[]>([]);
    const y = useRef<number[]>([]);
    const z = useRef<number[][]>([]);

    const formatZ = (zFlat: number[]): number[][] =>
        Array.from({ length: ySteps }, (_, i) =>
            zFlat.slice(i * xSteps, (i + 1) * xSteps)
        );

    const interpolateRGB = (
        start: [number, number, number],
        end: [number, number, number],
        steps: number
    ): string[] =>
        Array.from({ length: steps }, (_, i) => {
            const rgb = [0, 1, 2].map(j =>
                Math.round(start[j] + ((end[j] - start[j]) * i) / (steps - 1))
            );
            return `rgb(${rgb.join(",")})`;
        });

    const animatePath = useCallback((xPath: number[], yPath: number[], zPath?: number[]) => {
        if (intervalRef.current) clearTimeout(intervalRef.current);

        let i = 0;
        const maxColors = 15;
        const colors = interpolateRGB([255, 178, 44], [250, 64, 50], maxColors);

        const drawNextPoint = () => {
            if (!plotContainerRef.current || i >= xPath.length) return;

            const restyleData: any = {
                x: [xPath.slice(0, i + 1)],
                y: [yPath.slice(0, i + 1)],
                line: { color: colors[Math.min(i, maxColors - 1)], width: 1 },
                marker: { color: 'red', size: 7, symbol: 'circle' },
            };

            if (is3D && zPath) {
                restyleData.z = [zPath.slice(0, i + 1)];
            }

            setPathData({ x: xPath, y: yPath, z: zPath || Array(xPath.length).fill(0) });
            Plotly.restyle(plotContainerRef.current, restyleData, [1]);

            i++;
            const timeout = 50 / Math.pow(i, 2);
            intervalRef.current = setTimeout(drawNextPoint, timeout);
        };

        drawNextPoint();
    }, [is3D]);

    const drawPlot = useCallback(() => {
        if (!plotContainerRef.current) return;

        const surface = surfaceRef.current;
        if (!surface) return;

        x.current = Array.from(surface.x());
        y.current = Array.from(surface.y());
        const zFlat = Array.from(surface.z());
        z.current = formatZ(zFlat);

        const surfacePlot: Data = is3D
            ? {
                x: x.current,
                y: y.current,
                z: z.current,
                type: "surface",
                colorscale: [
                    [0, "#222831"],
                    [1, "#DFD0B8"],
                ],
                opacity: 1,
                showscale: false,
                name: "Rastrigin",
            }
            : {
                x: x.current,
                y: y.current,
                z: z.current,
                type: "contour",
                colorscale: [
                    [0, "#222831"],
                    [1, "#DFD0B8"],
                ],
                showscale: false,
                name: "Rastrigin",
            };

        const pathPlot: Data = {
            x: pathData.x,
            y: pathData.y,
            z: is3D ? pathData.z : undefined,
            type: is3D ? "scatter3d" : "scatter",
            mode: "lines+markers",
            line: { color: "#FF204E", width: 2 },
            marker: { color: "#FF204E", size: 6 },
            name: "Descent Path",
            uid: "descent_path",
        };

        const layout: Partial<Layout> = is3D
            ? {
                scene: {
                    xaxis: { range: [xMin, xMax] },
                    yaxis: { range: [yMin, yMax] },
                    zaxis: { range: [0, 100] }, // approximate Z
                },
                margin: { t: 0, l: 0, r: 0, b: 0 },
                uirevision: "keep",
            }
            : {
                xaxis: { fixedrange: true, range: [xMin, xMax] },
                yaxis: { fixedrange: true, range: [yMin, yMax] },
                margin: { t: 0, l: 0, r: 0, b: 0 },
                uirevision: "keep",
            };

        Plotly.newPlot(plotContainerRef.current, [surfacePlot, pathPlot], layout, {
            responsive: true,
        });
    }, [is3D]);

    useEffect(() => {
        surfaceRef.current = new SurfaceData(
            xMin, xMax, xSteps,
            yMin, yMax, ySteps,
            FunctionType.Rastrigin
        );
        drawPlot();
    }, [drawPlot]);

    // Attach native click to whole plot container
    useEffect(() => {
        const plotEl = plotContainerRef.current;
        if (!plotEl) return;

        const handleClick = (event: MouseEvent) => {
            const { offsetX, offsetY } = event;
            const { offsetWidth, offsetHeight } = plotEl;

            const normX = offsetX / offsetWidth;
            const normY = offsetY / offsetHeight;

            const x0 = xMin + normX * (xMax - xMin);
            const y0 = yMax - normY * (yMax - yMin); // screen coords are top-down

            const surface = surfaceRef.current;
            if (!surface) return;

            const pathFlat = Array.from(surface.minimize(x0, y0));
            const [xPath, yPath, zPath] = [0, 1, 2].map(offset =>
                pathFlat.filter((_, i) => i % 3 === offset)
            ) as [number[], number[], number[]];

            animatePath(xPath, yPath, zPath);
        };

        plotEl.addEventListener("click", handleClick);
        return () => plotEl.removeEventListener("click", handleClick);
    }, [animatePath]);

    return (
        <div className="gradient-container">
            <button className="toggle-btn" onClick={() => setIs3D(prev => !prev)}>
                Switch to {is3D ? "2D" : "3D"}
            </button>
            <div ref={plotContainerRef} id="plot" className="plot-container" />
        </div>
    );
}

export default GradientDescent;