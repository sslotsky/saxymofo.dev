import { defineConfig } from "vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import { qwikCity } from "@builder.io/qwik-city/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import pretty from "rehype-pretty-code";
import rehypeExternalLinks from "rehype-external-links";
import { visit } from 'unist-util-visit';
import { h } from 'hastscript';

export default defineConfig(() => {
  return {
    plugins: [qwikCity({
      mdxPlugins: {
        remarkGfm: false,
        rehypeSyntaxHighlight: false,
        rehypeAutolinkHeadings: true,
      },
      mdx: {
        providerImportSource: "~/components/mdx/components",
        rehypePlugins: [
          [() => (tree) => {
            visit(tree, 'element', (node, index, parent) => {
              if (node.tagName !== "pre") {
                return;
              }

              const code = node.children.at(0);

              if (!code || code.tagName !== 'code') {
                return;
              }

              const children = [node];
              children.push({
                type: 'mdxJsxTextElement',
                name: 'CopyButton',
                attributes: [{
                  type: 'mdxJsxAttribute', name: 'rawText', value: code.children[0].value
                }],
                children: []
              });

              parent.children[index!] = h('.frame.code-frame', children);
            })
          }],
          [pretty, { theme: 'rose-pine-moon' }],
          [rehypeExternalLinks, { target: "_blank" }],
        ],
      }
    }), qwikVite(), tsconfigPaths()],
    preview: {
      headers: {
        "Cache-Control": "public, max-age=600",
      },
    },
  };
});
