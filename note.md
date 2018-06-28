# 笔记

1、注意整个配置中我们使用 Node 内置的 [path 模块](https://nodejs.org/api/path.html)，并在它前面加上 [__dirname](https://nodejs.org/docs/latest/api/globals.html#globals_dirname)这个全局变量。可以防止不同操作系统之间的文件路径问题，并且可以使相对路径按照预期工作。

2、如果你使用 webpack 4+ 版本，你还需要安装 CLI。

3、对于大多数项目，我们建议本地安装。这可以使我们在引入破坏式变更(breaking change)的依赖时，更容易分别升级项目。通常，webpack 通过运行一个或多个 `npm scripts`，会在本地 `node_modules` 目录中查找安装的webpack。

4、不推荐全局安装 webpack。这会将你项目中的 webpack 锁定到指定版本，并且在使用不同的 webpack 版本的项目中，可能会导致构建失败。

5、webpack 配置中的 mode 设置为“production”，输出的打包文件是压缩的。mode 设置为“development”，输出的打包文件没压缩，方便阅读。



