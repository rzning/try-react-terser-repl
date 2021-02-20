import cx from 'classnames'
import { memo, useCallback, useMemo, useRef, useState } from 'react'
import PropsTypes from 'prop-types'
import { getCodeSizeInBytes } from '../../utils/helpers'
import { useErrorStatusbar } from './useErrorStatusbar'
import CodeMirror from './CodeMirror'
import styles from './CodeMirrorPanel.module.css'

function CodeMirrorPanel(props) {
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
}

CodeMirrorPanel.propTypes = {
  className: PropsTypes.string,
  title: PropsTypes.string,
  options: PropsTypes.object,
  theme: PropsTypes.string,
  showFileSize: PropsTypes.bool,
  code: PropsTypes.string.isRequired,
  onChange: PropsTypes.func,
  errorInfo: PropsTypes.shape({
    line: PropsTypes.number.isRequired,
    col: PropsTypes.number,
    pos: PropsTypes.number,
    name: PropsTypes.string.isRequired,
    message: PropsTypes.string.isRequired
  })
}

export default memo(CodeMirrorPanel)
