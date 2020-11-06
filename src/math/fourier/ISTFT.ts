import { mul, Complex, from, add } from "../complex";
import { idft } from "./idft";
import { STFTSpec } from "./types";

export class ISTFT {
  private window: (x: number) => number;
  private frameSize: number;
  private frameShift: number;

  constructor({ window, frameSize, frameShift }: STFTSpec) {
    this.window = window;
    this.frameSize = frameSize;
    this.frameShift = frameShift;
  }

  istft = (spectrogram: Complex[][]): Complex[] => {
    const { window, frameSize, frameShift } = this;
    const signal: Complex[] = [];

    for (let i = 0; i < spectrogram.length; i++) {
      const offset = i * frameShift;
      const spectrum = spectrogram[i];
      const segment = idft(spectrum);

      for (let k = 0; k < frameSize; k++) {
        const weight = from(window(k / frameSize));
        segment[k] = mul(weight, segment[k]);
        signal[offset + k] ??= from(0);
        signal[offset + k] = add(signal[offset + k], segment[k]);
      }
    }

    return signal;
  };
}
