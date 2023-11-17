"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tsAutocompleteWorker = exports.tsAutocomplete = void 0;
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
function tsAutocompleteWorker({ path, worker, }) {
    return async (context) => {
        return worker.getAutocompletion({
            path,
            // Reduce this object so that it's serializable.
            context: {
                pos: context.pos,
                explicit: context.explicit,
            },
        });
    };
}
exports.tsAutocompleteWorker = tsAutocompleteWorker;
//# sourceMappingURL=index.js.map