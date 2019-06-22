//随机数组算法

//返回min,max之间的随机数 +1是为了取到max
function getRandomInt(min,max) {
  return Math.floor(Math.random()*(max-min+1)+min)
}
export function shuffle(arr) {
  let _arr=arr.slice()//创建一个副本 不会修改原数组
  for(let i=0;i<_arr.length;i++) {
    let j=getRandomInt(0,i)
    let t=_arr[i]
    _arr[i]=_arr[j]
    _arr[j]=t
  }
  return _arr
}


//实现截流函数，对某一个函数做截流就会返回一个新的函数，延迟去执行要截流的这个函数
export function debounce(func,delay) {
  let timer

  return function (...args) {
    if(timer){
      clearTimeout(timer)
    }
    //apply：调用一个对象的一个方法，用另一个对象替换当前对象。例如：B.apply(A, arguments);即A对象应用B对象的方法。
    timer=setTimeout(()=>{
      func.apply(this,args)
    },delay)
  }

}
