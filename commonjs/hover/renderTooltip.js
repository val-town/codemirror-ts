"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultRenderer = void 0;
const defaultRenderer = (info) => {
    const div = document.createElement("div");
    if (info.quickInfo?.displayParts) {
        for (let part of info.quickInfo.displayParts) {
            const span = div.appendChild(document.createElement("span"));
            span.className = `quick-info-${part.kind}`;
            span.innerText = part.text;
        }
    }
    return { dom: div };
};
exports.defaultRenderer = defaultRenderer;
//# sourceMappingURL=renderTooltip.js.map