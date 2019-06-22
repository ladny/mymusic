export function hasClass(el,className) {
  let reg=new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}

export function addClass(el,className) {
  if(hasClass(el,className)){
    return
  }
  let newClass=el.className.split(' ')
  newClass.push(className)
  el.className=newClass.join(' ')
}

export function getData(el, name, val) {
  const prefix='data-'
  if(val){
    return el.setAttribute(prefix+name,val)
  }
  return el.getAttribute(prefix+name)
}

//做能力检查，创建一个标签的style，
let elementStyle=document.createElement('div').style
//浏览器供应商vendor
let vendor=(()=>{
  let transformNames={
    webkit:'webkitTransform',
    Moz:'MozTransform',
    O:'OTransform',
    ms:'msTransform',
    standard:'transform'
  }
  for(let key in transformNames) {
    if(elementStyle[transformNames[key]] !== undefined){
      return key
    }
  }
  return false
})()

export function prefixStyle(style) {
  if(vendor===false){
    return false
  }
  if(vendor==='standard'){
    return style
  }
  //style.charAt(0).toUpperCase()首字母大写+style.substr(1)剩余部分
  return vendor+style.charAt(0).toUpperCase()+style.substr(1)
}
