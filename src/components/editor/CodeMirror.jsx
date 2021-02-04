/**
 * @see https://github.com/terser/repl/blob/master/src/CodeMirror.js
 * @see https://github.com/uiwjs/react-codemirror/blob/master/src/index.js
 */

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react'
import CodeMirror from 'codemirror'

import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/mode/javascript/javascript'

/**
 * @template S
 * @typedef {(value: S | ((prevState: S) => S)) => void} SetStateValue
 */
/**
 * @template S
 * @typedef {[S | undefined, SetStateValue<S | undefined>]} UseState
 */
/**
 * @typedef {CodeMirror.EditorFromTextArea} Editor
 */

/**
 * 默认配置
 * @type {import('codemirror').EditorConfiguration}
 */
const defaultOptions = {
  showCursorWhenSelecting: false,
  scrollbarStyle: 'native',
  lineNumbers: true,
  autoCloseBrackets: true,
  mode: 'javascript'
}

export default forwardRef(function ReactCodeMirror(props, ref) {
  const {
    options = {},
    value = '',
    width = '100%',
    height = '100%',
    theme = 'default'
  } = props || {}

  const effectiveOptions = useMemo(() => {
    if (options && typeof options === 'object') {
      return { ...defaultOptions, ...options }
    }
    return defaultOptions
  }, [options])

  /**
   * @type {UseState<Editor>}
   */
  const [editor, setEditor] = useState()

  useImperativeHandle(ref, () => ({ editor }), [editor])

  const innerRef = useRef()

  // 初始化编辑器
  useEffect(() => {
    if (!editor) {
      const instance = CodeMirror.fromTextArea(
        innerRef.current,
        effectiveOptions
      )
      setEditor(instance)
    }
    return () => {
      if (editor) {
        /**
         * 删除编辑器
         * @see https://codemirror.net/doc/manual.html#toTextArea
         */
        editor.toTextArea()
        setEditor(void 0)
      }
    }
  }, [editor, effectiveOptions])

  // 更新值 value
  useEffect(() => {
    if (editor) {
      const oldValue = editor.getValue()
      if (typeof value === 'string' && value !== oldValue) {
        editor.setValue(value)
      }
    }
  }, [editor, value])

  // 更新尺寸 height width
  useEffect(() => {
    if (editor) {
      editor.setSize(width, height)
    }
  }, [editor, height, width])

  // 更新选项 updateOptions
  useEffect(() => {
    if (editor) {
      Reflect.ownKeys(effectiveOptions).forEach((optionName) => {
        const newValue = Reflect.get(effectiveOptions, optionName)
        if (newValue !== editor.getOption(optionName)) {
          editor.setOption(optionName, newValue)
        }
      })
    }
  }, [editor, effectiveOptions])

  // 更新主题 theme
  useEffect(() => {
    if (editor) {
      editor.setOption('theme', theme)
    }
  }, [editor, theme])

  return <textarea name={props.name} ref={innerRef}></textarea>
})
