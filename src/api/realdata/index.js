import request from '@/utils/request'
// 查询色谱仪时序数据
export function getGasChromatographDataByDeviceId(deviceId){
    return request({
      url: '/gasChromatograph/getGasChromatographDataByDeviceId/' + deviceId,
      method: 'get',
    })
  }

