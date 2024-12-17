import type { Completion } from "@codemirror/autocomplete";
import type { RawCompletionItem } from "../types.js";

export type AutocompleteOptions = {
  renderAutocomplete?: AutocompleteRenderer;
};

export type AutocompleteRenderer = (
  arg0: RawCompletionItem,
) => Completion["info"];
