import { act, fireEvent, render, screen } from '@testing-library/react'
import emailjs from '@emailjs/browser'
import Contact from './index'

jest.mock('@emailjs/browser', () => ({ sendForm: jest.fn() }))

const completeForm = () => {
  fireEvent.change(screen.getByLabelText('Name'), {
    target: { value: 'Hiring team' },
  })
  fireEvent.change(screen.getByLabelText('Email'), {
    target: { value: 'team@example.com' },
  })
  fireEvent.change(screen.getByLabelText('Subject (optional)'), {
    target: { value: 'Engineering role' },
  })
  fireEvent.change(screen.getByLabelText('Message'), {
    target: { value: 'Let’s discuss our team.' },
  })
}

beforeEach(() => jest.resetAllMocks())

test('rejects missing, invalid email, and whitespace-only values before sending', () => {
  render(<Contact />)
  const form = screen.getByRole('form', { name: 'Contact Diego' })
  fireEvent.submit(form)
  expect(emailjs.sendForm).not.toHaveBeenCalled()

  completeForm()
  fireEvent.change(screen.getByLabelText('Email'), {
    target: { value: 'invalid-email' },
  })
  fireEvent.submit(form)
  expect(screen.getByLabelText('Email')).toBeInvalid()
  expect(emailjs.sendForm).not.toHaveBeenCalled()

  fireEvent.change(screen.getByLabelText('Email'), {
    target: { value: 'team@example.com' },
  })
  fireEvent.change(screen.getByLabelText('Message'), {
    target: { value: '   ' },
  })
  fireEvent.submit(form)
  expect(screen.getByLabelText('Message')).toBeInvalid()
  expect(emailjs.sendForm).not.toHaveBeenCalled()
})

test('sends the existing template fields once and resets only after confirmed success', async () => {
  let finishSending
  emailjs.sendForm.mockReturnValue(
    new Promise((resolve) => {
      finishSending = resolve
    })
  )
  render(<Contact />)
  completeForm()
  const form = screen.getByRole('form', { name: 'Contact Diego' })

  fireEvent.submit(form)
  fireEvent.submit(form)
  expect(emailjs.sendForm).toHaveBeenCalledTimes(1)
  expect(emailjs.sendForm).toHaveBeenCalledWith(
    'service_x9eyeta',
    'template_f4q0edh',
    form,
    'Gip3snFovpUWaqP6V'
  )
  expect(Array.from(new FormData(form).keys())).toEqual([
    'name',
    'email',
    'subject',
    'message',
  ])
  expect(screen.getByRole('button', { name: 'Sending…' })).toBeDisabled()
  expect(screen.getByLabelText('Message')).toHaveValue(
    'Let’s discuss our team.'
  )
  expect(screen.queryByText(/Your message was sent/)).not.toBeInTheDocument()

  await act(async () => finishSending({ status: 200 }))
  expect(
    screen.getByRole('status', { name: 'Message status' })
  ).toHaveTextContent('Your message was sent.')
  expect(screen.getByLabelText('Message')).toHaveValue('')
  expect(screen.getByRole('button', { name: 'Send message' })).toBeEnabled()
})

test('retains every field on failure and permits a retry', async () => {
  emailjs.sendForm.mockRejectedValueOnce(new Error('Network unavailable'))
  emailjs.sendForm.mockResolvedValueOnce({ status: 200 })
  render(<Contact />)
  completeForm()

  fireEvent.submit(screen.getByRole('form', { name: 'Contact Diego' }))
  expect(await screen.findByRole('alert')).toHaveTextContent(
    'Your details are still here.'
  )
  expect(screen.getByLabelText('Name')).toHaveValue('Hiring team')
  expect(screen.getByLabelText('Email')).toHaveValue('team@example.com')
  expect(screen.getByLabelText('Subject (optional)')).toHaveValue(
    'Engineering role'
  )
  expect(screen.getByLabelText('Message')).toHaveValue(
    'Let’s discuss our team.'
  )

  fireEvent.submit(screen.getByRole('form', { name: 'Contact Diego' }))
  expect(await screen.findByText(/Your message was sent/)).toBeInTheDocument()
  expect(emailjs.sendForm).toHaveBeenCalledTimes(2)
  expect(screen.queryByRole('alert')).not.toBeInTheDocument()
})

afterEach(() => {
  delete navigator.clipboard
})

test('confirms a copied email only after the clipboard operation completes', async () => {
  let finishCopy
  const writeText = jest.fn(
    () =>
      new Promise((resolve) => {
        finishCopy = resolve
      })
  )
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText },
  })
  render(<Contact />)
  fireEvent.click(screen.getByRole('button', { name: 'Copy email' }))
  expect(writeText).toHaveBeenCalledWith('diegoespinowork@gmail.com')
  expect(screen.getByRole('button', { name: 'Copy email' })).toBeDisabled()
  expect(
    screen.getByRole('status', { name: 'Copy email status' })
  ).toBeEmptyDOMElement()
  await act(async () => finishCopy())
  expect(
    screen.getByRole('status', { name: 'Copy email status' })
  ).toHaveTextContent('Email copied.')
  expect(screen.getByRole('button', { name: 'Copy email' })).toBeEnabled()
})

test.each(['missing', 'denied'])(
  'offers manual copy when clipboard access is %s',
  async (condition) => {
    if (condition === 'denied') {
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: {
          writeText: jest.fn().mockRejectedValue(new Error('Not allowed')),
        },
      })
    }
    render(<Contact />)
    fireEvent.click(screen.getByRole('button', { name: 'Copy email' }))
    expect(
      await screen.findByText(/Select and copy the email address above/)
    ).toBeVisible()
    expect(screen.queryByText('Email copied.')).not.toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /diegoespinowork\s*@gmail.com/ })
    ).toHaveAttribute('href', 'mailto:diegoespinowork@gmail.com')
  }
)

test('supplies a template subject when omitted, restores the blank on failure, and retries', async () => {
  const submittedSubjects = []
  emailjs.sendForm
    .mockImplementationOnce((service, template, form) => {
      submittedSubjects.push(new FormData(form).get('subject'))
      return Promise.reject(new Error('Unavailable'))
    })
    .mockImplementationOnce((service, template, form) => {
      submittedSubjects.push(new FormData(form).get('subject'))
      return Promise.resolve({ status: 200 })
    })
  render(<Contact />)
  completeForm()
  const subject = screen.getByLabelText('Subject (optional)')
  fireEvent.change(subject, { target: { value: '' } })
  expect(subject).not.toBeRequired()
  fireEvent.submit(screen.getByRole('form', { name: 'Contact Diego' }))
  expect(await screen.findByRole('alert')).toBeVisible()
  expect(subject).toHaveValue('')
  expect(screen.getByLabelText('Message')).toHaveValue(
    'Let’s discuss our team.'
  )
  fireEvent.submit(screen.getByRole('form', { name: 'Contact Diego' }))
  expect(await screen.findByText(/Your message was sent/)).toBeVisible()
  expect(submittedSubjects).toEqual([
    'Engineering opportunity',
    'Engineering opportunity',
  ])
  expect(subject).toHaveValue('')
})
