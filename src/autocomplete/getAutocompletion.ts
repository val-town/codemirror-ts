import type { CompletionContext } from "@codemirror/autocomplete";
import ts from "typescript";
import { type VirtualTypeScriptEnvironment } from "@typescript/vfs";
import { AUTOCOMPLETION_SYMBOLS } from "./symbols.js";
import { DEFAULT_CODEMIRROR_TYPE_ICONS } from "./icons.js";
import { matchBefore } from "./matchBefore.js";
import { RawCompletion, RawCompletionItem } from "../types.js";

const TS_COMPLETE_BLOCKLIST: ts.ScriptElementKind[] = [
  ts.ScriptElementKind.warning,
];

export async function getAutocompletion({
  env,
  path,
  context,
  keepLegacyLimitationForAutocompletionSymbols = true,
}: {
  env: VirtualTypeScriptEnvironment;
  path: string;
  keepLegacyLimitationForAutocompletionSymbols?: boolean;
  /**
   * Allow this to be a subset of the full CompletionContext
   * object, because the raw object isn't serializable.
   */
  context: Pick<CompletionContext, "pos" | "explicit">;
}): Promise<RawCompletion | null> {
  const { pos, explicit } = context;
  const rawContents = env.getSourceFile(path)?.getFullText();

  if (!rawContents) return null;

  // If there's space behind the cursor, don't try and autocomplete.
  // https://codemirror.net/examples/autocompletion/
  let word = matchBefore(rawContents, pos, /\w*/);
  if (!word?.text) {
    word = matchBefore(rawContents, pos, /\./);
  }

  if (!word?.text && !explicit) return null;

  const completionInfo = env.languageService.getCompletionsAtPosition(
    path,
    pos,
    {
      includeCompletionsForModuleExports: true,
      includeCompletionsForImportStatements: true,
    },
    {},
  );

  // TODO: build ATA support for a 'loading' state
  // while types are being fetched
  if (!completionInfo) return null;

  const options = completionInfo.entries
    .filter(
      (entry) =>
        !TS_COMPLETE_BLOCKLIST.includes(entry.kind) &&
        (entry.sortText < "15" ||
          (completionInfo.optionalReplacementSpan?.length &&
            (!keepLegacyLimitationForAutocompletionSymbols ||
              AUTOCOMPLETION_SYMBOLS.includes(entry.name)))),
    )
    .map((entry): RawCompletionItem => {
      let type = entry.kind ? String(entry.kind) : undefined;

      if (type === "member") type = "property";

      if (type && !DEFAULT_CODEMIRROR_TYPE_ICONS.has(type)) {
        type = undefined;
      }

      const details = env.languageService.getCompletionEntryDetails(
        path,
        pos,
        entry.name,
        {},
        entry.source,
        {},
        entry.data,
      );

      return {
        label: entry.name,
        codeActions: details?.codeActions,
        displayParts: details?.displayParts ?? [],
        documentation: details?.documentation,
        tags: details?.tags,
        type,
      };
    });

  return {
    from: word ? (word.text === "." ? word.to : word.from) : pos,
    options,
  };
}
