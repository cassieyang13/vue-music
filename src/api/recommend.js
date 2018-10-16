import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'
import axios from 'axios'

export function getRecommend() {
  // 定义url
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  // 合并默认参数与配置参数
  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uni: 0,
    needNewCode: 1
  })
  // 返回调用jsonp的数据
  return jsonp(url, data, options)
}

export function getDiscList() {
  // 定义url
  const url = '/api/getDiscList'
  // 合并默认参数与配置参数
  const data = Object.assign({}, commonParams, {
    picmid: 1,
    platform: 'yqq',
    loginUin: 0,
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    inCharset: 'utf8',
    outCharset: 'utf-8',
    rnd: Math.random(),
    format: 'json'
  })
  // 返回调用jsonp的数据
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
