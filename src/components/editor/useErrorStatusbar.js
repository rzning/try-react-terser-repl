import { useEffect } from 'react'
import { Pos } from 'codemirror'
import styles from './CodeMirrorPanel.module.css'

import 'codemirror/addon/display/panel'

/**
 * 设置自定义错误状态栏
 * @param {import('codemirror').Editor} editor
 * @param {{
 *   line: number
 *   col: number
 *   pos: number
 *   name: string
 *   message: string
 * }} errorInfo
 */
export function useErrorStatusbar(editor, errorInfo) {
  useEffect(() => {
    if (editor && errorInfo) {
      const { line, col, name, message } = errorInfo
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
      editor.operation(() => {
        // textMarker
        const l = line - 1
        const c = col < 1 ? 0 : col - 1
        marker = editor.markText(Pos(l, c), Pos(l, c + 1), {
          className: styles.errorMarker
        })
        // lineWidget
        const node = document.createElement('div')
        node.className = styles.errorLine
        const labelNode = document.createElement('span')
        labelNode.className = styles.errorLineLabel
        const label = `(${line},${col}) ${name}`
        labelNode.appendChild(document.createTextNode(label))
        node.appendChild(labelNode)
        node.appendChild(document.createTextNode(message))
        widget = editor.addLineWidget(line - 1, node)
      })
      return () => {
        if (marker) marker.clear()
        if (widget) widget.clear()
      }
    }
  }, [editor, errorInfo])
}

/**
 * 使用简单错误状态提示栏
 * @param {import('codemirror').Editor} editor
 * @param {string} errorMessage
 */
export function useSimpleErrorStatusbar(editor, errorMessage) {
  useEffect(() => {
    if (editor && errorMessage) {
      /** @type {import('codemirror').Panel} */
      var panel = null
      editor.operation(() => {
        const node = document.createElement('div')
        node.className = styles.simpleErrorLine
        node.appendChild(document.createTextNode(errorMessage))
        panel = editor.addPanel(node, { position: 'bottom' })
      })
      editor.setSize(null, '100%')
      return () => {
        if (panel) panel.clear()
      }
    }
  }, [editor, errorMessage])
}
