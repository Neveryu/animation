(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["animation"] = factory();
	else
		root["animation"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/animation.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/animation.js":
/*!**************************!*\
  !*** ./src/animation.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\n\r\nvar Timeline = __webpack_require__(/*! ./timeline */ \"./src/timeline.js\");\r\nvar loadImage = __webpack_require__(/*! ./imageloader */ \"./src/imageloader.js\");\r\n\r\n// 初始化状态\r\nvar STATE_INITIAL = 0\r\n// 开始状态\r\nvar STATE_START = 1;\r\n// 停止状态\r\nvar STATE_STOP = 2;\r\n\r\n// 同步任务\r\nvar TASK_SYNC = 0;\r\n// 异步任务\r\nvar TASK_ASYNC = 1;\r\n\r\n/**\r\n * 简单的函数封装，执行callback\r\n * @param  {Function} callback 执行函数\r\n * @return {Function}          [description]\r\n */\r\nfunction next(callback) {\r\n  callback && callback();\r\n};\r\n\r\n/**\r\n * 定义一个类，我们知道js的类都是通过function来实现的\r\n * 帧动画库类\r\n * @constructor\r\n */\r\n\r\nfunction Animation() {\r\n  this.taskQueue = [];\r\n  this.index = 0;\r\n  this.timeline = new Timeline();\r\n  this.state = STATE_INITIAL;\r\n};\r\n\r\n/**\r\n * 添加一个同步任务，去预加载图片\r\n * @param imglist 图片数组\r\n */\r\nAnimation.prototype.loadImage = function(imglist) {\r\n  var taskFn = function(next) {\r\n    // 我们可以看到loadImage方法会修改传入的imglist，将其子元素构造成item元素\r\n    // 所以我们这里用一个slice()来做一个深拷贝，避免对我们源imglist发生修改\r\n    loadImage(imglist.slice(), next);\r\n  };\r\n  // 将这个任务类型设置为同步任务\r\n  var type = TASK_SYNC;\r\n\r\n  // 将任务添加到任务链\r\n  return this._add(taskFn, type);\r\n};\r\n\r\n\r\n/**\r\n * 添加一个异步定时任务，通过定时改变图片背景位置实现帧动画\r\n * @param  {[type]} ele       dom对象\r\n * @param  {[type]} positions 背景位置的数组\r\n * @param  {[type]} imageUrl  图片地址\r\n * @return {[type]}           [description]\r\n */\r\nAnimation.prototype.changePosition = function(ele, positions, imageUrl) {\r\n  var len = positions.length;\r\n  var taskFn;\r\n  var type;\r\n  if(len) {\r\n    var _this = this;\r\n    taskFn = function(next, time) {\r\n      if(imageUrl) {\r\n        ele.style.backgroundImage = 'url(' + imageUrl + ')';\r\n      }\r\n      // 获得当前背景图片位置索引\r\n      var index = Math.min(time / _this.interval | 0, len);\r\n      var position = positions[index - 1].split(' ');\r\n      // 改变dom对象的背景图片位置\r\n      ele.style.backgroundPosition = position[0] + 'px ' + position[1] + 'px';\r\n      if(index === len) {\r\n        next();\r\n      }\r\n    };\r\n    type = TASK_ASYNC;\r\n  } else {\r\n    taskFn = next;\r\n    type = TASK_SYNC;\r\n  }\r\n  return this._add(taskFn, type);\r\n};\r\n\r\n/**\r\n * 添加一个异步定时任务，通过定时改变image标签的src属性，实现帧动画\r\n * @param  {[type]} ele     dom对象\r\n * @param  {[type]} imglist 图片数组\r\n * @return {[type]}         [description]\r\n */\r\nAnimation.prototype.changeSrc = function(ele, imglist) {\r\n  var len = imglist.length;\r\n  var taskFn;\r\n  var type;\r\n  if(len) {\r\n    var _this = this;\r\n    taskFn = function(next, time) {\r\n      // 获得当前图片索引\r\n      var index = Math.min(time / _this.interval | 0, len)\r\n      // 改变image对象的图片地址\r\n      ele.src = imglist[index - 1];\r\n      if(index === len) {\r\n        next();\r\n      }\r\n    };\r\n    type = TASK_ASYNC;\r\n  } else {\r\n    taskFn = next;\r\n    type = TASK_SYNC;\r\n  }\r\n  return this._add(taskFn, type);\r\n};\r\n\r\n/**\r\n * 高级用法，添加一个异步定时执行的任务\r\n * 该任务自定义动画没帧执行的任务函数\r\n * @param  {[type]} taskFn 自定义每帧执行的任务函数\r\n * @return {[type]}        [description]\r\n */\r\nAnimation.prototype.enterFrame = function(taskFn) {\r\n  return this._add(taskFn,TASK_ASYNC)\r\n};\r\n\r\n/**\r\n * 添加一个同步任务，可以在上一个任务完成后执行回调函数\r\n * @param  {Function} callback 回调函数\r\n * @return {[type]}            [description]\r\n */\r\nAnimation.prototype.then = function(callback) {\r\n  var taskFn = function(next) {\r\n    callback(this);\r\n    next();\r\n  }\r\n  var type = TASK_SYNC;\r\n  return this._add(taskFn, type);\r\n};\r\n\r\n/**\r\n * 开始执行任务\r\n * @param  {[type]} interval 异步定时任务执行的间隔\r\n * @return {[type]}          返回this，链式调用\r\n */\r\nAnimation.prototype.start = function(interval) {\r\n  if(this.state === STATE_START) {\r\n    return this;\r\n  }\r\n  // 如果任务链中没有任务，则返回\r\n  if(!this.taskQueue.length) {\r\n    return this;\r\n  }\r\n  this.state = STATE_START;\r\n  this.interval = interval;\r\n  this._runTask();\r\n  return this;\r\n};\r\n\r\n/**\r\n * 添加一个同步任务，该任务就是回退到上一个任务中\r\n * 实现重复上一个任务的效果，可定义重复的次数\r\n * @param  {[type]} times 重复次数\r\n * @return {[type]}       [description]\r\n */\r\nAnimation.prototype.repeat = function(times) {\r\n  var _this = this;\r\n  var taskFn = function() {\r\n    if(typeof times === 'undefined') {\r\n      // 无限回退到上一个任务\r\n      _this.index--;\r\n      _this._runTask();\r\n      return;\r\n    }\r\n    if(times) {\r\n      times--;\r\n      // 回退\r\n      _this.index--;\r\n      _this._runTask();\r\n    }else{\r\n      // 达到重复次数，跳转到下一个任务\r\n      var task = _this.taskQueue[_this.index];\r\n      _this._next(task);\r\n    }\r\n  }\r\n  var type = TASK_SYNC;\r\n  return this._add(taskFn, type);\r\n};\r\n\r\n/**\r\n * 添加一个同步任务，相当于repeat()更友好的接口，该任务就是无限循环上一次任务\r\n * @return {[type]} [description]\r\n */\r\nAnimation.prototype.repeatForever = function() {\r\n  return this.repeat();\r\n};\r\n\r\n\r\n/**\r\n * 设置当前任务结束后到下一个任务开始前的等待时间\r\n * @param  {[type]} time 等待的时长\r\n * @return {[type]}      [description]\r\n */\r\nAnimation.prototype.wait = function(time) {\r\n  if(this.taskQueue && this.taskQueue.length > 0) {\r\n    this.taskQueue[this.taskQueue.length -1].wait = time;\r\n  }\r\n  return this;\r\n};\r\n\r\n/**\r\n * 暂停当前执行的异步定时任务\r\n * @return {[type]} [description]\r\n */\r\nAnimation.prototype.pause = function() {\r\n  if(this.state === STATE_START) {\r\n    this.state = STATE_STOP\r\n    this.timeline.stop();\r\n    return this;\r\n  }\r\n  return this;\r\n};\r\n\r\n\r\n/**\r\n * 重新开始执行当前异步定时任务\r\n * @return {[type]} [description]\r\n */\r\nAnimation.prototype.restart = function() {\r\n  if(this.state === STATE_STOP) {\r\n    this.state = STATE_START;\r\n    this.timeline.restart();\r\n    return this;\r\n  }\r\n  return this;\r\n};\r\n\r\n/**\r\n * 释放资源\r\n * @return {[type]} [description]\r\n */\r\nAnimation.prototype.dispose = function() {\r\n  if(this.state !== STATE_INITIAL) {\r\n    this.state = STATE_INITIAL;\r\n    this.taskQueue = null;\r\n    this.timeline.stop();\r\n    this.timeline = null;\r\n    return this;\r\n  }\r\n  return this;\r\n};\r\n\r\n/**\r\n * 添加一个任务到任务队列中\r\n * @param {[type]} taskFn 任务方法\r\n * @param {[type]} type   任务类型\r\n * @return { Animation } 返回this，链式调用\r\n */\r\n// 私有方法，虽然js没有这个概念，但是我们约定_开头的方式是内部私有方法\r\n// 仅供内部调用\r\nAnimation.prototype._add = function(taskFn, type) {\r\n  this.taskQueue.push({\r\n    taskFn: taskFn,\r\n    type: type\r\n  });\r\n  return this;\r\n};\r\n\r\n/**\r\n * 执行任务\r\n * @return {[type]} [description]\r\n */\r\nAnimation.prototype._runTask = function() {\r\n  if(!this.taskQueue || this.state !== STATE_START) {\r\n    return;\r\n  }\r\n  // 任务执行完毕\r\n  if(this.index === this.taskQueue.length) {\r\n    this.dispose();\r\n    return;\r\n  }\r\n  // 获得任务链上的当前任务\r\n  var task = this.taskQueue[this.index]\r\n  if(task.type === TASK_SYNC) {\r\n    this._syncTask(task);\r\n  } else {\r\n    this._asyncTask(task);\r\n  }\r\n};\r\n\r\n/**\r\n * 同步任务\r\n * @param  {[type]} task 执行任务的函数\r\n * @return {[type]}      [description]\r\n */\r\nAnimation.prototype._syncTask = function(task) {\r\n  var _this = this;\r\n  // taskFn执行完毕以后，调用next方法切换到下一个任务\r\n  var next = function() {\r\n    // 切换到下一个任务\r\n    _this._next(task);\r\n  };\r\n  var taskFn = task.taskFn;\r\n  taskFn(next);\r\n};\r\n\r\n/**\r\n * 异步任务和同步任务的区别：\r\n * 同步任务就是这个函数是一个同步的执行\r\n * 执行完以后就可以调用下一个方法\r\n * 异步任务其实是一种定时的\r\n */\r\n\r\n/**\r\n * 异步任务\r\n * @param  {[type]} task 执行异步的函数\r\n * @return {[type]}      [description]\r\n */\r\nAnimation.prototype._asyncTask = function(task) {\r\n  var _this = this;\r\n  // 定义每一帧执行的回调函数\r\n  var enterFrame = function(time) {\r\n    var taskFn = task.taskFn;\r\n    var next = function() {\r\n      // 停止当前任务\r\n      _this.timeline.stop();\r\n      // 执行下一个任务\r\n      _this._next(task);\r\n    };\r\n    taskFn(next, time);\r\n  };\r\n  this.timeline.onenterframe = enterFrame;\r\n  this.timeline.start(this.interval);\r\n};\r\n\r\n/**\r\n * 切换到下一个任务，支持如果当前任务需要等待，则延时执行\r\n * @param  {[type]} task 下一个任务\r\n * @return {[type]}      [description]\r\n */\r\nAnimation.prototype._next = function(task) {\r\n  this.index++;\r\n  var _this = this;\r\n  task.wait ? setTimeout(function() {\r\n    _this._runTask();\r\n  }, task.wait) : this._runTask();\r\n};\r\n\r\nmodule.exports = function() {\r\n  return new Animation();\r\n}\n\n//# sourceURL=webpack://animation/./src/animation.js?");

/***/ }),

