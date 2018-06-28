'use strict';

var Timeline = require('./timeline');
var loadImage = require('./imageloader');

// 初始化状态
var STATE_INITIAL = 0
// 开始状态
var STATE_START = 1;
// 停止状态
var STATE_STOP = 2;

// 同步任务
var TASK_SYNC = 0;
// 异步任务
var TASK_ASYNC = 1;

/**
 * 简单的函数封装，执行callback
 * @param  {Function} callback 执行函数
 * @return {Function}          [description]
 */
function next(callback) {
  callback && callback();
};

/**
 * 定义一个类，我们知道js的类都是通过function来实现的
 * 帧动画库类
 * @constructor
 */

function Animation() {
  this.taskQueue = [];
  this.index = 0;
  this.timeline = new Timeline();
  this.state = STATE_INITIAL;
};

/**
 * 添加一个同步任务，去预加载图片
 * @param imglist 图片数组
 */
Animation.prototype.loadImage = function(imglist) {
  var taskFn = function(next) {
    // 我们可以看到loadImage方法会修改传入的imglist，将其子元素构造成item元素
    // 所以我们这里用一个slice()来做一个深拷贝，避免对我们源imglist发生修改
    loadImage(imglist.slice(), next);
  };
  // 将这个任务类型设置为同步任务
  var type = TASK_SYNC;

  // 将任务添加到任务链
  return this._add(taskFn, type);
};


/**
 * 添加一个异步定时任务，通过定时改变图片背景位置实现帧动画
 * @param  {[type]} ele       dom对象
 * @param  {[type]} positions 背景位置的数组
 * @param  {[type]} imageUrl  图片地址
 * @return {[type]}           [description]
 */
Animation.prototype.changePosition = function(ele, positions, imageUrl) {
  var len = positions.length;
  var taskFn;
  var type;
  if(len) {
    var _this = this;
    taskFn = function(next, time) {
      if(imageUrl) {
        ele.style.backgroundImage = 'url(' + imageUrl + ')';
      }
      // 获得当前背景图片位置索引
      var index = Math.min(time / _this.interval | 0, len);
      var position = positions[index - 1].split(' ');
      // 改变dom对象的背景图片位置
      ele.style.backgroundPosition = position[0] + 'px ' + position[1] + 'px';
      if(index === len) {
        next();
      }
    };
    type = TASK_ASYNC;
  } else {
    taskFn = next;
    type = TASK_SYNC;
  }
  return this._add(taskFn, type);
};

/**
 * 添加一个异步定时任务，通过定时改变image标签的src属性，实现帧动画
 * @param  {[type]} ele     dom对象
 * @param  {[type]} imglist 图片数组
 * @return {[type]}         [description]
 */
Animation.prototype.changeSrc = function(ele, imglist) {
  var len = imglist.length;
  var taskFn;
  var type;
  if(len) {
    var _this = this;
    taskFn = function(next, time) {
      // 获得当前图片索引
      var index = Math.min(time / _this.interval | 0, len)
      // 改变image对象的图片地址
      ele.src = imglist[index - 1];
      if(index === len) {
        next();
      }
    };
    type = TASK_ASYNC;
  } else {
    taskFn = next;
    type = TASK_SYNC;
  }
  return this._add(taskFn, type);
};

/**
 * 高级用法，添加一个异步定时执行的任务
 * 该任务自定义动画没帧执行的任务函数
 * @param  {[type]} taskFn 自定义每帧执行的任务函数
 * @return {[type]}        [description]
 */
Animation.prototype.enterFrame = function(taskFn) {
  return this._add(taskFn,TASK_ASYNC)
};

/**
 * 添加一个同步任务，可以在上一个任务完成后执行回调函数
 * @param  {Function} callback 回调函数
 * @return {[type]}            [description]
 */
Animation.prototype.then = function(callback) {
  var taskFn = function(next) {
    callback(this);
    next();
  }
  var type = TASK_SYNC;
  return this._add(taskFn, type);
};

/**
 * 开始执行任务
 * @param  {[type]} interval 异步定时任务执行的间隔
 * @return {[type]}          返回this，链式调用
 */
Animation.prototype.start = function(interval) {
  if(this.state === STATE_START) {
    return this;
  }
  // 如果任务链中没有任务，则返回
  if(!this.taskQueue.length) {
    return this;
  }
  this.state = STATE_START;
  this.interval = interval;
  this._runTask();
  return this;
};

/**
 * 添加一个同步任务，该任务就是回退到上一个任务中
 * 实现重复上一个任务的效果，可定义重复的次数
 * @param  {[type]} times 重复次数
 * @return {[type]}       [description]
 */
