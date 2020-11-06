import { add, cis, mul, sub, Complex } from "../complex";
import { isComplexSignal } from "./internal/isComplexSignal";

export const ifft = (signal: number[] | Complex[]): Complex[] => {
  const n = signal.length;
  const spectrum: Complex[] = [];
  const tmp: Complex[] = [];

  if (isComplexSignal(signal)) {
    for (let i = 0; i < n; i++) {
      spectrum.push(signal[i]);
      tmp.push([0, 0]);
    }
  } else {
    for (let i = 0; i < n; i++) {
      spectrum.push([signal[i], 0]);
      tmp.push([0, 0]);
    }
  }

  internalIFFT(spectrum, tmp, 0, n);
  return spectrum;
};

const internalIFFT = (io: Complex[], tmp: Complex[], L: number, R: number) => {
  const n = R - L;
  const nh = (n / 2) | 0;
  const theta = (2 * Math.PI) / n;

  if (n <= 1) {
    return;
  }

  for (let k = L; k < nh + L; k++) {
    const w = cis(theta * (k - L));
    tmp[k] = add(io[k], io[k + nh]);
    tmp[k + nh] = mul(w, sub(io[k], io[k + nh]));
  }

  internalIFFT(tmp, io, L, L + nh);
  internalIFFT(tmp, io, L + nh, R);

  for (let k = 0; k < nh; k++) {
    io[2 * k + L] = tmp[k + L];
    io[2 * k + 1 + L] = tmp[k + nh + L];
  }
};
