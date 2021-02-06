import cx from 'classnames'
import { memo, useCallback, useMemo, useState } from 'react'
import { getCodeSizeInBytes } from '../../utils/helpers'
import CodeMirror from './CodeMirror'
import styles from './CodeMirrorPanel.module.css'

export default memo(function CodeMirrorPanel(props) {
  /**
   * 选项
   */
  const options = useMemo(() => {
    return {
      ...props.options,
      readOnly: !props.onChange
    }
  }, [props.onChange, props.options])

  /**
   * 代码字节数
   */
  const fileSize = useMemo(() => {
    if (props.showFileSize) {
      return getCodeSizeInBytes(props.code)
    }
    return 0
  }, [props.showFileSize, props.code])

  const [modeName, setModeName] = useState(null)

  const onEditorMounted = useCallback(
    /**
     * @param {import('codemirror').Editor} editor
     */
    (editor) => {
      setModeName(editor.getOption('mode'))
    },
    []
  )

  return (
    <div className={cx(styles.container, props.className)}>
      <div className={styles.header}>
        <div className={styles.title}>{props.title}</div>
        {props.showFileSize && (
          <div className={styles.widget}>{fileSize} bytes</div>
        )}
        <div className={styles.widget}>{modeName}</div>
      </div>
      <div className={styles.codeMirror}>
        <CodeMirror
          theme={props.theme}
          options={options}
          value={props.code}
          onChange={props.onChange}
          onEditorMounted={onEditorMounted}
        />
      </div>
    </div>
  )
})
