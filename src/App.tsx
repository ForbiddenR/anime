import { useEffect, useMemo, useRef } from 'react'
import {
  animate,
  createDraggable,
  createScope,
  createSpring,
  createTimeline,
  stagger,
  svg,
} from 'animejs'
import './App.css'

type ScopeWithMethods = ReturnType<typeof createScope> & {
  methods: {
    replayAll?: () => void
    burstAgain?: () => void
  }
}

const CONFETTI_COUNT = 42
const PALETTE = ['#f97316', '#ec4899', '#a78bfa', '#22d3ee', '#facc15', '#34d399']
const SHAPES = ['square', 'circle', 'strip'] as const
const MESSAGE = 'Surprise!'

export default function App() {
  const root = useRef<HTMLDivElement>(null)
  const scope = useRef<ScopeWithMethods | null>(null)

  const sparkles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        x: `${(i * 41 + 7) % 95}%`,
        y: `${(i * 59 + 9) % 90}%`,
        size: `${i % 4 === 0 ? 4 : i % 3 === 0 ? 3 : 2}px`,
      })),
    [],
  )

  const confetti = useMemo(
    () =>
      Array.from({ length: CONFETTI_COUNT }, (_, i) => {
        const angle = (i / CONFETTI_COUNT) * Math.PI * 2 + i * 0.13
        const distance = 180 + ((i * 17) % 160)
        return {
          id: i,
          color: PALETTE[i % PALETTE.length],
          shape: SHAPES[i % SHAPES.length],
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance - 40,
          rot: ((i * 47) % 720) - 360,
        }
      }),
    [],
  )

  useEffect(() => {
    const targets = confetti

    scope.current = createScope({ root }).add((self) => {
      animate('.sparkle', {
        scale: [0.6, 1.4],
        opacity: [0.3, 1],
        duration: 1500,
        delay: stagger(90),
        ease: 'inOutSine',
        alternate: true,
        loop: true,
      })

      animate('.gift', {
        translateY: [0, -8],
        duration: 2400,
        ease: 'inOutSine',
        alternate: true,
        loop: true,
      })

      animate('.bow', {
        scale: [1, 1.05],
        duration: 1800,
        ease: 'inOutSine',
        alternate: true,
        loop: true,
      })

      createDraggable('.gift', {
        container: '.stage',
        releaseEase: createSpring({ stiffness: 200, damping: 18 }),
      })

      createDraggable('.confetti', {
        container: '.stage',
        releaseEase: createSpring({ stiffness: 100, damping: 12 }),
      })

      const reveal = createTimeline({ defaults: { ease: 'outQuart' } })
        .add(svg.createDrawable('.bow-loop, .bow-tail'), {
          draw: ['0 1', '0 0'],
          duration: 700,
          delay: stagger(60, { start: 700 }),
        })
        .add(
          '.bow-knot',
          { opacity: [1, 0], scale: [1, 0.6], duration: 320 },
          '-=300',
        )
        .add(
          '.ribbon-vert',
          { translateY: [0, 380], opacity: [1, 0], duration: 600 },
          '-=200',
        )
        .add(
          '.ribbon-horz',
          { translateX: [0, 360], opacity: [1, 0], duration: 600 },
          '<',
        )
        .add(
          '.box-lid',
          {
            translateY: [0, -190],
            rotate: [0, -14],
            duration: 900,
            ease: createSpring({ stiffness: 120, damping: 9 }),
          },
          '-=300',
        )
        .add(
          '.box-inner-glow',
          { opacity: [0, 1], scale: [0.4, 1.2], duration: 700 },
          '-=550',
        )
        .add(
          '.confetti',
          {
            translateX: (_el: Element, i: number) => targets[i].x,
            translateY: (_el: Element, i: number) => targets[i].y,
            rotate: (_el: Element, i: number) => targets[i].rot,
            opacity: [0, 1],
            scale: [0, 1],
            duration: 1100,
            delay: stagger(8, { from: 'center' }),
            ease: createSpring({ stiffness: 80, damping: 14 }),
          },
          '-=600',
        )
        .add(
          '.message-letter',
          {
            translateY: [40, 0],
            opacity: [0, 1],
            duration: 600,
            delay: stagger(60),
          },
          '-=700',
        )

      self?.add('replayAll', () => {
        reveal.restart()
      })
      self?.add('burstAgain', () => {
        animate('.confetti', {
          translateX: (_el: Element, i: number) => targets[i].x * 1.1,
          translateY: (_el: Element, i: number) => targets[i].y * 1.1,
          rotate: '+=180',
          duration: 900,
          delay: stagger(6, { from: 'random' }),
          ease: createSpring({ stiffness: 90, damping: 13 }),
        })
      })
    }) as ScopeWithMethods

    return () => scope.current?.revert()
  }, [confetti])

  const replayAll = () => scope.current?.methods.replayAll?.()
  const burstAgain = () => scope.current?.methods.burstAgain?.()

  return (
    <main className="stage" ref={root}>
      <div className="sparkle-layer" aria-hidden>
        {sparkles.map((sparkle) => (
          <span
            className="sparkle"
            key={sparkle.id}
            style={{
              '--x': sparkle.x,
              '--y': sparkle.y,
              '--size': sparkle.size,
            } as React.CSSProperties}
          />
        ))}
      </div>

      <header className="hero">
        <p className="eyebrow">anime.js v4 × React</p>
        <h1>A little surprise</h1>
        <p className="subtitle">
          Drag the gift around, watch the bow untie, and catch the confetti as it bursts.
        </p>
      </header>

      <div className="gift-stage">
        <svg className="gift" viewBox="0 0 320 360" role="img">
          <title>Wrapped present</title>
          <defs>
            <linearGradient id="lidGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f6c453" />
              <stop offset="100%" stopColor="#e8a73a" />
            </linearGradient>
            <linearGradient id="ribbonGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="100%" stopColor="#fde68a" />
            </linearGradient>
            <radialGradient id="innerGlow" cx="0.5" cy="0.5" r="0.6">
              <stop offset="0%" stopColor="#fff7e6" stopOpacity="1" />
              <stop offset="60%" stopColor="#fde68a" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#fde68a" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect className="box-inner-glow" x="60" y="140" width="200" height="140" rx="6" />

          <rect className="box-body" x="60" y="140" width="200" height="140" rx="6" />
          <rect className="box-body-stripe" x="60" y="172" width="200" height="6" />
          <rect className="box-body-stripe" x="60" y="232" width="200" height="6" />

          <rect className="ribbon-vert" x="152" y="110" width="16" height="170" />
          <rect className="ribbon-horz" x="60" y="200" width="200" height="16" />

          <rect className="box-lid" x="50" y="110" width="220" height="40" rx="6" />
          <rect className="box-lid-band" x="50" y="142" width="220" height="6" />

          <g className="bow">
            <path className="bow-loop" d="M 160 113 C 138 88, 110 95, 124 122 C 134 132, 160 122, 160 113" />
            <path className="bow-loop" d="M 160 113 C 182 88, 210 95, 196 122 C 186 132, 160 122, 160 113" />
            <path className="bow-tail" d="M 156 120 Q 148 142, 142 168" />
            <path className="bow-tail" d="M 164 120 Q 172 142, 178 168" />
            <circle className="bow-knot" cx="160" cy="115" r="7" />
          </g>
        </svg>

        <div className="confetti-layer">
          {confetti.map((piece) => (
            <span
              className={`confetti confetti-${piece.shape}`}
              key={piece.id}
              style={{ background: piece.color }}
            />
          ))}
        </div>

        <div className="message" aria-label={MESSAGE}>
          {MESSAGE.split('').map((ch, i) => (
            <span key={i} className="message-letter">{ch}</span>
          ))}
        </div>
      </div>

      <div className="controls">
        <button className="control" type="button" onClick={replayAll}>
          Wrap it up
        </button>
        <button className="control control-bright" type="button" onClick={burstAgain}>
          Burst again
        </button>
      </div>
    </main>
  )
}
