"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchBefore = void 0;
const ensureAnchor_js_1 = require("./ensureAnchor.js");
const getLineAtPosition_js_1 = require("./getLineAtPosition.js");
// From: https://github.com/codemirror/autocomplete/blob/53cc58393252659ac4a86162b40afef13eeb2241/src/completion.ts#L111
// TODO: do we need to vendor this?
function matchBefore(code, pos, expr) {
    const line = (0, getLineAtPosition_js_1.getLineAtPosition)(code, pos);
    let start = Math.max(line.from, pos - 250);
    let str = line.text.slice(start - line.from, pos - line.from);
    let found = str.search((0, ensureAnchor_js_1.ensureAnchor)(expr, false));
    return found < 0
        ? null
        : { from: start + found, to: pos, text: str.slice(found) };
}
exports.matchBefore = matchBefore;
//# sourceMappingURL=matchBefore.js.map