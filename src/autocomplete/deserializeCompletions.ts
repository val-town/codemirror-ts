import {
  type Completion,
  insertCompletionText,
  pickedCompletion,
} from "@codemirror/autocomplete";
import type { TransactionSpec } from "@codemirror/state";
import type { EditorView } from "codemirror";
import type ts from "typescript";
import type { RawCompletion, RawCompletionItem } from "../types.js";
import { defaultAutocompleteRenderer } from "./renderAutocomplete.js";
import type { AutocompleteOptions } from "./types.js";

export function deserializeCompletions(
  raw: RawCompletion | null,
  opts: AutocompleteOptions,
) {
  if (!raw) return raw;
  return {
    from: raw.from,
    options: raw.options.map((o) => deserializeCompletion(o, opts)),
  };
}

function deserializeCompletion(
  raw: RawCompletionItem,
  opts: AutocompleteOptions,
): Completion {
  const { codeActions, label, type } = raw;

  return {
    label,
    type,
    apply: codeActions ? codeActionToApplyFunction(codeActions) : raw.label,
    info: (opts?.renderAutocomplete ?? defaultAutocompleteRenderer)(raw),
  };
}

/**
 * The default for CodeMirror completions is that when you hit Tab or the other trigger,
 * it will replace the current 'word' (partially-written text) with the label of the completion.
 * TypeScript provides codeActions that let you import new modules when you accept
 * a completion. This checks whether we have any codeActions, and if we do,
 * lets you import them automatically.
 */
export function codeActionToApplyFunction(codeActions: ts.CodeAction[]) {
  return (
    view: EditorView,
    completion: Completion,
    from: number,
    to: number,
  ) => {
    const insTransaction: TransactionSpec = {
      ...insertCompletionText(view.state, completion.label, from, to),
      annotations: pickedCompletion.of(completion),
    };

    const actionTransactions: TransactionSpec[] = [];

    // Complete, but also implement code actions.
    // https://github.com/codemirror/autocomplete/blob/30307656e85c9e5911a69fe2432de05be1580958/src/state.ts#L322
    for (const action of codeActions) {
      for (const change of action.changes) {
        for (const textChange of change.textChanges) {
          // Note that this may be dangerous! We've had many problems
          // with trying to dispatch transactions on CodeMirror when the length
          // of the document is different than what it expects or needs. I think
          // that this will be safe in that case because we're combining
          // and only declaring the length once.
          //
          // NOTE: this has less than ideal history behavior! ideal this would
          // be composed with `insTransaction` and produce one history event.
          // But that is tough because the two need to perfectly agree on the document that
          // they're editing, and the length of the document changes.
          actionTransactions.push({
            changes: [
              {
                from: textChange.span.start,
                to: textChange.span.start + textChange.span.length,
                insert: textChange.newText,
              },
            ],
            annotations: pickedCompletion.of(completion),
          });
        }
      }
    }

    view.dispatch(...[insTransaction, ...actionTransactions]);
  };
}
