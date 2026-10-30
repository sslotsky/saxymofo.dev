import { component$, useStyles$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import styles from "./styles.css?inline";

interface Role {
  company: string;
  title: string;
  dates: string;
  summary?: string;
  highlights?: string[];
}

const roles: Role[] = [
  {
    company: "Keycard",
    title: "Member of Technical Staff",
    dates: "Jan 2026 – Present",
    summary:
      "Building the Keycard Console, the management UI for identity and access for AI agents.",
    highlights: [
      "Made access policy approachable for every admin without limiting experts by building a best-in-class policy builder: a rich visual editor alongside a full-control Cedar editor with an IDE-like experience, without compromising performance.",
      "Made every surface, from the Console to the server-rendered sign-in and signup pages, feel like one consistently beautiful and delightful product, despite different tech and performance requirements, by building and maintaining the design library that powers them all.",
      "Kept every Console page fast as customer data grew by converting the entire management API to keyset pagination, almost single-handedly.",
      "Helped take Keycard from zero to one with self-serve onboarding that gets new users from sign-up to a deployed, Keycard-secured agent in one sitting, implementing most of its front-end progress signals, often by extending the APIs behind them first.",
    ],
  },
  {
    company: "Reddit",
    title: "Senior Software Engineer",
    dates: "Nov 2023 – Jan 2026",
    summary:
      "Maintained the framework and infrastructure used to build and serve Reddit on the web.",
    highlights: [
      "Revamped a slow, resource-hungry bundling process so it scales as more languages are added, letting i18n expansion continue without slowing down shipping.",
      "Cut the development feedback loop to a small fraction of its old length by enabling local development as an alternative to the cloud-based workflow.",
      "Tuned CI processes and resources to shorten overall time to production.",
    ],
  },
  {
    company: "Shopify → Flexport",
    title: "Senior Software Engineer",
    dates: "Jun 2021 – Nov 2023",
    summary:
      "Logistics engineering on the Shopify Fulfillment Network (SFN), continuing at Flexport after Shopify sold its fulfillment business to Flexport.",
    highlights: [
      "Designed and built systems to orchestrate and track inventory transfers within a fulfillment network.",
      "Built tools for support staff to correct data inconsistencies caused by operational errors with transfer inventory.",
      "Drove the adoption of better database tooling as the new standard for the engineering organization.",
      "Gathered alignment across many teams on transfer problems that touch multiple domains, and led teams building that multi-domain software.",
    ],
  },
  {
    company: "Gatsby",
    title: "Staff Software Engineer",
    dates: "May 2020 – Jun 2021",
    highlights: [
      "Expanded Gatsby Cloud to build sites from GitLab and Bitbucket repositories.",
      "Built a Shopify integration that scales resiliently to 10k products.",
      "Led by example on code quality, readability and maintainability, and made sure feature work shipped with tests and metrics.",
      "Kept the team shipping by finding and removing bottlenecks to production and advocating for small units of work with WIP limits.",
      "Leveled up junior engineers through regular 1:1s and pair programming.",
    ],
  },
  {
    company: "Manifold",
    title: "Lead Frontend Engineer",
    dates: "Apr 2018 – May 2020",
    highlights: [
      "Co-architected and led the implementation of the management console, the first Manifold app built on a micro-frontend architecture.",
      "Persuaded the organization to adopt TypeScript incrementally on the front end, and supported coworkers through the transition.",
      "Mentored the team on testing: raised Dashboard coverage from 20% to 80% and built a full-stack visual regression suite for our Web Components.",
      "Led the front-end guild in aligning on values for improving software quality.",
    ],
  },
  {
    company: "Ackmann & Dickenson",
    title: "Software Engineer → Senior → Principal",
    dates: "Mar 2012 – Apr 2018",
    summary: "Built custom software for clients in a variety of industries.",
    highlights: [
      "Used PostgreSQL to compute daily statistics over an enormous set of medical compensation data for SullivanCotter.",
      "Built a popular, highly performant leaderboard for MotivAction, with custom SQL that supported many different ranking metrics.",
      "Wrote open source list management and form validation libraries reused across client applications.",
      "Established standards and practices to keep quality and consistency high.",
    ],
  },
  {
    company: "Thomson Reuters",
    title: "Software Engineer",
    dates: "Jun 2009 – Mar 2012",
    highlights: [
      "Built UIs on back-end services for legal research products, and led coordination between the website team and a new DataRoom service.",
      "Introduced behavior-driven development by writing tests in SpecFlow.",
    ],
  },
];

const skills = [
  "TypeScript",
  "JavaScript",
  "Node.js",
  "React",
  "Web Components",
  "ReScript & OCaml",
  "PostgreSQL",
  "Build tooling & bundlers",
  "CI/CD",
  "Testing & visual regression",
  "Micro-frontends",
  "Mentoring",
  "Cross-team alignment",
];

export default component$(() => {
  useStyles$(styles);
  return (
    <div class="resume">
      <header class="resume-head">
        <div>
          <h1>Resume</h1>
          <p class="tagline">
            Paterfamilias. Jazz saxophonist. Code quality champion. I like to
            make things that are good.
          </p>
        </div>
        <ul class="facts">
          <li>Minneapolis–St. Paul</li>
          <li>
            <a href="mailto:sam@saxymofo.com">sam@saxymofo.com</a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/in/sam-slotsky-62024519/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
          </li>
          <li>
            <a
              href="https://github.com/sslotsky"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </li>
        </ul>
      </header>

      <section>
        <h2>Experience</h2>
        <ol class="timeline">
          {roles.map((role) => (
            <li key={role.company}>
              <div class="role-head">
                <h3>{role.company}</h3>
                <time>{role.dates}</time>
              </div>
              <p class="title">{role.title}</p>
              {role.summary && <p>{role.summary}</p>}
              {role.highlights && (
                <ul>
                  {role.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
      </section>

      <section class="columns">
        <div>
          <h2>Education</h2>
          <h3>University of Iowa</h3>
          <p class="title">
            BA, Computer Science and Jazz Studies · 2005 – 2009
          </p>
          <p>
            Phi Beta Kappa. Studied French language, history and government at
            the Institute of Urban Sciences in 2007.
          </p>
        </div>
        <div>
          <h2>Skills</h2>
          <ul class="chips">
            {skills.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <h2>Languages</h2>
          <p>English (native), French (professional working proficiency)</p>
        </div>
      </section>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Sam Slotsky | Resume",
  meta: [
    {
      name: "description",
      content:
        "Sam Slotsky: senior and staff software engineer at Keycard, Reddit, Shopify, Gatsby and Manifold.",
    },
  ],
};
