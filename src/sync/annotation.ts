import { Annotation } from "@codemirror/state";

export const tsSyncAnnotation = Annotation.define<{
	path: string;
}>();
