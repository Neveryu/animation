'use strict';

var __id = 0;

/**
 * 动态创建id
 * @return {[type]} [description]
 */
function getId() {
  return ++__id;
}


/**
 * 预加载图片函数
 * @param  {[type]}   images   加载图片的数组或者对象
 * @param  {Function} callback 全部图片加载完毕后调用的回调函数
 * @param  {[type]}   timeout  加载超时的时长
 * @return {[type]}            [description]
 */
function loadImage(images, callback, timeout) {
  // 加载完成图片的计数器
  var count = 0;
  // 全部图片加载成功的一个标志位（默认认为可以全部加载）
  var success = true;
  // 超时timer的id
  var timeoutId = 0;
  // 是否加载超时的标志位
  var isTimeout = false;

  // 对图片数组（或对象）进行遍历
  for(var key in images) {
    // 过滤prototype上的属性【hasOwnPrototype无法检查该对象的原型链中是否具有该属性】
    if(!images.hasOwnProperty(key)) {
      continue;
    }
    // 获得每个图片元素
    // 期望格式是个object: {src: xxx}
    var item = images[key];
    if(typeof item === 'string') {
      item = images[key] = {
        src: item
      };
    }
    // 如果格式不满足期望，则丢弃此条数据进行下一次遍历
    if(!item || !item.src) {
      continue;
    }

    // 计数+1
    count++;
    // 设置图片元素的id
    item.id = '__img__' + key + getId();

    // 设置图片元素的img，它是一个Image对象
    item.img = window[item.id] = new Image();


    // 这个for循环前面的操作，就是将images里面的每一个元素构造成一个item对象
    doLoad(item);
  }
  // 遍历完成，如果计数为0，则直接调用callback
  if (!count) {
    callback(success);
  } else if(timeout) {
    timeoutId = setTimeout(onTimeout, timeout);
  }



  /**
   * 真正进行图片加载的函数
   * @param  {[type]} item 图片元素对象
   * @return {[type]}      [description]
   */
  function doLoad(item) {
    item.status = 'loading';
    var img = item.img;
    // 定义图片加载成功的回调函数
    img.onload = function() {
      // 如果有任何一个img出现了error，那么success就是false
      // 如果success是false的话，那么整个结果就是false了
      success = success & true;
      item.status = 'loaded';
      done();
    };
    // 定义图片加载失败的回调函数
    img.onerror = function() {
      success = false;
      item.status = 'error';
      done();
    };

    // 发起一个http(s)的请求，去加载图片
    img.src = item.src;
    /**
     * 每张图片加载完成的回调函数
     * @return {Function} [description]
     */
    function done() {
      // 清理事件，解除事件绑定
      img.onload = img.onerror = null;
      try {
        // 用来删除一个对象的属性
        delete window[item.id];
      } catch (e) {

      }

      // 每张图片加载完成，计数器减1，当所有图片加载完成且没有超时的情况
      // 清楚超时计时器，且执行回调函数
      if(!--count && !isTimeout) {
        clearTimeout(timeoutId);
        callback(success);
      }
    }
  }

  /**
   * 超时函数
   * @return {[type]} [description]
   */
  function onTimeout() {
    isTimeout = true;
    callback(false);
  }
}

module.exports = loadImage;