import { combineConfig, Facet } from "@codemirror/state";
import type ts from "@typescript/vfs";

/**
 * This is how the ts-related extensions are
 * configured: this facet sets the path of the file
 * and the environment to use, and the rest of
 * the extensions, like tsLint and tsAutocomplete,
 * pull those settings automatically from editor state.
 */
export interface TSFacetConfig {
  path: string;
  env: ts.VirtualTypeScriptEnvironment;
  keepLegacyLimitationForAutocompletionSymbols?: boolean;
  /**
   * External library configurations.
   * Key is the library name, value is the types URL or content
   */
  libraries?: Record<string, string>;
}

export const tsFacet = Facet.define<
  TSFacetConfig,
  TSFacetConfig | null
>({
  combine(configs) {
    return combineConfig(configs, {});
  },
});
