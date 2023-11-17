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
//# sourceMappingURL=tsAutocompleteWorker.js.map