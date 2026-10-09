import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../../firebase'
import Home from './home'
import Login from '../Login'

const Dashboard = () => {
  const [user, setUser] = useState(null)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser)
        setStatus('ready')
      },
      () => setStatus('error')
    )
    return unsubscribe
  }, [])

  if (status !== 'ready') {
    return (
      <section className="page-shell" aria-labelledby="dashboard-heading">
        <header className="page-heading">
          <p className="eyebrow">Portfolio management</p>
          <h1 id="dashboard-heading">Dashboard</h1>
        </header>
        {status === 'error' ? (
          <p className="status-panel error" role="alert">
            Your sign-in could not be checked. Refresh this page to try again.
          </p>
        ) : (
          <p className="status-panel" role="status">
            Checking your sign-in…
          </p>
        )}
      </section>
    )
  }

  return user ? <Home /> : <Login />
}

export default Dashboard
