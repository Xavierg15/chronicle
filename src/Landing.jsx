import { useState, useEffect } from 'react'
import { btnMotion } from './buttonMotion'

const BRAND = 'chronicle'

const btnPrimary = `text-xs tracking-widest uppercase text-accent border border-accent px-8 py-3 hover:bg-accent hover:text-background ${btnMotion}`

export const Landing = ({ onComplete }) => {
  const [brandText, setBrandText] = useState('')
  const [showHero, setShowHero] = useState(false)

  useEffect(() => {
    let i = 0
    let revealTimeoutId
    const intervalId = setInterval(() => {
      i += 1
      setBrandText(BRAND.slice(0, i))
      if (i === BRAND.length) {
        clearInterval(intervalId)
        revealTimeoutId = setTimeout(() => setShowHero(true), 400)
      }
    }, 120)

    return () => {
      clearInterval(intervalId)
      if (revealTimeoutId) clearTimeout(revealTimeoutId)
    }
  }, [])

  const handleCta = () => {
    onComplete?.()
  }

  return (
    <div className="min-h-screen bg-background font-mono text-primary">
      <section className="flex flex-col items-center justify-center min-h-[70vh] px-8 gap-8 text-center">
        <h1 className="text-5xl font-bold text-primary tracking-widest min-h-[3.5rem] sm:min-h-[4rem]">
          {brandText}
        </h1>

        <div
          inert={!showHero}
          className={`flex flex-col items-center gap-8 w-full max-w-xl transition-opacity duration-500 ease-out ${
            showHero ? 'opacity-100' : 'opacity-0 pointer-events-none select-none'
          }`}
          aria-hidden={!showHero}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-primary tracking-wide lowercase leading-tight">
            less scrolling. more writing.
          </h2>
          <p className="text-muted text-sm sm:text-base leading-relaxed lowercase tracking-wide">
            one entry a day. write it down, share if you want, get on with your day.
          </p>
          <button type="button" onClick={handleCta} className={`mt-4 ${btnPrimary}`}>
            start writing
          </button>
        </div>
      </section>

      <section className="px-8 py-16">
        <p className="text-muted text-xs tracking-widest lowercase mb-8">how it works</p>
        <div className="flex flex-col gap-6">
          <div className="border-b border-border pb-6">
            <p className="text-primary text-lg leading-relaxed lowercase">
              one entry per day. no more, no less.
            </p>
          </div>
          <div className="border-b border-border pb-6">
            <p className="text-primary text-lg leading-relaxed lowercase">
              your entries live in your journal forever.
            </p>
          </div>
          <div className="border-b border-border pb-6">
            <p className="text-primary text-lg leading-relaxed lowercase">
              follow others. see their entry after you post yours.
            </p>
          </div>
        </div>
      </section>

      <section className="flex flex-col items-center justify-center px-8 py-20 pb-28 text-center">
        <p className="text-primary text-2xl font-bold tracking-wide leading-relaxed lowercase">
          your first entry is waiting.
        </p>
        <button type="button" onClick={handleCta} className={`mt-8 ${btnPrimary}`}>
          start writing
        </button>
      </section>
    </div>
  )
}
