import type { AutocompleteRenderer } from "./types.js";
import { renderDisplayParts } from "../renderDisplayParts.js";

/**
 * Default, barebones tooltip renderer. Generates
 * structure of a div, containing a series of
 * span elements with the typescript `kind` as
 * classes.
 */
export const defaultAutocompleteRenderer: AutocompleteRenderer = (raw) => {
  return () => {
    const div = document.createElement("div");
    if (raw?.displayParts) {
      div.appendChild(renderDisplayParts(raw.displayParts));
    }
    return { dom: div };
  };
};
