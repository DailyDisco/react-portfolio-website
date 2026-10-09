import { act, fireEvent, render, screen } from '@testing-library/react'
import emailjs from '@emailjs/browser'
import Contact from './index'

jest.mock('@emailjs/browser', () => ({ sendForm: jest.fn() }))

const completeForm = () => {
  fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Hiring team' } })
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'team@example.com' } })
  fireEvent.change(screen.getByLabelText('Subject'), { target: { value: 'Engineering role' } })
  fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'Let’s discuss our team.' } })
}

beforeEach(() => jest.resetAllMocks())

test('rejects missing, invalid email, and whitespace-only values before sending', () => {
  render(<Contact />)
  const form = screen.getByRole('form', { name: 'Contact Diego' })
  fireEvent.submit(form)
  expect(emailjs.sendForm).not.toHaveBeenCalled()

  completeForm()
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'invalid-email' } })
  fireEvent.submit(form)
  expect(screen.getByLabelText('Email')).toBeInvalid()
  expect(emailjs.sendForm).not.toHaveBeenCalled()

  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'team@example.com' } })
  fireEvent.change(screen.getByLabelText('Message'), { target: { value: '   ' } })
  fireEvent.submit(form)
  expect(screen.getByLabelText('Message')).toBeInvalid()
  expect(emailjs.sendForm).not.toHaveBeenCalled()
})

test('sends the existing template fields once and resets only after confirmed success', async () => {
  let finishSending
  emailjs.sendForm.mockReturnValue(new Promise((resolve) => { finishSending = resolve }))
  render(<Contact />)
  completeForm()
  const form = screen.getByRole('form', { name: 'Contact Diego' })

  fireEvent.submit(form)
  fireEvent.submit(form)
  expect(emailjs.sendForm).toHaveBeenCalledTimes(1)
  expect(emailjs.sendForm).toHaveBeenCalledWith(
    'service_x9eyeta', 'template_f4q0edh', form, 'Gip3snFovpUWaqP6V'
  )
  expect(Array.from(new FormData(form).keys())).toEqual(['name', 'email', 'subject', 'message'])
  expect(screen.getByRole('button', { name: 'Sending…' })).toBeDisabled()
  expect(screen.getByLabelText('Message')).toHaveValue('Let’s discuss our team.')
  expect(screen.queryByText(/Your message was sent/)).not.toBeInTheDocument()

  await act(async () => finishSending({ status: 200 }))
  expect(screen.getByRole('status')).toHaveTextContent('Your message was sent.')
  expect(screen.getByLabelText('Message')).toHaveValue('')
  expect(screen.getByRole('button', { name: 'Send message' })).toBeEnabled()
})

test('retains every field on failure and permits a retry', async () => {
  emailjs.sendForm.mockRejectedValueOnce(new Error('Network unavailable'))
  emailjs.sendForm.mockResolvedValueOnce({ status: 200 })
  render(<Contact />)
  completeForm()

  fireEvent.submit(screen.getByRole('form', { name: 'Contact Diego' }))
  expect(await screen.findByRole('alert')).toHaveTextContent('Your details are still here.')
  expect(screen.getByLabelText('Name')).toHaveValue('Hiring team')
  expect(screen.getByLabelText('Email')).toHaveValue('team@example.com')
  expect(screen.getByLabelText('Subject')).toHaveValue('Engineering role')
  expect(screen.getByLabelText('Message')).toHaveValue('Let’s discuss our team.')

  fireEvent.submit(screen.getByRole('form', { name: 'Contact Diego' }))
  expect(await screen.findByText(/Your message was sent/)).toBeInTheDocument()
  expect(emailjs.sendForm).toHaveBeenCalledTimes(2)
  expect(screen.queryByRole('alert')).not.toBeInTheDocument()
})
