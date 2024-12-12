import { describe, it, expect } from "vitest";
import { tsAutocomplete } from "./tsAutocomplete.js";
import { EditorState } from "@codemirror/state";
import { CompletionContext } from "@codemirror/autocomplete";
import { tsFacet } from "../facet/tsFacet.js";
import { getEnv } from "../../test/env.js";

describe("tsAutocomplete", () => {
  it("null", async () => {
    const a = tsAutocomplete();
    const state = EditorState.create();
    await expect(a(new CompletionContext(state, 0, true))).resolves.toBeNull();
  });

  it("getting completions successfully", async () => {
    const a = tsAutocomplete();
    const doc = "export const x = 10.";
    const env = getEnv();

    const path = "/foo.ts";
    const content = "const x = 'hi'.";
    env.createFile(path, content);

    const state = EditorState.create({
      doc,
      extensions: [tsFacet.of({ env, path })],
    });

    const completions = await a(new CompletionContext(state, doc.length, true));

    expect(completions).toMatchObject({
      from: doc.length,
      options: expect.any(Array),
    });
  });
});
