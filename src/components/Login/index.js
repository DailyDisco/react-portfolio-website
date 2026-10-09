import { useEffect, useRef, useState } from 'react'
import { signInWithGoogle } from '../../firebase'

const Login = () => {
  const signInPending = useRef(false)
  const mounted = useRef(true)
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  const signIn = async () => {
    if (signInPending.current) return
    signInPending.current = true
    setStatus('pending')
    try {
      await signInWithGoogle()
      if (mounted.current) setStatus('idle')
    } catch {
      if (mounted.current) setStatus('error')
    } finally {
      signInPending.current = false
    }
  }

  return (
    <section className="page-shell" aria-labelledby="login-heading">
      <header className="page-heading">
        <p className="eyebrow">Portfolio management</p>
        <h1 id="login-heading">Sign in to the dashboard</h1>
        <p>Use your authorized Google account to manage portfolio projects.</p>
      </header>
      <button
        className="button"
        type="button"
        disabled={status === 'pending'}
        onClick={signIn}
      >
        {status === 'pending' ? 'Connecting to Google…' : 'Sign in with Google'}
      </button>
      {status === 'error' && (
        <p className="status-panel error" role="alert">
          Sign-in was not completed. Try again and allow the Google sign-in window.
        </p>
      )}
    </section>
  )
}

export default Login
