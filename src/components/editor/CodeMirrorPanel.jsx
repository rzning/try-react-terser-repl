import cx from 'classnames'
import { memo, useCallback, useMemo, useRef, useState } from 'react'
import PropsTypes from 'prop-types'
import { getCodeSizeInBytes } from '../../utils/helpers'
import { useErrorStatusbar, useSimpleErrorStatusbar } from './useErrorStatusbar'
import CodeMirror from './CodeMirror'
import styles from './CodeMirrorPanel.module.css'
import { format } from '../../utils/beautifier'

function CodeMirrorPanel(props) {
  const { code, onChange } = props || {}
  /**
   * 选项
   */
  const options = useMemo(() => {
    return {
      ...props.options,
      readOnly: !onChange
    }
  }, [onChange, props.options])

  /**
   * 代码字节数
   */
  const fileSize = useMemo(() => {
    if (props.showFileSize) {
      return getCodeSizeInBytes(code)
    }
    return 0
  }, [props.showFileSize, code])

  const editor = useRef(null)
  const [modeName, setModeName] = useState(null)

  /**
   * 编辑器完成挂载回调
   */
  const onEditorMounted = useCallback(
    /**
     * @param {import('codemirror').Editor} cmeditor
     */
    (cmeditor) => {
      editor.current = cmeditor
      setModeName(cmeditor.getOption('mode'))
    },
    []
  )

  // 显示错误提示信息 errorInfo
  useErrorStatusbar(editor.current, props.errorInfo)
  useSimpleErrorStatusbar(editor.current, props.errorMessage)

  const doFormat = useCallback(() => {
    if (props.format && typeof onChange === 'function') {
      const value = format(code, modeName)
      onChange(value)
    }
  }, [code, modeName, onChange, props.format])

  return (
    <div className={cx(styles.container, props.className)}>
      <div className={styles.header}>
        <div className={styles.title}>{props.title}</div>
        {props.format && (
          <div className={styles.widget} title="Format" onClick={doFormat}>
            {'</>'}
          </div>
        )}
        {props.showFileSize && (
          <div className={styles.widget}>{fileSize} bytes</div>
        )}
        <div className={styles.widget}>{modeName}</div>
      </div>
      <div className={styles.codeMirror}>
        <CodeMirror
          width="100%"
          height="100%"
          theme={props.theme}
          options={options}
          value={props.code}
          onChange={onChange}
          onEditorMounted={onEditorMounted}
        />
      </div>
    </div>
  )
}

CodeMirrorPanel.propTypes = {
  className: PropsTypes.string,
  title: PropsTypes.string,
  options: PropsTypes.object,
  theme: PropsTypes.string,
  showFileSize: PropsTypes.bool,
  format: PropsTypes.bool,
  code: PropsTypes.string.isRequired,
  onChange: PropsTypes.func,
  errorMessage: PropsTypes.string,
  errorInfo: PropsTypes.shape({
    line: PropsTypes.number.isRequired,
    col: PropsTypes.number,
    pos: PropsTypes.number,
    name: PropsTypes.string.isRequired,
    message: PropsTypes.string.isRequired
  })
}

export default memo(CodeMirrorPanel)
