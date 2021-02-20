import { minify } from 'terser'

export async function doMinify(value, options) {
  try {
    const result = await minify(value, options)
    return {
      error: null,
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
      },
      code: ''
    }
  }
}
