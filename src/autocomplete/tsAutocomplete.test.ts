import { describe, it, expect } from "vitest";
import { tsAutocomplete } from "./tsAutocomplete.js";
import { EditorState } from "@codemirror/state";
import { CompletionContext } from "@codemirror/autocomplete";

describe("tsAutocomplete", () => {
  it("null", async () => {
    const a = tsAutocomplete();
    const state = EditorState.create();
    await expect(a(new CompletionContext(state, 0, true))).resolves.toBeNull();
  });
});
