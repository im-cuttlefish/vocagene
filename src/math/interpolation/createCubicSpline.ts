import { createBinarySearch } from "../search/createBinarySearch";
import { TDMA, TDMatrix } from "../solver/TDMA";
import { getGradient } from "./internal/getGradient";
import { Interpolator, Point } from "./types";

export class CubicSplineInterpolator implements Interpolator {
  readonly points: readonly Point[];
  private coefficients: [number, number, number][];

  constructor(points: Point[]) {
    this.points = points;
    this.coefficients = [];

    const coefficient = getCoefficient(points);
    const right = getRight(points);
    const u = [0, ...TDMA(coefficient, right), 0];

    for (let i = 0; i < u.length - 1; i++) {
      const x0 = points[i][0];
      const x1 = points[i + 1][0];
      const g = getGradient(points[i + 1], points[i]);

      const c3 = (u[i + 1] - u[i]) / (6 * (x1 - x0));
      const c2 = u[i] / 2;
      const c1 = g - (1 / 6) * (x1 - x0) * (2 * u[i] + u[i + 1]);

      this.coefficients[i] = [c3, c2, c1];
    }
  }

  interpolate(x: number): number {
    const n = this.coefficients.length;
    const binarySearch = createBinarySearch((y: Point) => y[0] >= x);
    let i = binarySearch(this.points) - 1;
    i = i < 0 ? 0 : i >= n - 1 ? n - 1 : i;

    const [x0, y0] = this.points[i];
    const [c3, c2, c1] = this.coefficients[i];
    const p = x - x0;

    return c3 * p ** 3 + c2 * p ** 2 + c1 * p + y0;
  }
}

const getCoefficient = (points: Point[]) => {
  const n = points.length;
  const coefficient: TDMatrix = [];

  for (let i = 0; i < n - 2; i++) {
    const h0 = points[i + 1][0] - points[i][0];
    const h1 = points[i + 2][0] - points[i + 1][0];

    if (i === 0) {
      coefficient[i] = [2 * (h0 + h1), h1, 0];
      continue;
    }

    if (i === n - 3) {
      coefficient[i] = [h0, 2 * (h0 + h1), 0];
      break;
    }

    coefficient[i] = [h0, 2 * (h0 + h1), h1];
  }

  return coefficient;
};

const getRight = (points: Point[]) => {
  const n = points.length;
  const right: number[] = [];

  for (let i = 0; i < n - 2; i++) {
    const g0 = getGradient(points[i], points[i + 1]);
    const g1 = getGradient(points[i + 1], points[i + 2]);
    right[i] = 6 * (g1 - g0);
  }

  return right;
};
