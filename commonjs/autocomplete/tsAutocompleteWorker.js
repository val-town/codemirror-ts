"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tsAutocompleteWorker = void 0;
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
//# sourceMappingURL=tsAutocompleteWorker.js.map