export function createOrUpdateFile(env, path, code) {
    // In TypeScript, updates are not like PUTs, you
    // need to create a file before updating it.
    if (!env.getSourceFile(path)) {
        env.createFile(path, code);
    }
    else {
        env.updateFile(path, code);
    }
}
//# sourceMappingURL=update.js.map