import { useState } from 'react'
import CodeEditor from './editor/CodeMirrorPanel'
import logo from '../assets/terser-logo.png'
import styles from './App.module.css'

export default function App() {
  const [code, setCode] = useState('// 编写或粘贴代码到此处')

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <img src={logo} alt="terser-logo" />
        <span>Terser REPL Demo</span>
      </header>
      <main className={styles.content}>
        <CodeEditor code={code} onChange={setCode} />
      </main>
    </div>
  )
}
