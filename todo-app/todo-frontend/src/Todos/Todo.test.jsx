import { render, screen } from '@testing-library/react'
import Todo from './Todo'

test('renders Todo', () => {
  const todoNote = {
    text: "Testing with vitest",
    done: false
  }

  const Done = 'This todo is done'
  const notDone = 'This todo is not done'

  render(<Todo todo={todoNote} doneInfo={Done} notDoneInfo={notDone} />)

  expect(screen.getByText('Testing with vitest')).toBeDefined()
  expect(screen.getByText('This todo is not done')).toBeDefined()
})