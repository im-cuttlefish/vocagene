import { ifft } from "./ifft";
import { add, cis, mul, Complex } from "../complex";
import { isComplexSignal } from "./internal/isComplexSignal";

export const idft = (signal: number[] | Complex[]): Complex[] => {
  const n = signal.length;
  const spectrum: Complex[] = [];
  const is_pow2 = n !== 0 && (n & (n - 1)) === 0;

  if (is_pow2) {
    return ifft(signal);
  }

  if (isComplexSignal(signal)) {
    for (let k = 0; k < n; k++) {
      let sum: Complex = [0, 0];

      for (let i = 0; i < n; i++) {
        const z = mul(signal[i], cis((-2 * Math.PI * k * i) / n));
        sum = add(z, sum);
      }

      spectrum.push(sum);
    }

    return spectrum;
  }

  for (let k = 0; k < n; k++) {
    let sum: Complex = [0, 0];

    for (let i = 0; i < n; i++) {
      const z = mul([signal[i], 0], cis((2 * Math.PI * k * i) / n));
      sum = add(z, sum);
    }

    spectrum.push(sum);
  }

  return spectrum;
};
