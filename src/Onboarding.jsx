import { useState, useEffect } from 'react'

export const Onboarding = ({ onComplete }) => {
  const [step, setStep] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [subDisplayed, setSubDisplayed] = useState('')
  const [showButton, setShowButton] = useState(false)
  const fullText = 'chronicle'
  const subText = 'record your life.'

  useEffect(() => {
    if (step !== 0) return
   
    let i = 0
    const mainInterval = setInterval(() => {
      setDisplayed(fullText.slice(0, i + 1))
      i++
      if (i === fullText.length) {
        clearInterval(mainInterval)
        setTimeout(() => {
          let j = 0
          const subInterval = setInterval(() => {
            setSubDisplayed(subText.slice(0, j + 1))
            j++
            if (j === subText.length) {
              clearInterval(subInterval)
              setTimeout(() => setShowButton(true), 400)
            }
          }, 60)
        }, 500)
      }
    }, 120)

    return () => clearInterval(mainInterval)
  }, [step])

  const screens = [
    {
      content: (
        <div className="flex flex-col items-center justify-center min-h-screen gap-6">
          <h1 className="text-5xl font-bold text-primary tracking-widest">{displayed}</h1>
          <p className="text-muted text-sm tracking-widest uppercase">{subDisplayed}</p>
          {showButton && (
            <button
              onClick={() => setStep(1)}
              className="mt-12 text-xs tracking-widest uppercase text-accent border border-accent px-8 py-3 hover:bg-accent hover:text-background transition-colors"
            >
              Begin
            </button>
          )}
        </div>
      )
    },
    {
      content: (
        <div className="flex flex-col justify-center min-h-screen px-8 gap-8">
          <p className="text-muted text-xs tracking-widest uppercase">How it works</p>
          <div className="flex flex-col gap-6">
            <div className="border-b border-border pb-6">
              <p className="text-primary text-lg leading-relaxed">One entry per day. No more, no less.</p>
            </div>
            <div className="border-b border-border pb-6">
              <p className="text-primary text-lg leading-relaxed">Your entries live in your journal. It's record of your life over time.</p>
            </div>
            <div className="border-b border-border pb-6">
              <p className="text-primary text-lg leading-relaxed">Follow others. See their entry after you've posted yours.</p>
            </div>
          </div>
          <button
            onClick={() => setStep(2)}
            className="self-start text-xs tracking-widest uppercase text-accent border border-accent px-8 py-3 hover:bg-accent hover:text-background transition-colors"
          >
            Next
          </button>
        </div>
      )
    },
    {
      content: (
        <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-8 text-center">
          <p className="text-primary text-2xl font-bold tracking-wide leading-relaxed">your first entry is waiting.</p>
          <button
            onClick={onComplete}
            className="mt-8 text-xs tracking-widest uppercase text-accent border border-accent px-8 py-3 hover:bg-accent hover:text-background transition-colors"
          >
            Start Writing
          </button>
        </div>
      )
    }
  ]

  return <div className="bg-background font-mono">{screens[step].content}</div>
}