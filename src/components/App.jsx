import logo from '../assets/terser-logo.png'
import styles from './App.module.css'

export default function App() {
  return (
    <div className="app">
      <header className={styles.header}>
        <img src={logo} alt="terser-logo" />
        <span>Terser REPL Demo</span>
      </header>
    </div>
  )
}
