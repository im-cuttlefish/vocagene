import { Complex, exp } from "../complex";
import { dft, idft } from "../fourier";

export const getSignalFromCepstrum = (cepstrum: Complex[]): Complex[] => {
  const signal = dft(cepstrum);

  for (let i = 0; i < signal.length; i++) {
    signal[i] = exp(signal[i]);
  }

  return idft(signal);
};
