import { test } from "node:test";
import assert from "node:assert/strict";
// @ts-ignore Node's native TypeScript runner needs the source extension.
import {
  axisErrors,
  axisParams,
  axisSearch,
  axisState,
  matchesWhen,
  resolveGroups,
  resolveLine,
} from "./axes.ts";

const axes = [
  {
    id: "hydration",
    label: "Hydration",
    default: "75",
    legacyParam: "v",
    options: [
      {
        slug: "67",
        label: "67%",
        params: { water: 250 },
        legacy: ["67-hydration-sandwich"],
      },
      { slug: "75", label: "75%", params: { water: 280 } },
    ],
  },
  {
    id: "flour",
    label: "Flour",
    default: "0-www",
    options: [
      {
        slug: "0-www",
        label: "White",
        params: { wwFlour: 0, whiteFlourName: "bread flour" },
      },
      {
        slug: "25-www",
        label: "25%",
        params: { wwFlour: 95, whiteFlourName: "AP flour" },
      },
    ],
  },
];

test("axis state reads each param, falls back to defaults and maps legacy values", () => {
  assert.deepEqual(
    axisState(axes, new URLSearchParams("hydration=67&flour=25-www")),
    { hydration: "67", flour: "25-www" },
  );
  assert.deepEqual(
    axisState(axes, new URLSearchParams("hydration=99&flour=")),
    { hydration: "75", flour: "0-www" },
  );
  assert.deepEqual(
    axisState(axes, new URLSearchParams("v=67-hydration-sandwich")),
    { hydration: "67", flour: "0-www" },
  );
  assert.deepEqual(
    axisState(undefined, new URLSearchParams("hydration=67")),
    {},
  );
});

test("params resolve ingredient tokens and hide zero rows and empty groups", () => {
  const params = axisParams(axes, { hydration: "67", flour: "0-www" });
  assert.deepEqual(params, {
    water: 250,
    wwFlour: 0,
    whiteFlourName: "bread flour",
  });
  assert.equal(resolveLine("{water} g water", params), "250 g water");
  assert.equal(
    resolveLine("{wwFlour} g white whole wheat flour", params),
    null,
  );
  assert.equal(resolveLine("{unknown} g thing", params), "{unknown} g thing");
  assert.deepEqual(
    resolveGroups(
      [
        { group: "A", items: ["{wwFlour} g ww"] },
        { items: ["375 g {whiteFlourName}"] },
      ],
      params,
    ),
    [{ items: ["375 g bread flour"] }],
  );
});

test("axis search omits defaults, keeps other params and drops legacy params", () => {
  assert.equal(
    axisSearch("?scale=2&v=67-hydration-sandwich&lang=ru", axes, {
      hydration: "67",
      flour: "0-www",
    }),
    "?scale=2&lang=ru&hydration=67",
  );
  assert.equal(
    axisSearch("?hydration=67&flour=25-www", axes, {
      hydration: "75",
      flour: "0-www",
    }),
    "",
  );
});

test("When matches comma lists and requires every axis condition", () => {
  const state = { hydration: "75", flour: "40-www" };
  assert.equal(matchesWhen({ hydration: "75,80" }, state), true);
  assert.equal(matchesWhen({ hydration: "67", flour: "40-www" }, state), false);
  assert.equal(matchesWhen({ flour: "40-www", key: "x" }, state), true);
});

test("axis validation", () => {
  assert.deepEqual(axisErrors(axes), []);
  assert.deepEqual(axisErrors(undefined), []);
  assert.deepEqual(axisErrors("x"), ["axes must be a list"]);
  assert.deepEqual(
    axisErrors([
      {
        id: "scale",
        label: "S",
        default: "a",
        options: [
          { slug: "a", label: "A" },
          { slug: "a", label: "B" },
        ],
      },
    ]),
    [
      'axes[0].id "scale" is a reserved URL parameter',
      'axes[0].options[1].slug "a" is duplicated',
    ],
  );
  assert.deepEqual(
    axisErrors([
      {
        id: "x",
        label: "X",
        default: "b",
        options: [{ slug: "A", label: "A", params: { n: [1] } }],
      },
    ]),
    [
      "axes[0].options[0].slug must be lowercase letters, digits and dashes",
      "axes[0].default must be one of its option slugs",
    ],
  );
});
