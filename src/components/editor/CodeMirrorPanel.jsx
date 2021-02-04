import cx from 'classnames'
import { useMemo } from 'react'
import CodeMirror from './CodeMirror'
import styles from './CodeMirrorPanel.module.css'

export default function CodeMirrorPanel(props) {
  const options = useMemo(() => {
    return {
      ...props.options,
      readOnly: !props.onChange
    }
  }, [props.onChange, props.options])

  return (
    <div className={cx(styles.container, props.className)}>
      <div className={styles.header}>
        <div className={styles.title}>{props.title}</div>
      </div>
      <div className={styles.codeMirror}>
        <CodeMirror
          theme={props.theme}
          options={options}
          value={props.code}
          onChange={props.onChange}
        />
      </div>
    </div>
  )
}
