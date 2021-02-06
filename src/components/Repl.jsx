import { useCallback, useState } from 'react'
import EditorPanel from './editor/CodeMirrorPanel'
import styles from './Repl.module.css'

export default function Repl() {
  const [optionsEditorOptions] = useState({ mode: 'json' })

  const [options, setOptions] = useState('{}')
  const [code, setCode] = useState('// 编写或粘贴代码到此处')
  const [minifiedCode, setMinifiedCode] = useState('// Terser output')

  function doMinify(value) {
    // todo...
    return value
  }

  const updateCode = useCallback((value) => {
    setCode(value)
    const output = doMinify(value)
    if (output) {
      setMinifiedCode(output)
    }
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.horizontalLayout}>
        <div className={styles.card}>
          <EditorPanel
            title="Input"
            showFileSize
            code={code}
            onChange={updateCode}
          />
        </div>
        <div className={styles.card}>
          <div className={styles.verticalLayout}>
            <div className={styles.card}>
              <EditorPanel
                title="Terser Options"
                code={options}
                options={optionsEditorOptions}
                onChange={setOptions}
              />
            </div>
            <div className={styles.card2}>
              <EditorPanel title="Output" showFileSize code={minifiedCode} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
