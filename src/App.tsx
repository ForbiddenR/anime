import { useEffect, useRef } from 'react'
import {
  createTimeline,
  createScope,
  createDraggable,
  createSpring,
  splitText,
  stagger,
  svg,
} from 'animejs'
import './App.css'

export default function App() {
  const root = useRef<HTMLDivElement>(null)
  const scope = useRef<ReturnType<typeof createScope> | null>(null)

  useEffect(() => {
    const headlineSplit = splitText('.headline', { chars: { wrap: 'clip' } })
    const subheadSplit = splitText('.subhead', { words: { wrap: 'clip' } })

    scope.current = createScope({ root }).add((self) => {
      const intro = createTimeline({ defaults: { ease: 'outQuart' } })
        .add(svg.createDrawable('.logo-stroke'), {
          draw: ['0 0', '0 1'],
          duration: 900,
          delay: stagger(180),
        })
        .add(
          headlineSplit.chars,
          {
            y: ['110%', '0%'],
            opacity: [0, 1],
            duration: 700,
            delay: stagger(22),
          },
          '-=500',
        )
        .add(
          subheadSplit.words,
          {
            y: ['1em', '0em'],
            opacity: [0, 1],
            duration: 600,
            delay: stagger(40),
          },
          '-=450',
        )
        .add(
          '.badge',
          {
            scale: [0, 1],
            opacity: [0, 1],
            duration: 900,
            ease: createSpring({ stiffness: 120, damping: 8 }),
          },
          '-=300',
        )

      createDraggable('.badge', {
        container: '.stage',
        snap: { x: [0], y: [0] },
        releaseEase: createSpring({ stiffness: 180, damping: 14 }),
      })

      self.add('replay', () => intro.restart())
    })

    return () => {
      scope.current?.revert()
      headlineSplit.revert()
      subheadSplit.revert()
    }
  }, [])

  const handleReplay = () => scope.current?.methods.replay()

  return (
    <div className="stage" ref={root}>
      <div className="hero">
        <svg
          className="logo"
          viewBox="0 0 120 40"
          width="120"
          height="40"
          aria-hidden
        >
          <path
            className="logo-stroke"
            d="M10,30 L25,10 L40,30"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            className="logo-stroke"
            d="M55,10 L55,30 M55,30 L75,30"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            className="logo-stroke"
            d="M90,10 Q100,30 110,10"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>

        <h1 className="headline">Anime Reveal</h1>
        <p className="subhead">Built with anime.js v4 + React</p>

        <button className="badge" type="button">
          v4
        </button>

        <button className="replay" type="button" onClick={handleReplay}>
          Replay
        </button>
      </div>
    </div>
  )
}
