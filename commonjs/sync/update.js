"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrUpdateFile = void 0;
function createOrUpdateFile(env, path, code) {
    // In TypeScript, updates are not like PUTs, you
    // need to create a file before updating it.
    if (!env.getSourceFile(path)) {
        env.createFile(path, code);
    }
    else {
        env.updateFile(path, code);
    }
}
exports.createOrUpdateFile = createOrUpdateFile;
//# sourceMappingURL=update.js.map