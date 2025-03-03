# 如何将Favicon添加到您的网站

## 文件准备

我已经为您创建了一个SVG格式的favicon。您需要将其转换为以下格式：

1. **favicon.ico** - 16x16, 32x32和48x48像素（多尺寸ICO文件）
2. **favicon.png** - 32x32像素
3. **apple-touch-icon.png** - 180x180像素

## 转换步骤

您可以使用以下工具将SVG转换为所需格式：

1. 访问 [RealFaviconGenerator](https://realfavicongenerator.net/)
2. 上传提供的`favicon.svg`文件
3. 根据网站提示自定义设置
4. 下载生成的favicon包
5. 将文件解压到您网站的根目录

## 添加到您的网站

### 1. 将文件上传到网站

将以下文件上传到您网站的根目录：
- favicon.ico
- favicon.png
- apple-touch-icon.png

### 2. 更新HTML文件

在每个HTML页面的`<head>`部分添加以下代码：

```html
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/favicon.png" type="image/png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
```

例如，您的HTML头部应该类似于：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Insurance Cancellation Calculator</title>
    
    <!-- Favicon -->
    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="icon" href="/favicon.png" type="image/png">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    
    <!-- 其他CSS和meta标签 -->
    <link rel="stylesheet" href="../../common/styles.css">
    <!-- ... -->
</head>
```

### 3. 验证

添加favicon后：
1. 清除浏览器缓存
2. 访问您的网站
3. 确认浏览器标签页显示您的favicon

## 等待谷歌更新

添加favicon后，谷歌需要时间来抓取和更新搜索结果：
- 通常需要几天到几周
- 您可以在Google Search Console中请求重新抓取您的主页，可能会加速这一过程

## 自定义

如果您想修改favicon的颜色或设计：
1. 编辑`favicon.svg`文件
2. 更改颜色代码（如`#e74c3c`和`#3498db`）
3. 重复上述转换步骤 