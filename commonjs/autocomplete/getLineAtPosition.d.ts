/**
 * TODO: confirm that this is necessary; it may be possible
 * and more efficient to get the line from CodeMirror, though
 * that would mean it probably doesn't mix well with the approach
 * of persisting code in the TS enviroment.
 */
export declare function getLineAtPosition(code: string, position: number): {
    from: number;
    to: number;
    text: string;
};
//# sourceMappingURL=getLineAtPosition.d.ts.map