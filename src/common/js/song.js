import {ERR_OK} from "api/config";
import {getLyric} from 'api/song'
import {Base64} from 'js-base64'

export default class Song{
  constructor({id,mid,singer,name,album,duration,image}) {
    this.id=id
    this.mid=mid
    this.singer=singer
    this.name=name
    this.album=album
    this.duration=duration
    this.image=image

  }
  getLyric() {
    if(this.lyric){
      return Promise.resolve(this.lyric)
    }
    return new Promise((resolve,reject)=>{
      getLyric(this.mid).then((res)=>{
        if(res.retcode===ERR_OK){
          this.lyric=Base64.decode(res.lyric)
          resolve(this.lyric)
        }else{
          reject('no lyric')
        }
      })
    })

  }

}

//抽象出工厂方法
export function createSong(musicData) {
  return new Song({
    id:musicData.songid,
    mid:musicData.songmid,
    singer:filterSinger(musicData.singer),
    name:musicData.songname,
    album:musicData.albumname,
    duration:musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`

  })

}

 function filterSinger(singer) {
  let ret=[]
  if(!singer){
    return ''
  }
  singer.forEach((s)=>{
    ret.push(s.name)
  })
  return ret.join('/')
}

export function isValidMusic(musicData) {
  return musicData.songid && musicData.albummid && (!musicData.pay || musicData.pay.payalbumprice === 0)
}
