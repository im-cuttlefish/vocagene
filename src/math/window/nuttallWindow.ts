export const nuttallWindow = (x: number) => {
  return (
    a0 - a1 * cos(2 * PI * x) + a2 * cos(4 * PI * x) - a3 * cos(6 * PI * x)
  );
};

const { cos, PI } = Math;
const a0 = 0.355768;
const a1 = 0.487396;
const a2 = 0.144232;
const a3 = 0.012604;
