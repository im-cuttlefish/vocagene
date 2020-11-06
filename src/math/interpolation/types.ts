export type Point = [number, number];

export abstract class Interpolator {
  readonly points: readonly Point[];

  constructor(points: Point[]) {
    this.points = points;
  }

  abstract interpolate(x: number): number;
}

export abstract class ModifiableInterpolator implements Interpolator {
  readonly points: readonly Point[];

  constructor(points: Point[]) {
    this.points = points;
  }

  abstract interpolate(x: number): number;
  abstract replace(index: number, point: Point): void;
  abstract add(point: Point): void;
  abstract remove(index: number): void;
}
