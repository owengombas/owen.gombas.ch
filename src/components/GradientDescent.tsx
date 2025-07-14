import { useEffect, useRef, useCallback } from 'react';
import { SurfaceData, FunctionType } from '../../wasm/pkg';
import Plotly, { Layout, Data } from 'plotly.js-dist-min';
import './GradientDescent.css'

function GradientDescent() {
    const plotContainerRef = useRef<HTMLDivElement>(null);
    const intervalRef = useRef<NodeJS.Timeout>(null);
    const surfaceRef = useRef<SurfaceData | null>(null);

    const xMin = -10, xMax = 10, xSteps = 150;
    const yMin = -10, yMax = 10, ySteps = 150;

    const x = useRef<number[]>([]);
    const y = useRef<number[]>([]);
    const z = useRef<number[][]>([]);

    const formatZ = (zFlat: number[]): number[][] =>
        Array.from({ length: ySteps }, (_, i) =>
            zFlat.slice(i * xSteps, (i + 1) * xSteps)
        );

    const interpolateRGB = useCallback((start: [number, number, number], end: [number, number, number], steps: number): string[] => {
        return Array.from({ length: steps }, (_, i) =>
            `rgb(${[0, 1, 2].map(j =>
                Math.round(start[j] + ((end[j] - start[j]) * i) / (steps - 1))
            ).join(', ')})`
        );
    }, []);

    const animatePath = useCallback((xPath: number[], yPath: number[]) => {
        if (intervalRef.current) clearTimeout(intervalRef.current);

        let i = 0;
        const maxColors = 15;
        const colors = interpolateRGB([40, 40, 40], [0, 0, 0], maxColors);

        const drawNextPoint = () => {
            if (!plotContainerRef.current || i >= xPath.length) return;

            Plotly.restyle(plotContainerRef.current, {
                x: [xPath.slice(0, i + 1)],
                y: [yPath.slice(0, i + 1)],
                'line.color': colors[Math.min(i, maxColors - 1)],
                'line.width': 1,
                'marker.color': 'black',
                'marker.size': 7,
                'marker.symbol': 'circle',
            }, [1]);

            i++;
            const timeout = 50 / Math.pow(i, 2);
            intervalRef.current = setTimeout(drawNextPoint, timeout);
        };

        drawNextPoint();
    }, [interpolateRGB]);

    useEffect(() => {
        const surface = new SurfaceData(xMin, xMax, xSteps, yMin, yMax, ySteps, FunctionType.Rastrigin);
        surfaceRef.current = surface;

        x.current = Array.from(surface.x());
        y.current = Array.from(surface.y());
        const zFlat = Array.from(surface.z());
        z.current = formatZ(zFlat);

        const surfacePlot: Data = {
            x: x.current,
            y: y.current,
            z: z.current,
            type: 'contour',
            colorscale: [
                [0, '#B43E25'],
                [1, '#E2D1BB'],
            ],
            showscale: false,
            name: 'Rastrigin',
        };

        const pathPlot: Data = {
            x: [],
            y: [],
            type: 'scatter',
            mode: 'lines+markers',
            line: { color: '#FF204E', width: 2 },
            marker: { color: '#FF204E', size: 6 },
            name: 'Descent Path',
            uid: 'descent_path',
        };

        const layout: Partial<Layout> = {
            xaxis: { fixedrange: true, autorange: false, range: [xMin, xMax] },
            yaxis: { fixedrange: true, autorange: false, range: [yMin, yMax] },
            margin: { t: 0, l: 0, r: 0, b: 0 },
            uirevision: 'keep',
        };

        if (plotContainerRef.current) {
            Plotly.newPlot(plotContainerRef.current, [surfacePlot, pathPlot], layout, {
                responsive: true,
                staticPlot: true,
            });
        }

        return () => {
            if (intervalRef.current) clearTimeout(intervalRef.current);
        };
    }, []);

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            const plotEl = plotContainerRef.current;
            if (!plotEl || !(event instanceof MouseEvent)) return;

            // Get mouse position relative to the element
            const boundingRect = plotEl.getBoundingClientRect();
            const offsetX = event.clientX - boundingRect.left;
            const offsetY = event.clientY - boundingRect.top;

            // Normalize [0, 1]
            const normX = offsetX / plotEl.clientWidth;
            const normY = offsetY / plotEl.clientHeight;

            // Convert to logical plot coordinates
            const x0 = xMin + normX * (xMax - xMin);
            const y0 = yMax - normY * (yMax - yMin); // y reversed

            const surface = surfaceRef.current;
            if (!surface) return;

            // Compute descent path
            const pathFlat = Array.from(surface.minimize(x0, y0));
            const [xPath, yPath] = [0, 1].map(offset =>
                pathFlat.filter((_, i) => i % 3 === offset)
            ) as [number[], number[]];

            animatePath(xPath, yPath);
        };

        const plotEl = plotContainerRef.current;
        console.log(plotEl)
        plotEl?.addEventListener('click', handleClick);

        return () => {
            plotEl?.removeEventListener('click', handleClick);
        };
    }, [animatePath]);

    return <div className='plot-wrapper'>
        <div ref={plotContainerRef} id='plot'/>
        <div className='note-wrapper'>
            <div className='note'>Ah and, here's a&nbsp;<a href='https://github.com/owengombas/owen.gombas.ch' target='_blank'>Rust
                + WebAssembly gradient descent implementation</a> on the <a href='https://en.wikipedia.org/wiki/Rastrigin_function' target='_blank'>Rastrigin function</a>.&nbsp;Just
                press anywhere on the zone to start exploring!
            </div>
        </div>
        <div className='gh-tags'>
            <div className='gh-tag'>Rust</div>
            <div className='gh-tag'>WebAssembly</div>
            <div className='gh-tag'>React</div>
            <div className='gh-tag'>TypeScript</div>
            <div className='gh-tag'>Plotly.js</div>
        </div>
    </div>
}

export default GradientDescent;