Animation.prototype.repeat = function(times) {
  var _this = this;
  var taskFn = function() {
    if(typeof times === 'undefined') {
      // 无限回退到上一个任务
      _this.index--;
      _this._runTask();
      return;
    }
    if(times) {
      times--;
      // 回退
      _this.index--;
      _this._runTask();
    }else{
      // 达到重复次数，跳转到下一个任务
      var task = _this.taskQueue[_this.index];
      _this._next(task);
    }
  }
  var type = TASK_SYNC;
  return this._add(taskFn, type);
};

/**
 * 添加一个同步任务，相当于repeat()更友好的接口，该任务就是无限循环上一次任务
 * @return {[type]} [description]
 */
Animation.prototype.repeatForever = function() {
  return this.repeat();
};


/**
 * 设置当前任务结束后到下一个任务开始前的等待时间
 * @param  {[type]} time 等待的时长
 * @return {[type]}      [description]
 */
Animation.prototype.wait = function(time) {
  if(this.taskQueue && this.taskQueue.length > 0) {
    this.taskQueue[this.taskQueue.length -1].wait = time;
  }
  return this;
};

/**
 * 暂停当前执行的异步定时任务
 * @return {[type]} [description]
 */
Animation.prototype.pause = function() {
  if(this.state === STATE_START) {
    this.state = STATE_STOP
    this.timeline.stop();
    return this;
  }
  return this;
};


/**
 * 重新开始执行当前异步定时任务
 * @return {[type]} [description]
 */
Animation.prototype.restart = function() {
  if(this.state === STATE_STOP) {
    this.state = STATE_START;
    this.timeline.restart();
    return this;
  }
  return this;
};

/**
 * 释放资源
 * @return {[type]} [description]
 */
Animation.prototype.dispose = function() {
  if(this.state !== STATE_INITIAL) {
    this.state = STATE_INITIAL;
    this.taskQueue = null;
    this.timeline.stop();
    this.timeline = null;
    return this;
  }
  return this;
};

/**
 * 添加一个任务到任务队列中
 * @param {[type]} taskFn 任务方法
 * @param {[type]} type   任务类型
 * @return { Animation } 返回this，链式调用
 */
// 私有方法，虽然js没有这个概念，但是我们约定_开头的方式是内部私有方法
// 仅供内部调用
Animation.prototype._add = function(taskFn, type) {
  this.taskQueue.push({
    taskFn: taskFn,
    type: type
  });
  return this;
};

/**
 * 执行任务
 * @return {[type]} [description]
 */
Animation.prototype._runTask = function() {
  if(!this.taskQueue || this.state !== STATE_START) {
    return;
  }
  // 任务执行完毕
  if(this.index === this.taskQueue.length) {
    this.dispose();
    return;
  }
  // 获得任务链上的当前任务
  var task = this.taskQueue[this.index]
  if(task.type === TASK_SYNC) {
    this._syncTask(task);
  } else {
    this._asyncTask(task);
  }
};

/**
 * 同步任务
 * @param  {[type]} task 执行任务的函数
 * @return {[type]}      [description]
 */
Animation.prototype._syncTask = function(task) {
  var _this = this;
  // taskFn执行完毕以后，调用next方法切换到下一个任务
  var next = function() {
    // 切换到下一个任务
    _this._next(task);
  };
  var taskFn = task.taskFn;
  taskFn(next);
};

/**
 * 异步任务和同步任务的区别：
 * 同步任务就是这个函数是一个同步的执行
 * 执行完以后就可以调用下一个方法
 * 异步任务其实是一种定时的
 */

/**
 * 异步任务
 * @param  {[type]} task 执行异步的函数
 * @return {[type]}      [description]
 */
Animation.prototype._asyncTask = function(task) {
  var _this = this;
  // 定义每一帧执行的回调函数
  var enterFrame = function(time) {
    var taskFn = task.taskFn;
    var next = function() {
      // 停止当前任务
      _this.timeline.stop();
      // 执行下一个任务
      _this._next(task);
    };
    taskFn(next, time);
  };
  this.timeline.onenterframe = enterFrame;
  this.timeline.start(this.interval);
};

/**
 * 切换到下一个任务，支持如果当前任务需要等待，则延时执行
 * @param  {[type]} task 下一个任务
 * @return {[type]}      [description]
 */
Animation.prototype._next = function(task) {
  this.index++;
  var _this = this;
  task.wait ? setTimeout(function() {
    _this._runTask();
  }, task.wait) : this._runTask();
};

module.exports = function() {
  return new Animation();
}