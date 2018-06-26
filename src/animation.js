'use strict';

// 初始化状态
var STATE_INITIAL = 0
// 开始状态
var STATE_START = 1;
// 停止状态
var STATE_STOP = 2;

/**
 * 定义一个类，我们知道js的类都是通过function来实现的
 * 帧动画库类
 * @constructor
 */

function Animation() {
  this.taskQueue = [];
  this.index = 0;
  this.state = STATE_INITIAL;
}

/**
 * 添加一个同步任务，去预加载图片
 * @param imglist 图片数组
 */
Animation.prototype.loadImage = function(imglist) {
  
}


/**
 * 添加一个异步定时任务，通过定时改变图片背景位置实现帧动画
 * @param  {[type]} ele       dom对象
 * @param  {[type]} positions 背景位置的数组
 * @param  {[type]} imageUrl  图片地址
 * @return {[type]}           [description]
 */
Animation.prototype.changePosition = function(ele, positions, imageUrl) {}

/**
 * 添加一个异步定时任务，通过定时改变image标签的src属性，实现帧动画
 * @param  {[type]} ele     dom对象
 * @param  {[type]} imglist 图片数组
 * @return {[type]}         [description]
 */
Animation.prototype.changeSrc = function(ele, imglist) {}

/**
 * 高级用法，添加一个异步定时执行的任务
 * 该任务自定义动画没帧执行的任务函数
 * @param  {[type]} taskFn 自定义每帧执行的任务函数
 * @return {[type]}        [description]
 */
Animation.prototype.enterFrame = function(taskFn) {}

/**
 * 添加一个同步任务，可以在上一个任务完成后执行回调函数
 * @param  {Function} callback 回调函数
 * @return {[type]}            [description]
 */
Animation.prototype.then = function(callback) {}

/**
 * 开始执行任务
 * @param  {[type]} interval 异步定时任务执行的间隔
 * @return {[type]}          返回this，链式调用
 */
Animation.prototype.start = function(interval) {}

/**
 * 添加一个同步任务，该任务就是回退到上一个任务中
 * 实现重复上一个任务的效果，可定义重复的次数
 * @param  {[type]} times 重复次数
 * @return {[type]}       [description]
 */
Animation.prototype.repeat = function(times) {

}

/**
 * 添加一个同步任务，相当于repeat()更友好的接口，该任务就是无限循环上一次任务
 * @return {[type]} [description]
 */
Animation.prototype.repeatForever = function() {
  return this.repeat();
}


/**
 * 设置当前任务结束后到下一个任务开始前的等待时间
 * @param  {[type]} time 等待的时长
 * @return {[type]}      [description]
 */
Animation.prototype.wait = function(time) {

}

/**
 * 暂停当前执行的异步定时任务
 * @return {[type]} [description]
 */
Animation.prototype.pause = function() {

}


/**
 * 重新开始执行当前异步定时任务
 * @return {[type]} [description]
 */
Animation.prototype.restart = function() {

}

/**
 * 释放资源
 * @return {[type]} [description]
 */
Animation.prototype.dispose = function() {

}

/**
 * 添加一个任务到任务队列中
 * @param {[type]} taskFn 任务方法
 * @param {[type]} type   任务类型
 * @return { Animation } 返回this，链式调用
 */
Animation.prototype._add = function(taskFn, type) {

}

/**
 * 执行任务
 * @return {[type]} [description]
 */
Animation.prototype._runTack = function() {

}

/**
 * 同步任务
 * @param  {[type]} task 执行任务的函数
 * @return {[type]}      [description]
 */
Animation.prototype._syncTask = function(task) {

}

/**
 * 异步任务
 * @param  {[type]} task 执行异步的函数
 * @return {[type]}      [description]
 */
Animation.prototype._asyncTask = function(task) {

}