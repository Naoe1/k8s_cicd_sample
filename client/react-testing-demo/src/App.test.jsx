import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'

// ─── Helper ───────────────────────────────────────────────────────────────────

function clickBtn(label) {
  fireEvent.click(screen.getByText(label))
}

function getDisplay() {
  return screen.getByText(/^-?[\d.]+$|^Error$|^Div\/0$/, { selector: '.display-value' }).textContent
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('Calculator — basic display', () => {
  beforeEach(() => render(<App />))

  it('shows 0 on initial render', () => {
    expect(getDisplay()).toBe('0')
  })

  it('replaces 0 when a digit is pressed', () => {
    clickBtn('5')
    expect(getDisplay()).toBe('5')
  })

  it('appends digits correctly', () => {
    clickBtn('1'); clickBtn('2'); clickBtn('3')
    expect(getDisplay()).toBe('123')
  })

  it('AC clears the display', () => {
    clickBtn('9'); clickBtn('AC')
    expect(getDisplay()).toBe('0')
  })

  it('backspace removes last digit', () => {
    clickBtn('4'); clickBtn('2'); clickBtn('⌫')
    expect(getDisplay()).toBe('4')
  })

  it('handles decimal input', () => {
    clickBtn('3'); clickBtn('.'); clickBtn('1'); clickBtn('4')
    expect(getDisplay()).toBe('3.14')
  })

  it('prevents duplicate decimal point', () => {
    clickBtn('1'); clickBtn('.'); clickBtn('.')
    expect(getDisplay()).toBe('1.')
  })
})

describe('Calculator — arithmetic', () => {
  beforeEach(() => render(<App />))

  it('adds two numbers', () => {
    clickBtn('3'); clickBtn('+'); clickBtn('4'); clickBtn('=')
    expect(getDisplay()).toBe('7')
  })

  it('subtracts two numbers', () => {
    clickBtn('9'); clickBtn('−'); clickBtn('3'); clickBtn('=')
    expect(getDisplay()).toBe('6')
  })

  it('multiplies two numbers', () => {
    clickBtn('6'); clickBtn('×'); clickBtn('7'); clickBtn('=')
    expect(getDisplay()).toBe('42')
  })

  it('divides two numbers', () => {
    clickBtn('8'); clickBtn('÷'); clickBtn('4'); clickBtn('=')
    expect(getDisplay()).toBe('2')
  })

  it('chains multiple operations', () => {
    clickBtn('2'); clickBtn('+'); clickBtn('3'); clickBtn('+'); clickBtn('4'); clickBtn('=')
    expect(getDisplay()).toBe('9')
  })

  it('handles division by zero', () => {
    clickBtn('5'); clickBtn('÷'); clickBtn('0'); clickBtn('=')
    expect(getDisplay()).toBe('Div/0')
  })

  it('percentage converts correctly', () => {
    clickBtn('5'); clickBtn('0'); clickBtn('%')
    expect(getDisplay()).toBe('0.5')
  })

  it('toggles negative sign', () => {
    clickBtn('8'); clickBtn('+/−')
    expect(getDisplay()).toBe('-8')
  })

  it('toggles back to positive', () => {
    clickBtn('8'); clickBtn('+/−'); clickBtn('+/−')
    expect(getDisplay()).toBe('8')
  })
})

describe('Calculator — history', () => {
  beforeEach(() => render(<App />))

  it('records completed calculations in history', () => {
    clickBtn('5'); clickBtn('+'); clickBtn('3'); clickBtn('=')
    fireEvent.click(screen.getByTitle('History'))
    expect(screen.getByText('= 8')).toBeInTheDocument()
  })

  it('recalls a result from history', () => {
    clickBtn('6'); clickBtn('×'); clickBtn('7'); clickBtn('=')
    fireEvent.click(screen.getByTitle('History'))
    fireEvent.click(screen.getByText('= 42'))
    expect(screen.getByText('42', { selector: '.display-value' })).toBeInTheDocument()
  })

  it('clears history', () => {
    clickBtn('2'); clickBtn('+'); clickBtn('3'); clickBtn('=')
    fireEvent.click(screen.getByTitle('History'))
    fireEvent.click(screen.getByText('Clear history'))
    expect(screen.getByText('No history yet')).toBeInTheDocument()
  })
})