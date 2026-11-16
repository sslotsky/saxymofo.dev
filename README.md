# Qwik City App ⚡️

## Adding a recipe

Create `src/routes/recipes/<slug>/index.mdx` by copying
`docs/recipe-template.mdx`; keep `---` on the first line and replace the examples.
The recipe automatically appears at `/recipes/` and in its tag filters.
Merging to `main` deploys the site.

Frontmatter includes `title`, `description`, `tags`, `yield` (a quantity line such
as `2 cups`), optional display-only `time`, and `ingredients`: a list of groups
with an optional `group` heading and an `items` list of ingredient strings.
Always use YAML block lists (`- item` on its own line) for `items` and `remove`.
Commas inside flow sequences (`[...]`) split lines into separate ingredients.
Optional `variations` have a unique `name`, optional plain-text `description`,
and ingredient groups. A variation group replaces the entire base group with
the same name (including unnamed groups); new names append. Use one group per name.
Variation `remove` is a list of case-insensitive substrings to drop from base
ingredient lines. `add` is a list of groups whose items append to same-named
groups, or whose new groups append at the end. Processing order is remove,
ingredients replacement, then add; removals only affect base ingredients.
Variation names become lowercase, hyphenated URL slugs; keep those slugs unique
and reserve `base` for the original recipe. Optional `baseVariationName` sets
the original recipe's tab label (defaults to `Classic`).

Write steps and notes as ordinary Markdown. Wrap inline text quantities in
`<Q>50 g</Q>` to scale them along with the ingredient list and yield.
`<Variation name="With Herbs">...</Variation>` shows content only for that
variation; `<Variation name="base">...</Variation>` is base-only content.
Put blank lines around Markdown blocks inside a Variation. Quantities support
integers, decimals, fractions, mixed numbers, common Unicode fractions, and
ranges (`2-3` or `2 to 3`). Lines without a leading quantity are not scaled.
Metric weights/liquids use rounded decimals; other quantities use common fractions.
No-space units such as `375g` work too. A parenthetical starting with a quantity
or `about`/`approx.` and a quantity scales as well, including `+` combinations.
Put package sizes between the count and unit (`1 (15 oz) can chickpeas`) to
keep the package size fixed. Parentheticals after the ingredient still scale.
Common spelled-out units inflect with the scaled amount; abbreviations stay unchanged.
Set `scalable: false` to hide scaling and keep quantities at 1× (used by the
weekly plan). The index pins plans first, then meals, bread, spreads, and sauces.

Scale and variation are linkable with `?scale=2&v=with-herbs`. Controls replace
the current history entry without navigating or fetching the route again.
Ingredient rows reserve room for all preset scales to avoid text-wrap jumps.
Invalid scales
fall back to 1 and unknown variations to base. The recipe index opts out of
the recipe layout with `frontmatter.notARecipe`.

Run `npm test` (Node 22.6+) for quantity, variation, and frontmatter tests.
The frontmatter guard checks every recipe and the template for `items` or
`remove` flow sequences, including empty and multiline ones.

- [Qwik Docs](https://qwik.builder.io/)
- [Discord](https://qwik.builder.io/chat)
- [Qwik GitHub](https://github.com/BuilderIO/qwik)
- [@QwikDev](https://twitter.com/QwikDev)
- [Vite](https://vitejs.dev/)

---

## Project Structure

This project is using Qwik with [QwikCity](https://qwik.builder.io/qwikcity/overview/). QwikCity is just an extra set of tools on top of Qwik to make it easier to build a full site, including directory-based routing, layouts, and more.

Inside your project, you'll see the following directory structure:

```
├── public/
│   └── ...
└── src/
    ├── components/
    │   └── ...
    └── routes/
        └── ...
```

- `src/routes`: Provides the directory-based routing, which can include a hierarchy of `layout.tsx` layout files, and an `index.tsx` file as the page. Additionally, `index.ts` files are endpoints. Please see the [routing docs](https://qwik.builder.io/qwikcity/routing/overview/) for more info.

- `src/components`: Recommended directory for components.

- `public`: Any static assets, like images, can be placed in the public directory. Please see the [Vite public directory](https://vitejs.dev/guide/assets.html#the-public-directory) for more info.

## Add Integrations and deployment

Use the `pnpm qwik add` command to add additional integrations. Some examples of integrations includes: Cloudflare, Netlify or Express Server, and the [Static Site Generator (SSG)](https://qwik.builder.io/qwikcity/guides/static-site-generation/).

```shell
pnpm qwik add # or `yarn qwik add`
```

## Development

Development mode uses [Vite's development server](https://vitejs.dev/). The `dev` command will server-side render (SSR) the output during development.

```shell
npm start # or `yarn start`
```

> Note: during dev mode, Vite may request a significant number of `.js` files. This does not represent a Qwik production build.

## Preview

The preview command will create a production build of the client modules, a production build of `src/entry.preview.tsx`, and run a local server. The preview server is only for convenience to preview a production build locally and should not be used as a production server.

```shell
pnpm preview # or `yarn preview`
```

## Production

The production build will generate client and server modules by running both client and server build commands. The build command will use Typescript to run a type check on the source code.

```shell
pnpm build # or `yarn build`
```

## Cloudflare Pages

Cloudflare's [wrangler](https://github.com/cloudflare/wrangler) CLI can be used to preview a production build locally. To start a local server, run:

```
npm run serve
```

Then visit [http://localhost:8787/](http://localhost:8787/)

### Deployments

[Cloudflare Pages](https://pages.cloudflare.com/) are deployable through their [Git provider integrations](https://developers.cloudflare.com/pages/platform/git-integration/).

If you don't already have an account, then [create a Cloudflare account here](https://dash.cloudflare.com/sign-up/pages). Next go to your dashboard and follow the [Cloudflare Pages deployment guide](https://developers.cloudflare.com/pages/framework-guides/deploy-anything/).

Within the projects "Settings" for "Build and deployments", the "Build command" should be `npm run build`, and the "Build output directory" should be set to `dist`.

### Function Invocation Routes

Cloudflare Page's [function-invocation-routes config](https://developers.cloudflare.com/pages/platform/functions/routing/#functions-invocation-routes) can be used to include, or exclude, certain paths to be used by the worker functions. Having a `_routes.json` file gives developers more granular control over when your Function is invoked.
This is useful to determine if a page response should be Server-Side Rendered (SSR) or if the response should use a static-site generated (SSG) `index.html` file.

By default, the Cloudflare pages adaptor _does not_ include a `public/_routes.json` config, but rather it is auto-generated from the build by the Cloudflare adaptor. An example of an auto-generate `dist/_routes.json` would be:

```
{
  "include": [
    "/*"
  ],
  "exclude": [
    "/_headers",
    "/_redirects",
    "/build/*",
    "/favicon.ico",
    "/manifest.json",
    "/service-worker.js",
    "/about"
  ],
  "version": 1
}
```

In the above example, it's saying _all_ pages should be SSR'd. However, the root static files such as `/favicon.ico` and any static assets in `/build/*` should be excluded from the Functions, and instead treated as a static file.

In most cases the generated `dist/_routes.json` file is ideal. However, if you need more granular control over each path, you can instead provide you're own `public/_routes.json` file. When the project provides its own `public/_routes.json` file, then the Cloudflare adaptor will not auto-generate the routes config and instead use the committed one within the `public` directory.

## Express Server

This app has a minimal [Express server](https://expressjs.com/) implementation. After running a full build, you can preview the build using the command:

```
npm run serve
```

Then visit [http://localhost:8080/](http://localhost:8080/)
