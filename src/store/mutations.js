import * as types from './mutation-types'

const mutations = {
// mutation的方法
  [types.SET_SINGER](state, singer) {
    state.singer = singer
  }
}

export default mutations
