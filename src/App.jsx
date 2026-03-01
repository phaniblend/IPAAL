import { useState } from 'react'
import LandingPage from './LandingPage'
import INPACTEngineP01 from './engines/inpact_p01_engine'
import INPACTEngineP02 from './engines/inpact_p02_engine'
import INPACTEngineP03 from './engines/inpact_p03_engine'
import INPACTEngineP04 from './engines/inpact_p04_engine'
import INPACTEngineP05 from './engines/inpact_p05_engine'
import INPACTEngineP06 from './engines/inpact_p06_engine'
import INPACTEngineP07 from './engines/inpact_p07_engine'
import INPACTEngineP08 from './engines/inpact_p08_engine'
import INPACTEngineP09 from './engines/inpact_p09_engine'
import INPACTEngineP10 from './engines/inpact_p10_engine'
import INPACTEngineP11 from './engines/inpact_p11_engine'
import INPACTEngineP12 from './engines/inpact_p12_engine'
import INPACTEngineP13 from './engines/inpact_p13_engine'
import INPACTEngineP14 from './engines/inpact_p14_engine'
import INPACTEngineP15 from './engines/inpact_p15_engine'
import INPACTEngineP16 from './engines/inpact_p16_engine'
import INPACTEngineP17 from './engines/inpact_p17_engine'
import INPACTEngineP18 from './engines/inpact_p18_engine'
import INPACTEngineP19 from './engines/inpact_p19_engine'
import INPACTEngineP20 from './engines/inpact_p20_engine'
import INPACTEngineP21 from './engines/inpact_p21_engine'
import INPACTEngineP22 from './engines/inpact_p22_engine'
import INPACTEngineP23 from './engines/inpact_p23_engine'
import INPACTEngineP24 from './engines/inpact_p24_engine'
import INPACTEngineP25 from './engines/inpact_p25_engine'
import INPACTEngineP26 from './engines/inpact_p26_engine'
import INPACTEngineP27 from './engines/inpact_p27_engine'
import INPACTEngineP28 from './engines/inpact_p28_engine'
import INPACTEngineP29 from './engines/inpact_p29_engine'
import INPACTEngineP30 from './engines/inpact_p30_engine'

const ENGINES = [
  INPACTEngineP01,
  INPACTEngineP02,
  INPACTEngineP03,
  INPACTEngineP04,
  INPACTEngineP05,
  INPACTEngineP06,
  INPACTEngineP07,
  INPACTEngineP08,
  INPACTEngineP09,
  INPACTEngineP10,
  INPACTEngineP11,
  INPACTEngineP12,
  INPACTEngineP13,
  INPACTEngineP14,
  INPACTEngineP15,
  INPACTEngineP16,
  INPACTEngineP17,
  INPACTEngineP18,
  INPACTEngineP19,
  INPACTEngineP20,
  INPACTEngineP21,
  INPACTEngineP22,
  INPACTEngineP23,
  INPACTEngineP24,
  INPACTEngineP25,
  INPACTEngineP26,
  INPACTEngineP27,
  INPACTEngineP28,
  INPACTEngineP29,
  INPACTEngineP30,
]

export default function App() {
  const [problemIndex, setProblemIndex] = useState(null) // null = landing, 0-based index = problem
  const onBackToProblems = () => setProblemIndex(null)

  if (problemIndex === null) {
    return <LandingPage onSelectProblem={setProblemIndex} />
  }

  const Engine = ENGINES[problemIndex]
  const onNextProblem = () => setProblemIndex((i) => Math.min(i + 1, ENGINES.length - 1))

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 9999,
          padding: '10px 16px',
          background: 'rgba(13,17,23,0.95)',
          borderBottom: '1px solid #1e2733',
          borderRight: '1px solid #1e2733',
          borderBottomRightRadius: '8px',
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <button
          type="button"
          onClick={onBackToProblems}
          style={{
            background: 'none',
            border: 'none',
            color: '#00d4ff',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '600',
            letterSpacing: '0.05em',
          }}
        >
          ← All Problems
        </button>
      </div>
      <Engine
        onNextProblem={problemIndex < ENGINES.length - 1 ? onNextProblem : undefined}
        onBackToProblems={onBackToProblems}
      />
    </>
  )
}