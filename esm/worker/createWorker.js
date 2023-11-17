import { createOrUpdateFile } from "../sync/update.js";
import { getLints } from "../lint/getLints.js";
import { getAutocompletion } from "../autocomplete/getAutocompletion.js";
import { getHover } from "../hover/getHover.js";
export function createWorker(initializer) {
    let env;
    return {
        async initialize() {
            env = await initializer();
        },
        updateFile({ path, code }) {
            if (!env)
                return;
            createOrUpdateFile(env, path, code);
        },
        getLints({ path }) {
            if (!env)
                return [];
            return getLints({ env, path });
        },
        getAutocompletion({ path, context, }) {
            if (!env)
                return null;
            return getAutocompletion({ env, path, context });
        },
        getHover({ path, pos }) {
            if (!env)
                return;
            return getHover({ env, path, pos });
        },
    };
}
//# sourceMappingURL=createWorker.js.map