import {playMode} from 'common/js/config'

const state = {
  singer: {},
  playing: false, // 是否播放
  fullScreen: false, // 全屏
  playlist: [], // 播放列表
  sequenceList: [], // 播放模式列表
  mode: playMode.sequence, // 播放模式
  currentIndex: -1 // 当前播放的索引
}

export default state
