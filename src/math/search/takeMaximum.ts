type Point = [number, number];

export const takeMaximum = (fn: number[] | Point[]): Point => {
  if (isPoints(fn)) {
    let max: Point = [0, 0];

    for (let i = 0; i < fn.length; i++) {
      if (fn[i][1] > max[1]) {
        max = fn[i];
      }
    }

    return [...max];
  }

  let max: Point = [0, 0];

  for (let i = 0; i < fn.length; i++) {
    if (fn[i] > max[1]) {
      max = [i, fn[i]];
    }
  }

  return max;
};

const isPoints = (fn: number[] | Point[]): fn is Point[] => {
  return Array.isArray(fn[0]);
};