/***/ "./src/imageloader.js":
/*!****************************!*\
  !*** ./src/imageloader.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\n\r\nvar __id = 0;\r\n\r\n/**\r\n * 动态创建id\r\n * @return {[type]} [description]\r\n */\r\nfunction getId() {\r\n  return ++__id;\r\n}\r\n\r\n\r\n/**\r\n * 预加载图片函数\r\n * @param  {[type]}   images   加载图片的数组或者对象\r\n * @param  {Function} callback 全部图片加载完毕后调用的回调函数\r\n * @param  {[type]}   timeout  加载超时的时长\r\n * @return {[type]}            [description]\r\n */\r\nfunction loadImage(images, callback, timeout) {\r\n  // 加载完成图片的计数器\r\n  var count = 0;\r\n  // 全部图片加载成功的一个标志位（默认认为可以全部加载）\r\n  var success = true;\r\n  // 超时timer的id\r\n  var timeoutId = 0;\r\n  // 是否加载超时的标志位\r\n  var isTimeout = false;\r\n\r\n  // 对图片数组（或对象）进行遍历\r\n  for(var key in images) {\r\n    // 过滤prototype上的属性【hasOwnPrototype无法检查该对象的原型链中是否具有该属性】\r\n    if(!images.hasOwnProperty(key)) {\r\n      continue;\r\n    }\r\n    // 获得每个图片元素\r\n    // 期望格式是个object: {src: xxx}\r\n    var item = images[key];\r\n    if(typeof item === 'string') {\r\n      item = images[key] = {\r\n        src: item\r\n      };\r\n    }\r\n    // 如果格式不满足期望，则丢弃此条数据进行下一次遍历\r\n    if(!item || !item.src) {\r\n      continue;\r\n    }\r\n\r\n    // 计数+1\r\n    count++;\r\n    // 设置图片元素的id\r\n    item.id = '__img__' + key + getId();\r\n\r\n    // 设置图片元素的img，它是一个Image对象\r\n    item.img = window[item.id] = new Image();\r\n\r\n\r\n    // 这个for循环前面的操作，就是将images里面的每一个元素构造成一个item对象\r\n    doLoad(item);\r\n  }\r\n  // 遍历完成，如果计数为0，则直接调用callback\r\n  if (!count) {\r\n    callback(success);\r\n  } else if(timeout) {\r\n    timeoutId = setTimeout(onTimeout, timeout);\r\n  }\r\n\r\n\r\n\r\n  /**\r\n   * 真正进行图片加载的函数\r\n   * @param  {[type]} item 图片元素对象\r\n   * @return {[type]}      [description]\r\n   */\r\n  function doLoad(item) {\r\n    item.status = 'loading';\r\n    var img = item.img;\r\n    // 定义图片加载成功的回调函数\r\n    img.onload = function() {\r\n      // 如果有任何一个img出现了error，那么success就是false\r\n      // 如果success是false的话，那么整个结果就是false了\r\n      success = success & true;\r\n      item.status = 'loaded';\r\n      done();\r\n    };\r\n    // 定义图片加载失败的回调函数\r\n    img.onerror = function() {\r\n      success = false;\r\n      item.status = 'error';\r\n      done();\r\n    };\r\n\r\n    // 发起一个http(s)的请求，去加载图片\r\n    img.src = item.src;\r\n    /**\r\n     * 每张图片加载完成的回调函数\r\n     * @return {Function} [description]\r\n     */\r\n    function done() {\r\n      // 清理事件，解除事件绑定\r\n      img.onload = img.onerror = null;\r\n      try {\r\n        // 用来删除一个对象的属性\r\n        delete window[item.id];\r\n      } catch (e) {\r\n\r\n      }\r\n\r\n      // 每张图片加载完成，计数器减1，当所有图片加载完成且没有超时的情况\r\n      // 清楚超时计时器，且执行回调函数\r\n      if(!--count && !isTimeout) {\r\n        clearTimeout(timeoutId);\r\n        callback(success);\r\n      }\r\n    }\r\n  }\r\n\r\n  /**\r\n   * 超时函数\r\n   * @return {[type]} [description]\r\n   */\r\n  function onTimeout() {\r\n    isTimeout = true;\r\n    callback(false);\r\n  }\r\n}\r\n\r\nmodule.exports = loadImage;\n\n//# sourceURL=webpack://animation/./src/imageloader.js?");

/***/ }),

