/**
* 添加样式的方法
 * @param el 元素
 * @param className 样式名
* */
export function addClass(el, className) {
  // 如果当前元素包含改class,则不做任何操作
  if (hasClass(el, className)) {
    return
  }
  // 先将当前已有class转为数组
  let newClass = el.className.split(' ')
  // 再将新加的class添加进数组
  newClass.push(className)
  // 然后再赋值给元素的class属性
  el.className = newClass.join(' ')
}
/**
 * 检查是否包含该样式的方法
 * @param el 元素
 * @param className 样式名
 * @return Boolean
 * */
export function hasClass(el, className) {
  // 定义正则，前后可有空白符
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  // 然后检测class名是否存在于元素已有的class中
  return reg.test(el.className)
}
