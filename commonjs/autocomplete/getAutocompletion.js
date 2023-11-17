"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAutocompletion = void 0;
const typescript_1 = require("typescript");
const symbols_js_1 = require("./symbols.js");
const icons_js_1 = require("./icons.js");
const matchBefore_js_1 = require("./matchBefore.js");
const TS_COMPLETE_BLOCKLIST = [typescript_1.ScriptElementKind.warning];
async function getAutocompletion({ env, path, context, }) {
    const { pos, explicit } = context;
    const rawContents = env.getSourceFile(path)?.getFullText();
    if (!rawContents)
        return null;
    // If there's space behind the cursor, don't try and autocomplete.
    // https://codemirror.net/examples/autocompletion/
    let word = (0, matchBefore_js_1.matchBefore)(rawContents, pos, /\w*/);
    if (!word?.text) {
        word = (0, matchBefore_js_1.matchBefore)(rawContents, pos, /\./);
    }
    if (!word?.text && !explicit)
        return null;
    const completionInfo = env.languageService.getCompletionsAtPosition(path, pos, {}, {});
    // TODO: build ATA support for a 'loading' state
    // while types are being fetched
    if (!completionInfo)
        return null;
    const options = completionInfo.entries
        .filter((entry) => !TS_COMPLETE_BLOCKLIST.includes(entry.kind) &&
        (entry.sortText < "15" ||
            (completionInfo.optionalReplacementSpan?.length &&
                symbols_js_1.AUTOCOMPLETION_SYMBOLS.includes(entry.name))))
        .map((entry) => {
        const boost = -Number(entry.sortText) || 0;
        let type = entry.kind ? String(entry.kind) : undefined;
        if (type === "member")
            type = "property";
        if (type && !icons_js_1.DEFAULT_CODEMIRROR_TYPE_ICONS.has(type)) {
            type = undefined;
        }
        return {
            label: entry.name,
            type,
            boost,
        };
    });
    return {
        from: word ? (word.text === "." ? word.to : word.from) : pos,
        options,
    };
}
exports.getAutocompletion = getAutocompletion;
//# sourceMappingURL=getAutocompletion.js.map