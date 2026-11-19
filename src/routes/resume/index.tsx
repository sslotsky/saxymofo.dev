import { component$, useStyles$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useLocation } from "@builder.io/qwik-city";
import styles from "./styles.css?inline";
import { langOf } from "~/i18n";
import { resume } from "~/i18n/pages/resume";

export default component$(() => {
  useStyles$(styles);
  const copy = resume[langOf(useLocation().url)];
  return (
    <div class="resume">
      <header class="resume-head">
        <div>
          <h1>{copy.heading}</h1>
          <p class="tagline">{copy.tagline}</p>
        </div>
        <ul class="facts">
          <li>{copy.location}</li>
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
        <h2>{copy.experience}</h2>
        <ol class="timeline">
          {copy.roles.map((role) => (
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
          <h2>{copy.education}</h2>
          <h3>{copy.university}</h3>
          <p class="title">{copy.degree}</p>
          <p>{copy.educationNote}</p>
        </div>
        <div>
          <h2>{copy.skillsHeading}</h2>
          <ul class="chips">
            {copy.skills.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <h2>{copy.languagesHeading}</h2>
          <p>{copy.languages}</p>
        </div>
      </section>
    </div>
  );
});

export const head: DocumentHead = ({ url }) => {
  const copy = resume[langOf(url)];
  return {
    title: copy.title,
    meta: [{ name: "description", content: copy.description }],
  };
};
