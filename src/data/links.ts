export interface ReferenceLink {
  url: string;
  label: string;
  affiliate?: boolean;
}

export const LINKS = {
  "sune-coil-fold": {
    url: "https://www.youtube.com/watch?v=6JQm2n4aVZc",
    label: "Sune’s (Foodgeek) coil fold tutorial",
  },
  "sune-agitation-test": {
    url: "https://www.youtube.com/watch?v=Lz9CO1PJ0sM",
    label: "Foodgeek’s stretch-and-fold vs. coil-fold comparison",
  },
  "usa-pan-1lb": {
    url: "https://www.usapan.com/loaf-pan-1-lb-vol-1140lf",
    label: "USA Pan 1 lb. Loaf Pan (8.5\" × 4.5\" × 2.75\")",
    affiliate: true,
  },
  "ka-sourdough-crock": {
    url: "https://shop.kingarthurbaking.com/items/glass-sourdough-crock",
    label: "King Arthur Glass Sourdough Crock",
    affiliate: true,
  },
  "ka-fresh-starter": {
    url: "https://kingarthurbaking.com",
    label: "King Arthur Classic Fresh Sourdough Starter",
    affiliate: true,
  },
  "dexter-bench-scraper": {
    url: "https://dexter1818.com/sani-safe-6-x-3-dough-cutter-scraper/",
    label: "Dexter-Russell Sani-Safe 6\" × 3\" Bench Scraper",
    affiliate: true,
  },
} as const satisfies Record<string, ReferenceLink>;

export type LinkId = keyof typeof LINKS;
