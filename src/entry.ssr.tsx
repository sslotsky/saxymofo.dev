/**
 * WHAT IS THIS FILE?
 *
 * SSR entry point, in all cases the application is rendered outside the browser, this
 * entry point will be the common one.
 *
 * - Server (express, cloudflare...)
 * - npm run start
 * - npm run preview
 * - npm run build
 *
 */
import {
  renderToStream,
  type RenderToStreamOptions,
} from "@builder.io/qwik/server";
import { manifest } from "@qwik-client-manifest";
import Root from "./root";
import { langOf } from "./i18n";

export default function (opts: RenderToStreamOptions) {
  const lang = langOf(new URL(String(opts.serverData?.url ?? "http://localhost/")));
  return renderToStream(<Root />, {
    manifest,
    ...opts,
    // Use container attributes to set attributes on the html tag.
    containerAttributes: {
      ...opts.containerAttributes,
      lang: lang === "en" ? "en-us" : lang,
    },
  });
}
