import type { Completion } from "@codemirror/autocomplete";
import type ts from "typescript";

/**
 * codeAction is a TypeScript-specific thing, that makes
 * auto-importing possible, but it isn't part of the standard CodeMirror
 * system. So adding it custom here and then 'deserializing'
 * on the other side.
 */
export type RawCompletionItem = {
	label: string;
	type: Completion["type"];
} & Pick<
	ts.CompletionEntryDetails,
	"codeActions" | "displayParts" | "documentation" | "tags"
>;

export type RawCompletion = {
	from: number;
	options: RawCompletionItem[];
};
