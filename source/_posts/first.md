---
title: 利用GitHub Actions & Hexo快速开启博客之旅
date: 2026-06-25 22:31:34
---

先用 Hexo 在本地生成博客，再把代码推送到 GitHub 仓库，最后通过 GitHub Actions 自动构建并发布到 GitHub Pages。

## 1. 安装基础环境

先安装 Git 和 Node.js。Git 用来管理代码，Node.js 用来运行 Hexo。

``` bash
sudo apt update
sudo apt install git-core -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

安装完成后检查版本：

``` bash
node -v
npm -v
git --version
```

只要能正常输出版本号，说明环境已经准备好。

---

## 2. 安装 Hexo

接着安装 Hexo 命令行工具：

``` bash
sudo npm install -g hexo-cli
```

检查 Hexo 是否安装成功：

``` bash
hexo -v
```

---

## 3. 创建博客项目

新建一个博客项目，并安装项目依赖：

``` bash
hexo init my-blog
cd my-blog
npm install
```

这里的 `my-blog` 是博客项目目录名，可以按自己的习惯修改。

---

## 4. 本地预览博客

在博客项目目录中启动本地预览：

``` bash
hexo server
```

默认访问地址是：

``` text
http://localhost:4000
```

如果默认端口不对，或者 `4000` 端口已经被占用，可以指定端口启动：

``` bash
hexo server -p 1234
```

这时访问：

``` text
http://localhost:1234
```

页面能正常打开，就说明本地博客已经运行成功。

---

## 5. 创建远程仓库

在 GitHub 上创建一个仓库。仓库名建议使用下面这种格式：

``` text
你的GitHub用户名.github.io
```

这个仓库会作为 GitHub Pages 的发布仓库。

---

## 6. 推送博客代码

在本地博客项目目录中初始化 Git，并推送到远程仓库：

``` bash
git init
git add .
git commit -m "first commit"
git remote add origin 仓库的远程地址
git branch -M main
git push -u origin main
```

其中 `仓库的远程地址` 替换成自己仓库的地址。

---

## 7. 开启 GitHub Pages

进入 GitHub 仓库页面，依次打开：

``` text
Settings -> Pages
```

在 `Source` 选项中选择：

``` text
GitHub Actions
```

这样后续就可以通过工作流自动构建和部署博客。

---

## 8. 创建工作流文件

在本地博客项目中创建工作流目录：

``` bash
mkdir -p .github/workflows
```

然后创建文件：

``` text
.github/workflows/pages.yml
```

写入下面的工作流配置：

``` yaml
name: Pages

on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          submodules: recursive
      - name: Use Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: "20"
      - name: Cache NPM dependencies
        uses: actions/cache@v4
        with:
          path: node_modules
          key: ${{ runner.OS }}-npm-cache
          restore-keys: |
            ${{ runner.OS }}-npm-cache
      - name: Install Dependencies
        run: npm install
      - name: Build
        run: npm run build
      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./public

  deploy:
    needs: build
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

这个文件的作用是：每次推送到 `main` 分支时，GitHub Actions 会自动安装依赖、构建博客，并把 `public` 目录发布到 GitHub Pages。

---

## 9. 推送工作流配置

保存工作流文件后，把修改推送到远程仓库：

``` bash
git add .
git commit -m "add GitHub Actions workflow"
git push
```

推送完成后，进入 GitHub 仓库的 `Actions` 页面，可以看到工作流正在运行。

---

## 10. 访问博客

工作流运行成功后，就可以访问自己的博客：

``` text
https://你的GitHub用户名.github.io
```

如果页面还没有立刻出现，可以等一会儿再刷新。第一次部署通常需要一点时间。

---

## 11. 总结

整个流程可以概括为：

1. 安装 Git、Node.js 和 Hexo。
2. 创建并预览本地博客。
3. 创建 GitHub Pages 仓库。
4. 推送博客代码。
5. 使用 GitHub Actions 自动构建并部署。

以后更新博客时，只需要修改文章、提交代码并推送，GitHub Actions 会自动完成后续部署。
