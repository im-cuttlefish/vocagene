import { Complex } from "../../complex";

export const isComplexSignal = (x: number[] | Complex[]): x is Complex[] => {
  return Array.isArray(x[0]);
};
