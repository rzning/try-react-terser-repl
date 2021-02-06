/**
 * 获取代码字节大小
 * @param {string} value
 */
export function getCodeSizeInBytes(value) {
  const data = new Blob([value], { type: 'text/plain' })
  return data.size
}
