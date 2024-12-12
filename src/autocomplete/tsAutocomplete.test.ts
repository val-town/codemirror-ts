import { CompletionContext } from "@codemirror/autocomplete";
import { EditorState } from "@codemirror/state";
import { EditorView } from "codemirror";
/**
 * @vitest-environment happy-dom
 */
import { describe, expect, it } from "vitest";
import { getEnv } from "../../test/env.js";
import { tsFacet } from "../facet/tsFacet.js";
import { tsAutocomplete } from "./tsAutocomplete.js";

/**
 * This test runs in happy-dom so that it can boot up an
 * EditorView that requires document to be defined.
 */
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

	it("getting a completion with a codeAction", async () => {
		const env = getEnv();

		const bpath = "/bar.ts";
		const bcontent = "export const MAGIC_NUMBER = 42;";
		env.createFile(bpath, bcontent);

		const path = "/foo.ts";
		const doc = "console.log(MAGIC_N";
		env.createFile(path, doc);

		const state = EditorState.create({
			doc,
			extensions: [tsFacet.of({ env, path })],
		});

		const a = tsAutocomplete();
		const completions = await a(new CompletionContext(state, doc.length, true));

		expect(completions).toMatchObject({
			from: expect.any(Number),
			options: expect.any(Array),
		});

		if (!completions) return expect.fail("completions was null");

		const autoimport = completions.options.find(
			(opt) => typeof opt.apply === "function",
		);

		expect(autoimport).toBeTruthy();
		expect(autoimport?.apply).toBeTypeOf("function");

		const view = new EditorView({
			state,
		});

		// I don't know how to use a vitest expectation as a type guard,
		// is there a way?
		if (typeof autoimport?.apply !== "function")
			return expect.fail("autoimport had a non-fn apply method");

		autoimport.apply(
			view,
			autoimport,
			// NOTE: this is hardcoding some stuff that CodeMirror 'properly'
			// calculates internally. See how it does this:
			//
			// https://github.com/codemirror/autocomplete/blob/62dead94d0f4b256f0b437b4733cfef6449e8453/src/state.ts#L324
			//
			// But we are not in such a lucky position: completionState
			// is internal, and I am not having much luck right now finding
			// a way to really configure tsAutocomplete as an extension
			// and programmatically invoke it.
			//
			// But this does test the basic importing mechanism here.
			completions.from,
			completions.from + "MAGIC_N".length,
		);

		expect(view.state.doc.toString()).toMatchInlineSnapshot(`
      "import { MAGIC_NUMBER } from "./bar";

      console.log(MAGIC_NUMBER"
    `);
	});
});