/***/ "./src/timeline.js":
/*!*************************!*\
  !*** ./src/timeline.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\n\r\nvar DEFAULT_INTERVAL = 1000 / 60;\r\n\r\n// 初始化状态\r\nvar STATE_INITIAL = 0;\r\n// 开始状态\r\nvar STATE_START = 1;\r\n// 停止状态\r\nvar STATE_STOP = 2;\r\n\r\n// 解决兼容性问题 raf(requestAnimationFrame)\r\nvar requestAnimationFrame = (function(){\r\n  return window.requestAnimationFrame ||\r\n          window.webkitRequestAnimationFrame ||\r\n          window.mozRequestAnimationFrame ||\r\n          window.oRequestAnimationFrame ||\r\n          function (callback) {\r\n            return window.setTimeout(callback, callback.interval || DEFAULT_INTERVAL);\r\n          };\r\n})();\r\n\r\nvar cancelAnimationFrame = (function() {\r\n  return window.cancelAnimationFrame ||\r\n          window.webkitCancelAnimationFrame ||\r\n          window.mozCancelAnimationFrame ||\r\n          window.oCancelAnimationFrame ||\r\n          function(id) {\r\n            window.clearTimeout(id);\r\n          };\r\n})();\r\n\r\n/**\r\n * Timeline 时间轴类\r\n */\r\nfunction Timeline() {\r\n  this.animationHandler = 0;\r\n  this.state = STATE_INITIAL;\r\n};\r\n\r\n/**\r\n * 时间轴上每一次回调执行的函数\r\n * @param {[type]} time 从动画开始到当前执行的时间\r\n * @return {[type]} [description]\r\n */\r\nTimeline.prototype.onenterframe = function(time) {};\r\n\r\n/**\r\n * 动画开始\r\n * @param  {[type]} interval 每一次回调的间隔时间\r\n * requestAnimationFrame每隔十几毫秒做一次回调\r\n * 所以我们这里设置一个interval，用来改变每一次回调的间隔时间\r\n * @return {[type]}          [description]\r\n */\r\nTimeline.prototype.start = function(interval) {\r\n  if(this.state === STATE_START) {\r\n    return;\r\n  }\r\n  this.state = STATE_START;\r\n  this.interval = interval || DEFAULT_INTERVAL;\r\n  startTimeline(this, +new Date());\r\n}\r\n\r\n/**\r\n * 动画停止\r\n * @return {[type]} [description]\r\n */\r\nTimeline.prototype.stop = function() {\r\n  if(this.state !== STATE_START) {\r\n    return;\r\n  }\r\n  this.state = STATE_STOP;\r\n\r\n  // 如果动画开始过，则记录动画从开始到现在所经历的时间\r\n  if(this.startTime) {\r\n    this.dur = +new Date() - this.startTime;\r\n  }\r\n  cancelAnimationFrame(this.animationHandler);\r\n};\r\n\r\n/**\r\n * 重新开始动画\r\n * @return {[type]} [description]\r\n */\r\nTimeline.prototype.restart = function() {\r\n  if(this.state === STATE_START) {\r\n    return;\r\n  }\r\n  if(!this.dur || !this.interval) {\r\n    return;\r\n  }\r\n  this.state = STATE_START;\r\n\r\n  // 无缝连接动画\r\n  startTimeline(this, +new Date() - this.dur)\r\n};\r\n\r\n/**\r\n * 时间轴动画启动函数\r\n * @param  {[type]} timeline  时间轴的实例\r\n * @param  {[type]} startTime 动画开始时间戳\r\n * @return {[type]}           [description]\r\n */\r\nfunction startTimeline(timeline, startTime) {\r\n  // 记录上一次回调的时间戳\r\n  var lastTick = +new Date();\r\n\r\n  timeline.startTime = startTime;\r\n  nextTick.interval = timeline.interval;\r\n\r\n  nextTick();\r\n\r\n  /**\r\n   * 每一帧执行的函数\r\n   * @return {[type]} [description]\r\n   */\r\n  function nextTick() {\r\n    var now = +new Date();\r\n\r\n    timeline.animationHandler = requestAnimationFrame(nextTick);\r\n\r\n    // 如果当前时间与上一次回调的时间戳大于设置的时间间隔\r\n    // 表示这一次可以执行回调函数\r\n    if((now - lastTick) >= timeline.interval) {\r\n      timeline.onenterframe(now - startTime);\r\n      lastTick = now;\r\n    }\r\n  }\r\n}\r\n\r\nmodule.exports = Timeline;\n\n//# sourceURL=webpack://animation/./src/timeline.js?");

/***/ })

/******/ });
});