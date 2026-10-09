import { act, fireEvent, render, screen } from '@testing-library/react'
import { addDoc, collection } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { auth, db } from '../../firebase'
import Home from './home'

jest.mock('../../firebase', () => ({ auth: { signOut: jest.fn() }, storage: {}, db: {} }))
jest.mock('firebase/firestore', () => ({ addDoc: jest.fn(), collection: jest.fn() }))
jest.mock('firebase/storage', () => ({ ref: jest.fn(), uploadBytes: jest.fn(), getDownloadURL: jest.fn() }))

const originalCrypto = Object.getOwnPropertyDescriptor(window, 'crypto')
const firstUploadId = '00000000-0000-4000-8000-000000000001'
const secondUploadId = '00000000-0000-4000-8000-000000000002'

beforeAll(() => {
  Object.defineProperty(window, 'crypto', {
    configurable: true,
    value: { randomUUID: jest.fn() },
  })
})

afterAll(() => {
  if (originalCrypto) Object.defineProperty(window, 'crypto', originalCrypto)
  else delete window.crypto
})

const completeForm = () => {
  fireEvent.change(screen.getByLabelText('Project name'), { target: { value: ' Example project ' } })
  fireEvent.change(screen.getByLabelText('Description'), { target: { value: ' A useful application. ' } })
  fireEvent.change(screen.getByLabelText('Project URL'), { target: { value: 'https://example.com/project' } })
}

const chooseImage = () => {
  const image = new File(['example image'], 'project.png', { type: 'image/png' })
  fireEvent.change(screen.getByLabelText('Project image (optional)'), { target: { files: [image] } })
  return image
}

beforeEach(() => {
  jest.resetAllMocks()
  crypto.randomUUID.mockReturnValue(firstUploadId)
  collection.mockReturnValue('portfolio-collection')
  ref.mockReturnValue('image-reference')
  uploadBytes.mockResolvedValue({ ref: 'uploaded-reference' })
  getDownloadURL.mockResolvedValue('https://example.com/project.png')
  addDoc.mockResolvedValue({ id: 'project-id' })
  auth.signOut.mockResolvedValue()
})

test('requires text and a complete HTTPS URL before any upload or write', () => {
  render(<Home />)
  const form = screen.getByRole('form', { name: 'Add a portfolio project' })
  fireEvent.submit(form)
  expect(addDoc).not.toHaveBeenCalled()

  completeForm()
  for (const value of ['http://example.com', 'ftp://example.com', 'https://user:password@example.com']) {
    fireEvent.change(screen.getByLabelText('Project URL'), { target: { value } })
    fireEvent.submit(form)
    expect(screen.getByLabelText('Project URL')).toBeInvalid()
  }
  expect(uploadBytes).not.toHaveBeenCalled()
  expect(addDoc).not.toHaveBeenCalled()
})

test('saves the existing portfolio schema without an image and guards duplicate submits', async () => {
  let finishSaving
  addDoc.mockReturnValue(new Promise((resolve) => { finishSaving = resolve }))
  render(<Home />)
  completeForm()
  const form = screen.getByRole('form', { name: 'Add a portfolio project' })
  fireEvent.submit(form)
  fireEvent.submit(form)

  expect(collection).toHaveBeenCalledWith(db, 'portfolio')
  expect(addDoc).toHaveBeenCalledTimes(1)
  expect(addDoc).toHaveBeenCalledWith('portfolio-collection', {
    name: 'Example project', description: 'A useful application.',
    url: 'https://example.com/project', image: null,
  })
  expect(uploadBytes).not.toHaveBeenCalled()
  expect(screen.getByRole('button', { name: 'Saving…' })).toBeDisabled()
  expect(screen.getByRole('button', { name: 'Sign out' })).toBeDisabled()
  expect(screen.queryByText('Project saved.')).not.toBeInTheDocument()

  await act(async () => finishSaving({ id: 'project-id' }))
  expect(screen.getByRole('status')).toHaveTextContent('Project saved.')
  expect(screen.getByLabelText('Project name')).toHaveValue('')
})

