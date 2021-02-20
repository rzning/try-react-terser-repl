import cx from 'classnames'
import { useCallback, useState } from 'react'
import { minify } from 'terser'
import EditorPanel from './editor/CodeMirrorPanel'
import styles from './Repl.module.css'

export default function Repl() {
  const [optionsEditorOptions] = useState({ mode: 'json' })

  const [options, setOptions] = useState('{}')
  const [code, setCode] = useState('// 编写或粘贴代码到此处')
  const [minifiedCode, setMinifiedCode] = useState('// Terser output')
  const [errorInfo, setErrorInfo] = useState()

  async function doMinify(value) {
    try {
      const result = await minify(value)
      return {
        code: (result && result.code) || ''
      }
    } catch (exception) {
      return {
        error: {
          line: exception.line,
          col: exception.col,
          pos: exception.pos,
          name: exception.name,
          message: exception.message
        }
      }
    }
  }

  const updateCode = useCallback(async (value) => {
    setCode(value)
    const output = await doMinify(value)
    if (output) {
      if (output.error) {
        setErrorInfo(output.error)
        setMinifiedCode('')
      } else {
        setErrorInfo(null)
        setMinifiedCode(output.code)
      }
    }
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.horizontalLayout}>
        <div className={cx(styles.card, styles.w50)}>
          <EditorPanel
            title="Input"
            showFileSize
            code={code}
            onChange={updateCode}
            errorInfo={errorInfo}
          />
        </div>
        <div className={cx(styles.card, styles.w50)}>
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
