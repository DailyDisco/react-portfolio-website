import { act, fireEvent, render, screen } from '@testing-library/react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, signInWithGoogle } from '../../firebase'
import Dashboard from './index'

jest.mock('firebase/auth', () => ({ onAuthStateChanged: jest.fn() }))
jest.mock('../../firebase', () => ({ auth: {}, signInWithGoogle: jest.fn() }))
jest.mock('./home', () => () => <h1>Add a project</h1>)

let unsubscribe

beforeEach(() => {
  jest.resetAllMocks()
  unsubscribe = jest.fn()
  onAuthStateChanged.mockReturnValue(unsubscribe)
})

test('waits for auth, responds to sign-in changes, and unsubscribes on unmount', () => {
  const { unmount } = render(<Dashboard />)
  expect(screen.getByRole('status')).toHaveTextContent('Checking your sign-in…')
  expect(onAuthStateChanged).toHaveBeenCalledWith(auth, expect.any(Function), expect.any(Function))
  const onUserChanged = onAuthStateChanged.mock.calls[0][1]

  act(() => onUserChanged(null))
  expect(screen.getByRole('button', { name: 'Sign in with Google' })).toBeInTheDocument()
  act(() => onUserChanged({ uid: 'signed-in-user' }))
  expect(screen.getByRole('heading', { name: 'Add a project' })).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Sign in with Google' })).not.toBeInTheDocument()

  unmount()
  expect(unsubscribe).toHaveBeenCalledTimes(1)
})

test('reports auth observer errors without displaying the project form', () => {
  render(<Dashboard />)
  act(() => onAuthStateChanged.mock.calls[0][2](new Error('Auth unavailable')))
  expect(screen.getByRole('alert')).toHaveTextContent('Your sign-in could not be checked.')
  expect(screen.queryByRole('heading', { name: 'Add a project' })).not.toBeInTheDocument()
})

test('guards repeated Google sign-ins and allows retry after a rejected popup', async () => {
  let rejectSignIn
  signInWithGoogle.mockReturnValueOnce(new Promise((resolve, reject) => { rejectSignIn = reject }))
  signInWithGoogle.mockResolvedValueOnce({ user: { uid: 'signed-in-user' } })
  render(<Dashboard />)
  act(() => onAuthStateChanged.mock.calls[0][1](null))
  fireEvent.click(screen.getByRole('button', { name: 'Sign in with Google' }))
  const pendingButton = screen.getByRole('button', { name: 'Connecting to Google…' })
  expect(pendingButton).toBeDisabled()
  fireEvent.click(pendingButton)
  expect(signInWithGoogle).toHaveBeenCalledTimes(1)

  await act(async () => rejectSignIn(new Error('Popup closed')))
  expect(screen.getByRole('alert')).toHaveTextContent('Sign-in was not completed.')
  fireEvent.click(screen.getByRole('button', { name: 'Sign in with Google' }))
  await screen.findByRole('button', { name: 'Sign in with Google' })
  expect(signInWithGoogle).toHaveBeenCalledTimes(2)
  expect(screen.queryByRole('alert')).not.toBeInTheDocument()
})
