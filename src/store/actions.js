import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/utils'

/**
 * 查找index
 * @param list 数组列表
 * @param song 当前被查找的项
 * */
function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}
/**
 * 选中播放,提交各个mutation
 * @param commit vuex的提交
 * @param state vuex的状态
 * @param item 当然歌曲
 * @param index 当前歌曲的索引
 * */
export const selectPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

/**
 * 随机播放
 * @param commit vuex的提交
 * @param state vuex的状态
 * @param item 当然歌曲
 * */
export const randomPlay = function ({commit}, {list}) {
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  let randomList = shuffle(list)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}
