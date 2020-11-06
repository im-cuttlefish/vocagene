import { Complex, log } from "../complex";
import { dft, idft } from "../fourier";

export const getCepstrum = (signal: number[] | Complex[]): Complex[] => {
  const spectre = dft(signal);

  for (let i = 0; i < spectre.length; i++) {
    spectre[i] = log(spectre[i]) ?? [0, 0];
  }

  return idft(spectre);
};
