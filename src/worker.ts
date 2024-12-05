export interface GetLintsParams {
  path: string;
  diagnosticCodesToIgnore: number[];
  libraries?: Record<string, string>;
}

export * from "./hover/getHover.js";
export * from "./autocomplete/getAutocompletion.js";
export * from "./lint/getLints.js";
export * from "./worker/createWorker.js";
