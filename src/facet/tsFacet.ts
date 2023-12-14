import { combineConfig, Facet } from "@codemirror/state";
import { type VirtualTypeScriptEnvironment } from "@typescript/vfs";

export const tsFacet = Facet.define<
  {
    path: string;
    env: VirtualTypeScriptEnvironment;
  },
  {
    path: string;
    env: VirtualTypeScriptEnvironment;
  } | null
>({
  combine(configs) {
    return combineConfig(configs, {});
  },
});
