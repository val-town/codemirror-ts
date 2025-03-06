import { syntaxTree } from "@codemirror/language";
import { StateEffect, StateField } from "@codemirror/state";
import {
  Decoration,
  type DecorationSet,
  EditorView,
  ViewPlugin,
  type ViewUpdate,
} from "@codemirror/view";
import { WidgetType } from "@codemirror/view";
import type ts from "typescript";
import { type FacetConfig, tsFacet } from "../facet/tsFacet.js";
import { tsSyncAnnotation } from "../sync/annotation.js";

type SetTwoSlashes = {
  /**
   * This should align with the end of the ^? comment
   */
  from: number;
  /**
   * This is the formatted displayParts that we get back
   * from the worker.
   */
  text: string;
};

/**
 * Generally based off of the playground version of this method.
 * Format displayParts into a short string with no linebreaks.
 */
function formatDisplayParts(displayParts: ts.SymbolDisplayPart[]) {
  let text = displayParts
    .map((d) => d.text)
    .join("")
    .replace(/\r?\n\s*/g, " ");
  if (text.length > 120) text = `${text.slice(0, 119)}...`;
  return text;
}

/**
 * We separate the phases of finding the places to show with the places
 * where twoslash annotations are shown, because getting the definitions
 * requires asynchronous work.
 * This StateEffect is how we communicate getting a new set of definitions.
 */
const setTwoSlashes = StateEffect.define<SetTwoSlashes[]>({
  map: (sets, change) => {
    return sets.map((set) => {
      return {
        from: change.mapPos(set.from),
        text: set.text,
      };
    });
  },
});

// https://github.com/microsoft/TypeScript-Website/blob/v2/packages/playground/src/twoslashInlays.ts
/**
 * Traverse the view trying to find twoslashes comments, and
 * once we've found one, asynchronously get its definition from the worker.
 * When we get all the definitions, trigger a StateEffect that produces
 * the new decorations.
 */
function twoslashes(view: EditorView, config: FacetConfig) {
  if (!config) return null;
  const promises: Promise<SetTwoSlashes | null>[] = [];
  for (const { from, to } of view.visibleRanges) {
    syntaxTree(view.state).iterate({
      from,
      to,
      enter: (node) => {
        if (node.name === "LineComment") {
          const doc = view.state.doc;
          const commentText = doc.sliceString(node.from, node.to);
          const queryRegex = /^\s*\/\/\s*\^\?$/gm;
          const isTwoslash = queryRegex.test(commentText);
          if (isTwoslash) {
            const nodeTo = node.to;
            // Taking one character off of ^? to position this.
            const targetChar = nodeTo - 2;
            const sourceLine = doc.lineAt(targetChar);
            // TODO: may want to use countColumn here to make this
            // work with tab indentation
            // I do care about the visual alignment here, if you have some
            // indented line with tabs, then the ^? should show what is
            // visually above it.
            const col = targetChar - sourceLine.from;

            // Now find the position of the node above.
            const targetLine = doc.line(sourceLine.number - 1);
            const targetPosition = targetLine.from + col;

            promises.push(
              config.worker
                .getHover({
                  path: config.path,
                  pos: targetPosition,
                })
                .then((hoverInfo) => {
                  const displayParts = hoverInfo?.quickInfo?.displayParts;
                  if (!displayParts) return null;
                  return {
                    from: nodeTo,
                    text: formatDisplayParts(displayParts),
                  };
                }),
            );
          } else {
            // Pass
          }
        }
      },
    });
  }
  Promise.all(promises).then((states) => {
    config.log?.("tsTwoslash: got data", { states });
    view.dispatch({
      effects: setTwoSlashes.of(states.filter((x) => x !== null)),
    });
  });
}

/**
 * By separating the state updates into this StateField, we're able
 * to safely asynchronously update the decorations.
 */
const twoslashField = StateField.define<DecorationSet>({
  create() {
    return Decoration.none;
  },
  update(_widgets, tr) {
    let widgets = _widgets.map(tr.changes);
    for (const e of tr.effects) {
      if (e.is(setTwoSlashes)) {
        const decorations = e.value.map((set) => {
          return Decoration.widget({
            widget: new TwoslashWidget(set.text),
            side: 1,
          }).range(set.from);
        });
        widgets = Decoration.set(decorations);
      }
    }
    return widgets;
  },
  provide: (f) => EditorView.decorations.from(f),
});

/**
 * The widget itself is just a span with the definition inside.
 */
class TwoslashWidget extends WidgetType {
  constructor(readonly typesignature: string) {
    super();
  }

  eq(other: TwoslashWidget) {
    return other.typesignature === this.typesignature;
  }

  toDOM() {
    const wrap = document.createElement("span");
    wrap.setAttribute("aria-hidden", "true");
    wrap.className = "cm-twoslash";
    wrap.innerText = this.typesignature;
    return wrap;
  }

  ignoreEvent() {
    return false;
  }
}

/**
 * Essentially an update listener but it also runs on startup.
 */
const twoslashPlugin = ViewPlugin.fromClass(
  class {
    constructor(view: EditorView) {
      const config = view.state.facet(tsFacet);
      // Because we asynchronously fetch definitions, this
      // does not directly hold or update decorations. Instead,
      // it triggers asynchronous updates in the twoslashField.
      twoslashes(view, config);
    }

    update(update: ViewUpdate) {
      if (
        update.docChanged ||
        update.viewportChanged ||
        syntaxTree(update.startState) !== syntaxTree(update.state) ||
        update.transactions.some((tr) => tr.annotation(tsSyncAnnotation))
      ) {
        const config = update.state.facet(tsFacet);
        twoslashes(update.view, config);
      }
    }
  },
);

const extensions = [twoslashField, twoslashPlugin];

/**
 * The main twoslash plugin entry point: this bundles twoslashField
 * and the twoslashPlugin. This could be a non-function, but we expose
 * it as a function for consistency with the other methods.
 */
export const tsTwoslash = () => extensions;
