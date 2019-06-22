import originJsonp from 'jsonp'

export default function jsonp(url,data,option) {
  url+=(url.indexOf('?')<0 ? '?': '&')+param(data)   //拼接URL

  return new Promise((resolve,reject) => {
    originJsonp(url,option,(err, data) => {
      if(!err){
        resolve(data)
      }else{
        (err)
      }
    })
  })
}


export function param(data) {
  let url=''
  for(var k in data){
    let value=data[k]!==undefined ? data[k] : ''
    url+=`&${k}=${encodeURIComponent(value)}`
  }
  return url ? url.substring(1) : '' //去掉第一个&
}
