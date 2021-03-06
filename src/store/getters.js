// 从getters取数据到组件中

export const singer = state => state.singer

export const playing = state => state.playing

export const fullScreen = state => state.fullScreen

export const playlist = state => state.playlist

export const sequenceList = state => state.sequenceList

export const mode = state => state.mode

export const currentIndex = state => state.currentIndex
// 该文件也可充当计算属性的作用，获取当前播放的歌曲
export const currentSong = (state) => {
  return state.playlist[state.currentIndex] || {}
}
