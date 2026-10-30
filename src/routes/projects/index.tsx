import { component$, useStyles$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import styles from './styles.css?inline';

export interface Project {
  title: string;
  url: string;
  description: string;
  imagePath: string;
}

export const projects: Project[] = [{
  title: 'Lumitone',
  url: 'https://lumitone.saxymofo.dev/',
  imagePath: 'lumitone.png',
  description: `
    Play, record, and share music on a web based synth.  

    Control the virtual keyboard with your computer mouse or keyboard, or plug
    in your own MIDI controller. 
  `
}, {
  title: 'What a Drag',
  url: 'https://what-a-drag.saxymofo.dev/',
  imagePath: 'what-a-drag.png',
  description: `
    Try out the different effects and play with the color slider. It’s strangely
    addictive and calming, which makes for a nice break from Twitter.
  `
}, {
  title: 'Strongly Typed',
  url: 'https://strongly-typed.saxymofo.dev/',
  imagePath: 'strongly-typed.png',
  description: `
    Type the words as they fall to catch them before they hit the ground. Sow
    native seeds on an autumn lawn, call tunes at a jazz club, or fire orders
    in a smokehouse kitchen, each with its own bonuses and sounds.
  `
}, {
  title: 'So Fly',
  url: 'https://so-fly.saxymofo.dev/',
  imagePath: 'so-fly.png',
  description:`
    Help the frog catch its dinner so it can grow healthy and strong. Keep feeding
    it or it will surely waste away! Play during work hours if you want to have a
    very unproductive day. It's habit forming.
  `
}]

export default component$(() => {
  useStyles$(styles);
  return (
    <>
      <div class="projects-intro">
        <h1>Projects</h1>
        <p>Some things I've built, mostly for fun.</p>
      </div>
      <div class="project-grid">
        {projects.map((project) => (
          <a class="project" key={project.title} href={project.url} target="_blank" rel="noreferrer">
            <img src={`/${project.imagePath}`} width={1200} height={600} alt="" loading="lazy" />
            <div class="body">
              <h2>{project.title} <span aria-hidden="true">↗</span></h2>
              <p>{project.description}</p>
            </div>
          </a>
        ))}
      </div>
    </>
  )
})

export const head: DocumentHead = {
  title: 'Sam Slotsky | Projects',
};
