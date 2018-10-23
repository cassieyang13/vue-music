import * as types from './mutation-types'

/**
 * 选中播放,提交各个mutation
 * @param commit vuex的提交
 * @param state vuex的状态
 * @param item 当然歌曲
 * @param index 当前歌曲的索引
 * */
export const selectPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_PALYLIST, list)
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}
