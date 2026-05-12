import { useEffect, useRef } from 'react'
import { animate, createScope, svg } from 'animejs'
import './App.css'

export default function App() {
  const root = useRef<HTMLDivElement>(null)
  const scope = useRef<ReturnType<typeof createScope> | null>(null)

  useEffect(() => {
    scope.current = createScope({ root }).add(() => {
      animate(svg.createDrawable('.line'), {
        draw: ['0 0', '0 1', '1 1'],
        ease: 'inOutQuad',
        duration: 2000,
        loop: true,
      })
    })
    return () => scope.current?.revert()
  }, [])

  return (
    <div className="stage" ref={root}>
      <svg viewBox="0 0 200 200" width="320" height="320">
        <path
          className="line"
          d="M20,100 C60,20 140,180 180,100"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}
