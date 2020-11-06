import { createBinarySearch } from "../search/createBinarySearch";
import { getGradient } from "./internal/getGradient";
import { ModifiableInterpolator, Point } from "./types";

export class CatmullRomSplineInterpolator implements ModifiableInterpolator {
  points: Point[];
  private coefficients: [number, number, number][];

  constructor(points: Point[]) {
    this.points = points;
    this.coefficients = [];
    this.update();
  }

  update = (from = 0, by = Infinity) => {
    const n = this.points.length;
    from = from < 0 ? 0 : from;
    by = by > n - 2 ? n - 2 : by;

    for (let i = from; i <= by; i++) {
      if (i === 0) {
        this.createStartSpline();
        continue;
      }

      if (i === n - 2) {
        this.createEndSpline();
        break;
      }

      this.createSpline(i);
    }
  };

  private createStartSpline = () => {
    const [p0, p1, p2] = this.points;
    const g0 = getGradient(p0, p1);
    const g1 = getGradient(p0, p2);

    this.coefficients[0] = [0, (g0 - g1) / (p0[0] - p1[0]), g1];
  };

  private createEndSpline = () => {
    const n = this.points.length;
    const [p0, p1, p2] = this.points.slice(n - 3);
    const g0 = getGradient(p2, p1);
    const g1 = getGradient(p2, p0);

    this.coefficients[n - 2] = [0, (g0 - g1) / (p2[0] - p1[0]), g1];
  };

  private createSpline = (i: number) => {
    const [p0, p1, p2, p3] = this.points.slice(i - 1, i + 3);
    const [x0, y0] = p1;
    const [x1, y1] = p2;
    const g0 = getGradient(p0, p2) * (x1 - x0);
    const g1 = getGradient(p1, p3) * (x1 - x0);

    const c3 = (2 * (y0 - y1) + g0 + g1) / (x1 - x0) ** 3;
    const c2 = (-3 * (y0 - y1) - 2 * g0 - g1) / (x1 - x0) ** 2;
    const c1 = g0 / (x1 - x0);

    this.coefficients[i] = [c3, c2, c1];
  };

  add = (point: Point) => {
    const N = this.points.length;
    const binarySearch = createBinarySearch((p: Point) => p[0] >= point[0]);
    let i = binarySearch(this.points);
    i = i < 0 ? 0 : i >= N - 2 ? N - 2 : i;

    this.points.splice(i, 0, point);
    this.coefficients.splice(i, 0, [0, 0, 0]);
    this.update(i - 2, i + 1);
  };

  remove = (index: number) => {
    this.points.splice(index, 1);
    this.coefficients.splice(index, 1);
    this.update(index - 2, index);
  };

  replace = (index: number, point: Point) => {
    this.points[index] = point;
    this.update(index - 2, index + 1);
  };

  interpolate = (x: number) => {
    const n = this.points.length;
    const binarySearch = createBinarySearch((p: Point) => p[0] >= x);
    let i = binarySearch(this.points) - 1;
    i = i < 0 ? 0 : i >= n - 2 ? n - 2 : i;

    const [x1, y1] = this.points[i || 1];
    const [c3, c2, c1] = this.coefficients[i];
    const p = x - x1;

    return c3 * p ** 3 + c2 * p ** 2 + c1 * p + y1;
  };
}
