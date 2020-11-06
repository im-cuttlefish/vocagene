export interface STFTSpec {
  window: (x: number) => number;
  frameSize: number;
  frameShift: number;
}
