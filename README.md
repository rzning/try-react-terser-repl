# try-react-terser-repl

Terser REPL Demo

## 简介

🗜 [Terser] 是一款适用于 ES6+ 的 JavaScript 解析和压缩工具。

- <https://terser.org/>

此项目参照官方 [REPL] 项目，只是练手和学习之用。

- <https://try.terser.org/>
- <https://github.com/terser/repl>

## 使用

- 参考 [Create React App][cra] 官方基础模板 [cra-template] 初始化项目。
- 使用 [Prettier] 格式化代码。
- 使用 [Classnames] 组织样式类名。
- 使用 [CodeMirror] 代码编辑器。

[terser]: https://github.com/terser/terser
[repl]: https://github.com/terser/repl
[cra]: https://github.com/facebook/create-react-app
[cra-template]: https://github.com/facebook/create-react-app/tree/master/packages/cra-template
[prettier]: https://github.com/prettier/prettier
[classnames]: https://github.com/JedWatson/classnames
[codemirror]: https://github.com/codemirror/CodeMirror

## Terser API 示例

### 异步压缩方法 `async minify(code, options)`

Terser 没有提供对应同步方法， `minify()` 方法默认开启 `compress` 和 `mangle` 选项。

```js
import { minify } from 'terser'

var code = '...'
var result = await minify(code, { sourceMap: true })
console.log(result.code)
console.log(result.map)
```

通过传入对象格式，可压缩合并多个文件：

```js
import { minify } from 'terser'

var code = {
  'file1.js': '...',
  'file2.js': '...'
}
var result = await minify(code)
console.log(result.code)
```
