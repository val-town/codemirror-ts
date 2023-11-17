import { type QuickInfo, type DefinitionInfo } from "typescript";
import { VirtualTypeScriptEnvironment } from "@typescript/vfs";
/**
 * This information is passed to the API consumer to allow
 * them to create tooltips however they wish.
 */
export interface HoverInfo {
    start: number;
    end: number;
    typeDef: readonly DefinitionInfo[] | undefined;
    quickInfo: QuickInfo | undefined;
}
export declare function getHover({ env, path, pos, }: {
    env: VirtualTypeScriptEnvironment;
    path: string;
    pos: number;
}): HoverInfo | null;
//# sourceMappingURL=getHover.d.ts.map