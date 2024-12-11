import {
  createDefaultMapFromCDN,
  createSystem,
  createVirtualTypeScriptEnvironment,
} from "@typescript/vfs";
import ts from "typescript";
import * as Comlink from "comlink";
import { createWorker } from "../src/worker/createWorker.js";

async function fetchTypeDefinition(url: string) {
  const response = await fetch(url);
  return response.text();
}

Comlink.expose(
  createWorker(async function () {
    // Default TypeScript lib files
    const fsMap = await createDefaultMapFromCDN(
      { target: ts.ScriptTarget.ES2022 },
      "3.7.3",
      false,
      ts,
    );

    // Common library type definitions with their dependencies
    const librariesConfig = {
      'lodash': {
        main: 'https://cdn.jsdelivr.net/npm/@types/lodash@4.14.195/index.d.ts'
      },
      'react': {
        main: 'https://cdn.jsdelivr.net/npm/@types/react@18.2.0/index.d.ts'
      },
      'd3': {
        main: 'https://cdn.jsdelivr.net/npm/@types/d3@7.4.0/index.d.ts',
        deps: {
          'd3-selection': 'https://cdn.jsdelivr.net/npm/@types/d3-selection@3.0.10/index.d.ts',
          'd3-transition': 'https://cdn.jsdelivr.net/npm/@types/d3-transition@3.0.8/index.d.ts',
          'd3-scale': 'https://cdn.jsdelivr.net/npm/@types/d3-scale@4.0.8/index.d.ts'
        }
      }
    };

    // Load library type definitions and their dependencies
    for (const [name, config] of Object.entries(librariesConfig)) {
      try {
        // Load main type definition
        const mainDefs = await fetchTypeDefinition(config.main);
        fsMap.set(`node_modules/@types/${name}/index.d.ts`, mainDefs);
        
        // Load dependencies if any
        if (config.deps) {
          for (const [depName, depUrl] of Object.entries(config.deps)) {
            const depDefs = await fetchTypeDefinition(depUrl);
            fsMap.set(`node_modules/@types/${depName}/index.d.ts`, depDefs);
          }
        }
      } catch (err) {
        console.warn(`Failed to load type definitions for ${name}:`, err);
      }
    }

    const system = createSystem(fsMap);
    const compilerOpts = {
      target: ts.ScriptTarget.ES2022,
      moduleResolution: ts.ModuleResolutionKind.NodeJs,
      module: ts.ModuleKind.ESNext,
      allowJs: true,
      typeRoots: ["node_modules/@types"],
      types: ["d3", "d3-selection", "d3-transition", "d3-scale", "lodash", "react"],
      skipLibCheck: true
    };

    return createVirtualTypeScriptEnvironment(system, [], ts, compilerOpts);
  }),
);
