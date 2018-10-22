import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
import createLogger from 'vuex/dist/logger' // 打印state改变时的log

// 该文件为入口文件,初始化vuex

// 注册插件
Vue.use(Vuex)
// 添加调试工具，，当webpack检测 不要在发布环境下启用严格模式
const debug = process.env.NODE_ENV !== 'production'

// 创建store,传入参数
export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
