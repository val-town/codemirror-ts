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
//# sourceMappingURL=tsAutocomplete.js.map