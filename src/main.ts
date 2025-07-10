import "./style.css";
import init, { SurfaceData, FunctionType } from "../wasm/pkg";
import Plotly from "plotly.js-dist-min";

// Initialize WASM module
await init();

// Call WASM constructor to get surface data
const [xMin, xMax, xSteps] = [-10, 10, 150];
const [yMin, yMax, ySteps] = [-10, 10, 150];
const surface = new SurfaceData(xMin, xMax, xSteps, yMin, yMax, ySteps, FunctionType.Rastrigin);

const x = Array.from(surface.x());
const y = Array.from(surface.y());
const zFlat = Array.from(surface.z());
const path = {
  x: [] as number[],
  y: [] as number[],
  z: [] as number[]
};

// Convert flat Z array to 2D array for Plotly
const z: number[][] = Array.from({ length: ySteps }, (_, i) =>
  zFlat.slice(i * xSteps, (i + 1) * xSteps)
);

function getLayout() {
  const layout: Partial<Plotly.Layout> = {
    xaxis: { fixedrange: true, autorange: false, range: [xMin, xMax] },
    yaxis: { fixedrange: true, autorange: false, range: [yMin, yMax] },
    margin: { t: 0, l: 0, r: 0, b: 0 },
    uirevision: "keep",
  };
  return layout;
}

function getTraces() {
  const surfacePlot: Plotly.Data = {
    x,
    y,
    z,
    type: "contour",
    colorscale: [
      [0, "#222831"],
      [1, "#DFD0B8"],
    ],
    showscale: false,
    name: "Rastrigin"
  };

  const pathPlot: Plotly.Data = {
    x: path.x,
    y: path.y,
    type: "scatter",
    mode: "lines+markers",
    line: { color: "#FF204E", width: 2 },
    marker: { color: "#FF204E", size: 6 },
    name: "Descent Path",
    uid: "descent_path",
  };

  return [surfacePlot, pathPlot];
}

// Initial plot
Plotly.newPlot("plot", getTraces(), getLayout(), { responsive: true, staticPlot: true });

function interpolateRGB(
  start: [number, number, number],
  end: [number, number, number],
  steps: number
): string[] {
  const result: string[] = [];

  for (let i = 0; i < steps; i++) {
    const interpolated: [number, number, number] = [0, 0, 0].map((_, j) =>
      Math.round(
        start[j] + ((end[j] - start[j]) * i) / (steps - 1)
      )
    ) as [number, number, number];

    result.push(`rgb(${interpolated[0]}, ${interpolated[1]}, ${interpolated[2]})`);
  }

  return result;
}

let interval: NodeJS.Timeout | undefined;
function animatePath(xPath: number[], yPath: number[]) {
  if (interval) clearTimeout(interval); // clear any existing timeout

  let i = 0;
  const maxColors = 15;
  const colors = interpolateRGB(
    [255, 178, 44],
    [250, 64, 50],
    maxColors,
  );

  const drawNextPoint = () => {
    if (i >= xPath.length) return;

    Plotly.restyle('plot', {
      x: [xPath.slice(0, i + 1)],
      y: [yPath.slice(0, i + 1)],
      'line.color': colors[Math.min(i, maxColors - 1)],
      'line.width': 1,
      'marker.color': 'red',
      'marker.size': 7,
      'marker.symbol': 'circle',
    }, [1]);

    i++;
    const timeout = 50 / Math.pow(i, 2);
    interval = setTimeout(drawNextPoint, timeout);
    console.log(timeout)
  };

  drawNextPoint();
}

document.body.addEventListener("click", (event) => {
  const plot = document.getElementById("plot");
  const rect = plot?.getBoundingClientRect();

  if (!rect) return;

  const clickX = event.clientX - rect.left;
  const clickY = event.clientY - rect.top;

  const plotWidth = rect.width;
  const plotHeight = rect.height;

  const normX = clickX / plotWidth;
  const normY = clickY / plotHeight;

  const x0 = xMin + normX * (xMax - xMin);
  const y0 = yMax - normY * (yMax - yMin);

  const pathFlat = Array.from(surface.minimize(x0, y0));
  const [xPath, yPath] = [0, 1].map(offset =>
    pathFlat.filter((_, i) => i % 3 === offset)
  ) as number[][];

  animatePath(xPath, yPath);
});