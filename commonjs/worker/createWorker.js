"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWorker = void 0;
const update_js_1 = require("../sync/update.js");
const getLints_js_1 = require("../lint/getLints.js");
const getAutocompletion_js_1 = require("../autocomplete/getAutocompletion.js");
const getHover_js_1 = require("../hover/getHover.js");
function createWorker(initializer) {
    let env;
    return {
        async initialize() {
            env = await initializer();
        },
        updateFile({ path, code }) {
            if (!env)
                return;
            (0, update_js_1.createOrUpdateFile)(env, path, code);
        },
        getLints({ path }) {
            if (!env)
                return [];
            return (0, getLints_js_1.getLints)({ env, path });
        },
        getAutocompletion({ path, context, }) {
            if (!env)
                return null;
            return (0, getAutocompletion_js_1.getAutocompletion)({ env, path, context });
        },
        getHover({ path, pos }) {
            if (!env)
                return;
            return (0, getHover_js_1.getHover)({ env, path, pos });
        },
    };
}
exports.createWorker = createWorker;
//# sourceMappingURL=createWorker.js.map