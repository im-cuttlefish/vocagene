import { mul, Complex } from "../complex";
import { dft } from "./dft";
import { isComplexSignal } from "./internal/isComplexSignal";
import { STFTSpec } from "./types";

export class STFT {
  private window: (x: number) => number;
  private frameSize: number;
  private frameShift: number;

  constructor({ window, frameSize, frameShift }: STFTSpec) {
    this.window = window;
    this.frameSize = frameSize;
    this.frameShift = frameShift;
  }

  stft = (x: Complex[] | number[]): Complex[][] => {
    const { window, frameSize, frameShift } = this;
    const length = (x.length / frameShift) | 0;
    const spectrogram: Complex[][] = [];

    if (isComplexSignal(x)) {
      for (let i = 0; i < length; i++) {
        const offset = i * frameShift;
        const segment: Complex[] = [];

        for (let k = 0; k < frameSize; k++) {
          segment[k] = mul([window(k / frameSize), 0], x[offset + k]);
        }

        spectrogram[i] = dft(segment);
      }

      return spectrogram;
    }

    for (let i = 0; i < length; i++) {
      const offset = i * frameShift;
      const segment: number[] = [];

      for (let k = 0; k < frameSize; k++) {
        segment[k] = window(k / frameSize) * x[offset + k];
      }

      spectrogram[i] = dft(segment);
    }

    return spectrogram;
  };
}
