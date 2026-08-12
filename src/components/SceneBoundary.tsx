import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}
interface State {
  hasError: boolean
}

/**
 * ErrorBoundary for the 3D hero. If the WebGL Canvas throws (context loss,
 * shader fail, driver issue), we render a warm animated fallback so the site
 * is NEVER a blank section — the kids' hero still shows its headline + CTAs.
 */
export default class SceneBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    // Keep it visible in console for debugging; never let it blank the site.
    console.error('[SceneBoundary] 3D scene failed:', error)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div
            className="w-full h-[80vh] flex flex-col items-center justify-center text-center px-4"
            style={{ background: 'linear-gradient(#8FE3FA 0%, #CDEFFD 45%, #FFF6E9 100%)' }}
          >
            <div className="text-7xl animate-bounce" aria-hidden>🦉</div>
            <h2 className="mt-4 font-display text-3xl font-extrabold text-candy-ink">
              {this.props.children ? 'Let\u2019s have fun!' : 'Hoppla !'}
            </h2>
          </div>
        )
      )
    }
    return this.props.children
  }
}
