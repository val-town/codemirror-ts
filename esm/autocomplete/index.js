import { getAutocompletion } from "./getAutocompletion.js";
export function tsAutocomplete({ path, env, }) {
    return async (context) => {
        return getAutocompletion({
            env,
            path,
            context,
        });
    };
}
export function tsAutocompleteWorker({ path, worker, }) {
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
//# sourceMappingURL=index.js.map