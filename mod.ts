import { createProcessor, type ProcessorOptions } from "@mdx-js/mdx";
import { VFile } from "vfile";
import type { Plugin } from "vinxi";

export const mdx = (opts?: ProcessorOptions): Plugin[] => {
  let processor: ReturnType<typeof createProcessor>;

  return [{
    name: "vite-plugin-mdx",
    enforce: "pre",

    configResolved({ mode }) {
      processor = createProcessor({
        development: mode === "development",
        ...(opts ?? {}),
      });
    },

    async transform(code, id) {
      const [path] = id.split("?");
      if (!/\.mdx?$/.test(path)) {
        return;
      }

      if (!processor) {
        throw Error("processor should be resolved by now..");
      }

      const result = await processor.process(
        new VFile({ value: code, path }),
      );

      return {
        code: result.value.toString(),
        map: { mappings: "" },
      };
    },
  }];
};
