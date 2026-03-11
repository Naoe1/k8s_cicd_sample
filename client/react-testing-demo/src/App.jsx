import { useState, useCallback, useEffect } from 'react'
import './App.css'

// ─── Calculator Logic (pure functions) ───────────────────────────────────────

function evaluate(left, op, right) {
  switch (op) {
    case '+': return left + right
    case '−': return left - right
    case '×': return left * right
    case '÷':
      if (right === 0) throw new Error('DIV_ZERO')
      return left / right
    default:  return right
  }
}

function fmt(n) {
  if (!isFinite(n)) return 'Error'
  const s = parseFloat(n.toPrecision(10)).toString()
  return s.length > 12 ? n.toExponential(4) : s
}

// ─── History Item ─────────────────────────────────────────────────────────────

function HistoryItem({ entry, onRecall }) {
  return (
    <button className="hist-item" onClick={() => onRecall(entry.result)}>
      <span className="hist-expr">{entry.expression}</span>
      <span className="hist-result">= {entry.result}</span>
    </button>
  )
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [display, setDisplay]   = useState('0')
  const [expr, setExpr]         = useState('')
  const [operand, setOperand]   = useState('')
  const [operator, setOperator] = useState('')
  const [waiting, setWaiting]   = useState(false)
  const [hasError, setHasError] = useState(false)
  const [history, setHistory]   = useState([])
  const [showHist, setShowHist] = useState(false)
  const [flash, setFlash]       = useState(false)

  const triggerFlash = () => {
    setFlash(true)
    setTimeout(() => setFlash(false), 120)
  }

  const pushHistory = (expression, result) => {
    setHistory(h => [{ id: Date.now(), expression, result }, ...h].slice(0, 20))
  }

  const inputDigit = useCallback((d) => {
    triggerFlash()
    if (hasError) return
    setDisplay(prev => {
      if (waiting) { setWaiting(false); return d }
      if (prev === '0' && d !== '.') return d
      if (d === '.' && prev.includes('.')) return prev
      if (prev.replace('-','').length >= 12) return prev
      return prev + d
    })
  }, [hasError, waiting])

  const inputOp = useCallback((op) => {
    triggerFlash()
    if (hasError) return
    const cur = parseFloat(display)
    if (operator && !waiting) {
      try {
        const res = evaluate(parseFloat(operand), operator, cur)
        const f   = fmt(res)
        setDisplay(f); setOperand(f); setOperator(op)
        setExpr(`${f} ${op}`); setWaiting(true)
      } catch { setDisplay('Error'); setHasError(true) }
    } else {
      setOperand(display); setOperator(op)
      setExpr(`${display} ${op}`); setWaiting(true)
    }
  }, [display, operator, operand, waiting, hasError])

  const calculate = useCallback(() => {
    triggerFlash()
    if (!operator || hasError) return
    const left  = parseFloat(operand)
    const right = parseFloat(display)
    const fullExpr = `${operand} ${operator} ${display}`
    try {
      const res = evaluate(left, operator, right)
      const f   = fmt(res)
      pushHistory(fullExpr, f)
      setDisplay(f); setExpr(`${fullExpr} =`)
      setOperand(''); setOperator(''); setWaiting(false)
    } catch { setDisplay('Div/0'); setHasError(true) }
  }, [display, operator, operand, hasError])

  const clear = useCallback(() => {
    triggerFlash()
    setDisplay('0'); setExpr(''); setOperand('')
    setOperator(''); setWaiting(false); setHasError(false)
  }, [])

  const backspace = useCallback(() => {
    triggerFlash()
    if (hasError || waiting) return
    setDisplay(p => p.length > 1 ? p.slice(0, -1) : '0')
  }, [hasError, waiting])

  const toggleSign = useCallback(() => {
    if (hasError) return
    setDisplay(p => p.startsWith('-') ? p.slice(1) : '-' + p)
  }, [hasError])

  const percentage = useCallback(() => {
    if (hasError) return
    setDisplay(p => fmt(parseFloat(p) / 100))
  }, [hasError])

  const recallFromHistory = (result) => {
    setDisplay(result); setWaiting(false)
    setHasError(false); setShowHist(false)
  }

  // Keyboard support
  useEffect(() => {
    const handler = (e) => {
      if (e.key >= '0' && e.key <= '9') inputDigit(e.key)
      else if (e.key === '.') inputDigit('.')
      else if (e.key === '+') inputOp('+')
      else if (e.key === '-') inputOp('−')
      else if (e.key === '*') inputOp('×')
      else if (e.key === '/') { e.preventDefault(); inputOp('÷') }
      else if (e.key === 'Enter' || e.key === '=') calculate()
      else if (e.key === 'Backspace') backspace()
      else if (e.key === 'Escape') clear()
      else if (e.key === '%') percentage()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [inputDigit, inputOp, calculate, backspace, clear, percentage])

  const displayLen = display.length
  const displaySize = displayLen > 10 ? '2rem' : displayLen > 7 ? '2.6rem' : '3.2rem'

  const buttons = [
    { label: 'AC',  type: 'fn',  action: clear },
    { label: '+/−', type: 'fn',  action: toggleSign },
    { label: '%',   type: 'fn',  action: percentage },
    { label: '÷',   type: 'op',  action: () => inputOp('÷') },
    { label: '7',   type: 'num', action: () => inputDigit('7') },
    { label: '8',   type: 'num', action: () => inputDigit('8') },
    { label: '9',   type: 'num', action: () => inputDigit('9') },
    { label: '×',   type: 'op',  action: () => inputOp('×') },
    { label: '4',   type: 'num', action: () => inputDigit('4') },
    { label: '5',   type: 'num', action: () => inputDigit('5') },
    { label: '6',   type: 'num', action: () => inputDigit('6') },
    { label: '−',   type: 'op',  action: () => inputOp('−') },
    { label: '1',   type: 'num', action: () => inputDigit('1') },
    { label: '2',   type: 'num', action: () => inputDigit('2') },
    { label: '3',   type: 'num', action: () => inputDigit('3') },
    { label: '+',   type: 'op',  action: () => inputOp('+') },
    { label: '⌫',   type: 'fn',  action: backspace },
    { label: '0',   type: 'num', action: () => inputDigit('0') },
    { label: '.',   type: 'num', action: () => inputDigit('.') },
    { label: '=',   type: 'eq',  action: calculate },
  ]

  return (
    <div className="app">
      {/* Ambient background orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div className="calculator">
        {/* Header */}
        <div className="calc-header">
          <span className="calc-title">CALC</span>
          <button
            className={`hist-toggle ${showHist ? 'active' : ''}`}
            onClick={() => setShowHist(s => !s)}
            title="History"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            {history.length > 0 && <span className="hist-badge">{history.length}</span>}
          </button>
        </div>

        {/* History Panel */}
        {showHist && (
          <div className="hist-panel">
            {history.length === 0 ? (
              <p className="hist-empty">No history yet</p>
            ) : (
              <>
                <div className="hist-list">
                  {history.map(e => (
                    <HistoryItem key={e.id} entry={e} onRecall={recallFromHistory} />
                  ))}
                </div>
                <button className="hist-clear" onClick={() => setHistory([])}>
                  Clear history
                </button>
              </>
            )}
          </div>
        )}

        {/* Display */}
        <div className={`display ${hasError ? 'error' : ''} ${flash ? 'flash' : ''}`}>
          <div className="display-expr">{expr || '\u00a0'}</div>
          <div className="display-value" style={{ fontSize: displaySize }}>
            {display}
          </div>
        </div>

        {/* Button Grid */}
        <div className="grid">
          {buttons.map((btn, i) => (
            <button
              key={i}
              className={`btn btn-${btn.type}`}
              onClick={btn.action}
            >
              {btn.label}
            </button>
          ))}
        </div>

        <p className="kb-hint">keyboard supported</p>
      </div>
    </div>
  )
}