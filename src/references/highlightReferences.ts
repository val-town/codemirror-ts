import {
  ViewPlugin,
  DecorationSet,
  EditorView,
  ViewUpdate,
  Decoration,
} from "@codemirror/view";
import { Facet, combineConfig } from "@codemirror/state";

const defaultHighlightOptions = {
  highlightWordAroundCursor: false,
  minSelectionLength: 1,
  maxMatches: 100,
  wholeWords: false,
};

type HighlightOptions = {
  /// Determines whether, when nothing is selected, the word around
  /// the cursor is matched instead. Defaults to false.
  highlightWordAroundCursor?: boolean;
  /// The minimum length of the selection before it is highlighted.
  /// Defaults to 1 (always highlight non-cursor selections).
  minSelectionLength?: number;
  /// The amount of matches (in the viewport) at which to disable
  /// highlighting. Defaults to 100.
  maxMatches?: number;
  /// Whether to only highlight whole words.
  wholeWords?: boolean;
};

const highlightConfig = Facet.define<
  HighlightOptions,
  Required<HighlightOptions>
>({
  combine(options: readonly HighlightOptions[]) {
    return combineConfig(options, defaultHighlightOptions, {
      highlightWordAroundCursor: (a, b) => a || b,
      minSelectionLength: Math.min,
      maxMatches: Math.min,
    });
  },
});

export const tsHighlightReferences = ViewPlugin.fromClass(
  class TsHighlightReferences {
    decorations: DecorationSet;

    constructor(view: EditorView) {
      this.decorations = this.getDeco(view);
    }

    update(update: ViewUpdate) {
      if (update.selectionSet || update.docChanged || update.viewportChanged)
        this.decorations = this.getDeco(update.view);
    }

    getDeco(view: EditorView) {
      let conf = view.state.facet(highlightConfig);
      let { state } = view,
        sel = state.selection;
      if (sel.ranges.length > 1) return Decoration.none;
      let range = sel.main,
        query,
        check = null;
      if (range.empty) {
        console.log("range is empty");
        let word = state.wordAt(range.head);
        console.log(word);
        if (!word) return Decoration.none;
        check = state.charCategorizer(range.head);
        query = state.sliceDoc(word.from, word.to);
        console.log(query);
      } else {
        let len = range.to - range.from;
        if (len < conf.minSelectionLength || len > 200) return Decoration.none;
        if (conf.wholeWords) {
          query = state.sliceDoc(range.from, range.to); // TODO: allow and include leading/trailing space?
          check = state.charCategorizer(range.head);
        } else {
          query = state.sliceDoc(range.from, range.to).trim();
          if (!query) return Decoration.none;
        }
      }
      let deco: never[] = [];
      return Decoration.set(deco);
    }
  },
  {
    decorations: (v) => v.decorations,
  },
);
