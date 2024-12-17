import { createDefaultMapFromCDN } from "@typescript/vfs";
import * as Fs from "node:fs/promises";
import * as ts from "typescript";

/**
 * TypeScript wants to load its types from the playground CDN, and we don't
 * want to make remote requests in a test environment, so let's pull
 * them in with this script, bundle em into one JSON file,
 * and use that in the tests.
 */
(async function () {
  const fsMap = await createDefaultMapFromCDN(
    { target: ts.ScriptTarget.ES2022 },
    ts.version,
    true,
    ts,
    // lzstring
    undefined,
    // fetcher
    fetch,
    // storer
    {
      getItem(_key) {
        return null;
      },
      setItem(_key, _value) {
        return null;
      },
    },
  );

  await Fs.writeFile("../test/cdn.json", JSON.stringify([...fsMap.entries()]));
})();
