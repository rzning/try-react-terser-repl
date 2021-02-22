import prettier from 'prettier'
import parserBabel from 'prettier/parser-babel'

export function format(source, type) {
  return prettier.format(source, {
    parser: type || 'babel',
    plugins: [parserBabel]
  })
}
