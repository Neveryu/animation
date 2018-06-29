# animation

通常我们会遇到一些需求，用 javascript 实现一组动画（这里指的是由一帧帧图片组合而成的动画，非 jquery 的animate）。

其实原理很简单，如果是多张图，就定时去改变 image 的 src，如果是一张图，就定时改变 backgroud-position；同时，我们还要支持图片预加载，动画执行次数（一次，n次，无限次），动画暂停，动画执行完成的回调等等。

有了上述需求，我觉得写一个通用的 animation 库还是很有必要的，这样用户就每必要为每一组动画写逻辑了，从繁琐的劳动中解放，不正是每个 coder 所期望的么：）

## Usage

### 示例

#### HTML

```html
<div id="demo"></div>
```

#### CSS

```css
#demo {
    width: 100px;
    height: 100px;
    background: url('foo.png');
}
```

#### JavaScript

``` javascript
<script src="../build/animation.js"></script>

var animation = window.animation;

var ele = document.getElementById('demo');
var frameMap = ['0 0', '0 -100', '0 -200'];
    
var demoAnimation = animation().changePosition(ele, frameMap).repeat();
demoAnimation.start(200);

```

## animation提供的接口

* loadImage(imagelist)  //预加载图片
* changePosition(ele,positions)  //通过改变元素的backgroud-position实现动画
* changeSrc(ele,imglist) //通过改变image元素的src实现动画(一般这种方式需要和loadImage配合使用)
* then(callback) //动画执行完成后的回调函数
* enterFrame(callback) //每一帧动画执行的函数，相当于用户可以自定义每一帧动画的callback
* repeat(times) //动画重复执行的次数，times为空时表示无限次
* repeatForever() //无限重复上一次动画, 相当于repeat()，更友好的一个接口吧
* wait(time) //每个动画执行完后等待的时间
* start(interval) //动画开始执行，interval表示动画执行的间隔
* pause() //动画暂停
* restart() //动画从上一次暂停处重新执行
* dispose() //释放资源

## 如何构建
animation的源码是基于webpack构建的

首先，clone项目源码
```bash
git clone https://github.com/Neveryu/animation.git
```

安装依赖
```bash
cd animation
npm install
```
测试demo页

```bash
npm run build
```

## 项目笔记
This project's note is [note](note)


## License

This repository is licensed with the [Apache License](LICENSE) license.