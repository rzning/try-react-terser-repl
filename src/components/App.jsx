import logo from '../assets/terser-logo.png'
import styles from './App.module.css'
import Repl from './Repl'

export default function App() {
  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <img src={logo} alt="terser-logo" />
        <span>Terser REPL Demo</span>
      </header>
      <main className={styles.content}>
        <Repl />
      </main>
    </div>
  )
}