test('uploads the chosen image before saving its download URL', async () => {
  render(<Home />)
  completeForm()
  const image = chooseImage()
  fireEvent.submit(screen.getByRole('form', { name: 'Add a portfolio project' }))

  expect(await screen.findByText('Project saved.')).toBeInTheDocument()
  expect(ref).toHaveBeenCalledWith(expect.anything(), `portfolio/${firstUploadId}-project.png`)
  expect(uploadBytes).toHaveBeenCalledWith('image-reference', image)
  expect(getDownloadURL).toHaveBeenCalledWith('uploaded-reference')
  expect(addDoc).toHaveBeenCalledWith('portfolio-collection', expect.objectContaining({
    image: 'https://example.com/project.png',
  }))
})

test('uploads matching filenames to separate objects without overwriting the first image', async () => {
  crypto.randomUUID.mockReturnValueOnce(firstUploadId).mockReturnValueOnce(secondUploadId)
  ref.mockImplementation((storage, path) => path)
  render(<Home />)

  completeForm()
  const firstImage = chooseImage()
  fireEvent.submit(screen.getByRole('form', { name: 'Add a portfolio project' }))
  expect(await screen.findByText('Project saved.')).toBeInTheDocument()

  completeForm()
  const secondImage = chooseImage()
  fireEvent.submit(screen.getByRole('form', { name: 'Add a portfolio project' }))
  expect(await screen.findByText('Project saved.')).toBeInTheDocument()

  expect(uploadBytes).toHaveBeenCalledTimes(2)
  expect(uploadBytes).toHaveBeenNthCalledWith(1, `portfolio/${firstUploadId}-project.png`, firstImage)
  expect(uploadBytes).toHaveBeenNthCalledWith(2, `portfolio/${secondUploadId}-project.png`, secondImage)
  expect(uploadBytes.mock.calls[0][0]).not.toEqual(uploadBytes.mock.calls[1][0])
  expect(addDoc).toHaveBeenCalledTimes(2)
})

test.each(['upload', 'download URL'])('%s failure does not save a project and retains form values', async (stage) => {
  if (stage === 'upload') uploadBytes.mockRejectedValue(new Error('Upload failed'))
  else getDownloadURL.mockRejectedValue(new Error('Download URL failed'))
  render(<Home />)
  completeForm()
  chooseImage()
  fireEvent.submit(screen.getByRole('form', { name: 'Add a portfolio project' }))

  expect(await screen.findByRole('alert')).toHaveTextContent('The project was not saved.')
  expect(addDoc).not.toHaveBeenCalled()
  expect(screen.getByLabelText('Project name')).toHaveValue(' Example project ')
  expect(screen.getByLabelText('Description')).toHaveValue(' A useful application. ')
  expect(screen.getByLabelText('Project URL')).toHaveValue('https://example.com/project')
  expect(screen.getByLabelText('Project image (optional)').files).toHaveLength(1)
  expect(screen.getByRole('button', { name: 'Save project' })).toBeEnabled()
})

test('a rejected database write reports failure, preserves details, and permits retry', async () => {
  addDoc.mockRejectedValueOnce(new Error('Write rejected'))
  render(<Home />)
  completeForm()
  fireEvent.submit(screen.getByRole('form', { name: 'Add a portfolio project' }))
  expect(await screen.findByRole('alert')).toHaveTextContent('The project could not be saved.')
  expect(screen.getByLabelText('Project name')).toHaveValue(' Example project ')
  expect(screen.queryByText('Project saved.')).not.toBeInTheDocument()

  fireEvent.submit(screen.getByRole('form', { name: 'Add a portfolio project' }))
  expect(await screen.findByText('Project saved.')).toBeInTheDocument()
  expect(addDoc).toHaveBeenCalledTimes(2)
})

test('sign out never submits the form and reports an auth failure', async () => {
  auth.signOut.mockRejectedValueOnce(new Error('Sign-out failed'))
  render(<Home />)
  completeForm()
  const button = screen.getByRole('button', { name: 'Sign out' })
  expect(button).toHaveAttribute('type', 'button')
  fireEvent.click(button)

  expect(await screen.findByRole('alert')).toHaveTextContent('You could not be signed out.')
  expect(auth.signOut).toHaveBeenCalledTimes(1)
  expect(addDoc).not.toHaveBeenCalled()
  expect(screen.getByLabelText('Project name')).toHaveValue(' Example project ')
})
