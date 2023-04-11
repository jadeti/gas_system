import request from '@/utils/request'

// 获取所有设备类型
export const getAllDeviceType = () => {
  return request({
    url: '/diagnosis/getAllDeviceType',
    method: 'get'
  })
}

// 查询输气站
export const getStationList = () => {
  return request({
    url: '/station/station/list',
    method: 'get'
  })
}

// 条件查询设备
export const listGasDeviceByCondition = (query) => {
  return request({
    url: '/device/device/listGasDeviceByCondition',
    method: 'get',
    params: query
  })
}

// 新增设备
export function addDevice (data){
  return request({
    url: '/device/device',
    method: 'post',
    data:data
  })
}

// 修改设备
export function updateDevice(data) {
  return request({
    url: '/device/device',
    method: 'put',
    data:data
  })
}

// 删除设备
export function delDevice(deviceId) {
  return request({
    url: '/device/device/' + deviceId,
    method: 'delete',
  })
}















  