import cx from 'classnames'
import { useCallback, useState } from 'react'
import defaultTerserOptions from '../configs/defaultTerserOptions.json'
import { format } from '../utils/beautifier'
import { doMinify } from '../utils/minify'
import EditorPanel from './editor/CodeMirrorPanel'
import styles from './Repl.module.css'

export default function Repl() {
  const [optionsCodeEditorOptions] = useState({ mode: 'json' })
  const [terserOptionsCode, setTerserOptionsCode] = useState(() =>
    format(JSON.stringify(defaultTerserOptions), 'json')
  )
  const [terserOptions, setTerserOptions] = useState(() => defaultTerserOptions)
  const [optionsErrorMessage, setOptionsErrorMessage] = useState('')
  const [code, setCode] = useState('// 编写或粘贴代码到此处')
  const [minifiedCode, setMinifiedCode] = useState('// Terser output')
  const [errorInfo, setErrorInfo] = useState()

  const updateOptionsCode = useCallback((value) => {
    setTerserOptionsCode(value)
    try {
      const options = JSON.parse(value)
      setTerserOptions(options)
      setOptionsErrorMessage('')
    } catch (exception) {
      setOptionsErrorMessage(exception.message)
    }
  }, [])

  const updateCode = useCallback(
    async (value) => {
      setCode(value)
      const output = await doMinify(value, terserOptions)
      if (output) {
        if (output.error) {
          setErrorInfo(output.error)
          setMinifiedCode('')
        } else {
          setErrorInfo(null)
          setMinifiedCode(output.code)
        }
      }
    },
    [terserOptions]
  )

  return (
    <div className={styles.container}>
      <div className={styles.horizontalLayout}>
        <div className={cx(styles.card, styles.w30)}>
          <EditorPanel
            format
            title="Terser Options"
            code={terserOptionsCode}
            options={optionsCodeEditorOptions}
            onChange={updateOptionsCode}
            errorMessage={optionsErrorMessage}
          />
        </div>
        <div className={cx(styles.card, styles.w50)}>
          <EditorPanel
            title="Input"
            showFileSize
            code={code}
            onChange={updateCode}
            errorInfo={errorInfo}
          />
        </div>
        <div className={cx(styles.card, styles.w30)}>
          <EditorPanel title="Output" showFileSize code={minifiedCode} />
        </div>
      </div>
    </div>
  )
}
