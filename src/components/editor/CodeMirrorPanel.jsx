import cx from 'classnames'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import PropsTypes from 'prop-types'
import { getCodeSizeInBytes } from '../../utils/helpers'
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
  useEffect(() => {
    /** @type {import('codemirror').Editor} */
    const cm = editor.current
    /**
      @type {{
        line: number
        col: number
        pos: number
        name: string
        message: string
      }}
     */
    const info = props.errorInfo
    if (cm && info) {
      /**
       * @type {import('codemirror').TextMarker}
       * @see https://codemirror.net/doc/manual.html#markText
       */
      var marker = null
      /**
       * @type {import('codemirror').LineWidget}
       * @see https://codemirror.net/demo/widget.html
       */
      var widget = null
      cm.operation(() => {
        // textMarker
        const line = info.line - 1
        const col = info.col < 1 ? 0 : info.col - 1
        marker = cm.markText(
          { line, ch: col },
          { line, ch: col + 1 },
          { className: styles.errorMarker }
        )
        // lineWidget
        const node = document.createElement('div')
        node.className = styles.errorLine
        const labelNode = document.createElement('span')
        labelNode.className = styles.errorLineLabel
        const label = `(${info.line},${info.col}) ${info.name}`
        labelNode.appendChild(document.createTextNode(label))
        node.appendChild(labelNode)
        node.appendChild(document.createTextNode(info.message))
        widget = cm.addLineWidget(info.line - 1, node)
      })
      return () => {
        if (marker) marker.clear()
        if (widget) widget.clear()
      }
    }
  }, [props.errorInfo])

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
