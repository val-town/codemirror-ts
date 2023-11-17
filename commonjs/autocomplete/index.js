"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tsAutocomplete = void 0;
const getAutocompletion_js_1 = require("./getAutocompletion.js");
function tsAutocomplete({ path, env, }) {
    return async (context) => {
        return (0, getAutocompletion_js_1.getAutocompletion)({
            env,
            path,
            context,
        });
    };
}
exports.tsAutocomplete = tsAutocomplete;
//# sourceMappingURL=index.js.map