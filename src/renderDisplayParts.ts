import type ts from "typescript";

/**
 * Shared method between the default tooltipRenderer
 * and default autocompleteRenderer. This renders TypeScript's
 * SymbolDisplayPart into HTML. You will probably swap this out with a
 * renderer of your own.
 */
export const renderDisplayParts = (displayParts: ts.SymbolDisplayPart[]) => {
  const div = document.createElement("div");
  for (const part of displayParts) {
    const span = div.appendChild(document.createElement("span"));
    span.className = `quick-info-${part.kind}`;
    span.innerText = part.text;
  }
  return div;
};
