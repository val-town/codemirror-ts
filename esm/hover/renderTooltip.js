export const defaultRenderer = (info) => {
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
//# sourceMappingURL=renderTooltip.js.map