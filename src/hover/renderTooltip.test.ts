import { EditorView } from "codemirror";
import { expect, test } from "vitest";
import { defaultRenderer, renderDisplayParts } from "./renderTooltip";
/**
 * @vitest-environment happy-dom
 */

test("defaultRenderer", () => {
  const view = new EditorView({});
  expect(
    defaultRenderer(
      {
        start: 0,
        end: 1,
        typeDef: undefined,
        def: undefined,
        quickInfo: undefined,
      },
      view,
    ),
  ).toHaveProperty("dom");
});

test("renderDisplayParts", () => {
  expect(renderDisplayParts([])).toBeTruthy();
});
