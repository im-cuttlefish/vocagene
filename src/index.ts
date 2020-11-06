import { dft } from "./math/fourier";
import {
  CatmullRomSplineInterpolator,
  CubicSplineInterpolator,
} from "./math/interpolation";

console.log(dft([1, 2, 3, 4]));

const points: [number, number][] = [
  [0.2, 0.2],
  [0.3, 0.4],
  [0.5, 0.3],
  [0.7, 0.6],
];

const interpolator = new CubicSplineInterpolator(points);

const cvs = document.createElement("canvas");
cvs.width = 500;
cvs.height = 600;

const ctx = cvs.getContext("2d")!;

for (let i = 0; i < 500; i++) {
  const y = 600 * interpolator.interpolate(i / 500);
  ctx.fillRect(i, 600 - y, 1, y);
}

document.body.appendChild(cvs);
