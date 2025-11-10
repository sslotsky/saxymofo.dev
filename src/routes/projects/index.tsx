import { component$, useStyles$ } from "@builder.io/qwik";
import styles from './styles.css?inline';

export interface Project {
  title: string;
  url: string;
  description: string;
  imagePath: string;
}

export const projects: Project[] = [{
  title: 'Alfred',
  url: 'https://alfred.saxymofo.dev/',
  imagePath: 'alfred_with_bgc.png',
  description: `
  A chat bot. Because of course I made a chat bot.

  Alfred is here to answer your questions, and he likes to give you complete
  insight into his thought process.
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
    Type in the words as they fall from the sky to shoot them down before
    they destroy your base. Zap the bonus to capture all the words on the screen!
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
      <h1>Projects</h1>
      <p>Some things I've built mostly for fun</p>
      {projects.map((project, i) => {
        return (
          <a class="project" key={i} href={project.url} target="_blank">
            <div>
              <h2>{project.title}</h2>
              <div class="project-contents">
                <div
                  class="project-image"
                  style={{
                    backgroundImage: `url(/${project.imagePath})`,
                  }}
                />
                <p>{project.description}</p>
              </div>
            </div>
          </a>
        )
      })}
    </>
  )
})