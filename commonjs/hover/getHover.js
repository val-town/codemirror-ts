"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHover = void 0;
function getHover({ env, path, pos, }) {
    const sourcePos = pos;
    if (sourcePos === null)
        return null;
    const quickInfo = env.languageService.getQuickInfoAtPosition(path, sourcePos);
    if (!quickInfo)
        return null;
    const start = quickInfo.textSpan.start;
    const typeDef = env.languageService.getTypeDefinitionAtPosition(path, sourcePos) ??
        env.languageService.getDefinitionAtPosition(path, sourcePos);
    return {
        start,
        end: start + quickInfo.textSpan.length,
        typeDef,
        quickInfo,
    };
}
exports.getHover = getHover;
//# sourceMappingURL=getHover.js.map