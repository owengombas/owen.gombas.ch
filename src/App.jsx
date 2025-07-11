import GradientDescent from './components/GradientDescent'
import './App.css'
import { useState } from 'react'

function App() {
  const [links] = useState([
    {
      title: "🫆 murmurs",
      date: "2025",
      url: "https://github.com/owengombas/murmurs",
      description: "A production-ready, reliable, and fast Murmur3 hash function implementation built in Rust",
      targs: ["Rust", "C++"],
    },
    {
      title: "🧮 alex-go",
      date: "2024",
      url: "https://github.com/owengombas/alex-go",
      description: "A reliable Go implementation of Microsoft's ALEX learned index data structure.",
      targs: ["Go", "Algorithms & Data Structures", "Applied Research"],
    },
    {
      title: "🌍 distributed-gan",
      date: "2024",
      url: "https://github.com/owengombas/distributed-gan",
      description: "A multi-discriminator GAN implementation using PyTorch's TCP/IP stack for distributed training.",
      targs: ["IA", "PyTorch", "TCP/IP", "GAN", "Applied Research"],
    },
    {
      title: "🎧 spotify-recommender",
      date: "2023",
      url: "https://github.com/owengombas/spotify-recommender",
      description: "A recommender system combining collaborative and content-based filtering on Spotify datasets.",
      targs: ["IA", "PyTorch", "Applied Research"],
    },
    {
      title: "🤖 discord.ts",
      date: "2021",
      url: "https://github.com/owengombas/discord.ts",
      description: "A modular and decorator-based TypeScript framework to help build fully typed Discord bots easily.",
      targs: ["TypeScript", "Decorators"],
    },
    {
      title: "✏️ hand-drawing-swift-metal",
      date: "2019",
      url: "https://github.com/owengombas/hand-drawing-swift-metal",
      description: "A lightweight 2D drawing engine built with Swift and Metal for GPU-accelerated rendering on Apple devices.",
      targs: ["Swift", "Metal", "GPU"],
    }
  ]);

  return (
    <>
      <div className='ambiance' id='ambiance-top-left' />
      {/* <div className='ambiance' id='ambiance-bottom-right' /> */}
      
      <div className='app'>
        <header>
          <h1>
            Owen Gombas
          </h1>
          <h2>
            Engineer in Computer Science focused on Data Science and Distributed systems — with over 9 years of engagement in the open source community.
          </h2>
          <nav>
            <a className='button gh-button' href='https://github.com/owengombas' target='_blank'>GitHub</a>
            <a className='button' href='https://linkedin.com/in/owen-calvin-gombas' target='_blank'>Linkedin</a>
            <a className='button' href='https://dev.to/owen' target='_blank'>dev.to</a>
            <a className='button' href='https://huggingface.com/owengombas' target='_blank'>Hugging Face</a>
          </nav>
        </header>

        <div>
          <section class="gh">
            {links.map(args => (
              <a className='gh-link' href={args.url} target='_blank'>
                <div class="gh-entry">
                  <div>
                    <div className='gh-title-date'>
                      <div className='gh-title'>{args.title}</div>
                      <div className='gh-hyphen'>—</div>
                      <div className='gh-date'>{args.date}</div>
                    </div>
                    <div className='gh-description'>{args.description}</div>
                  </div>
                  <div className='gh-tags'>
                    {args.targs.map(tag => (
                      <div className='gh-tag'>{tag}</div>
                    ))}
                  </div>
                </div>
              </a>
            ))}
          </section>
        </div>

        <div className='gradient-descent'>
          <GradientDescent />
        </div>
      </div>
    </>
  )
}

export default App
