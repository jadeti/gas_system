<template>
     <div class = "app-container">
      <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
        <el-form-item label="设备类型" prop="deviceType">
        <el-select v-model="queryParams.deviceType" placeholder="请选择设备类型" clearable>
            <el-option
                v-for="item in deviceTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
          
        <el-form-item label="输气站" prop="stationName">
          <el-select v-model="queryParams.stationName" placeholder="请选择输气站" clearable>
            <el-option
              v-for="item in stationNameList"
              :key="item.stationName"
              :label="item.stationName"
              :value="item.stationName">
            </el-option>
          </el-select>
        </el-form-item>
          
        <el-form-item label="设备状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="请选择设备状态" clearable>
            <el-option
              v-for="item in dict.type.gas_device_status"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

         
  <div>        
    <el-row>  
      <el-col :span="6" v-for="(item,index) in deviceList" :key="item.deviceId" >                
        <el-card shadow="hover" style="width: 95%; margin-bottom: 20px;font-size: 10px;">  
        <div slot="header" class="clearfix" >
          <span>设备{{index + 1}}</span>
          <el-button style="float: right; padding: 3px 0" type="text" class="el-button--small el-icon-view" @click="handleDetaildata(item)">   查看</el-button>
        </div>
        <div style="height: 95px;">
          <el-row>
            <el-col :span="6" style="padding-left: 5px; padding-right: 5px;">
              <img src="http://8.141.153.123:49161/static/img/device2.10cdd191.png" class="image" style="width: 70%;height: 70%; margin: 5px;"> 
            </el-col>
            <el-col :span="18">
              <div style="margin: 12px 0 25px 0;font-size: 14px; font-weight: 700; color: rgba(0,0,0,.65);">设备类型：{{item.deviceType}}</div>
            </el-col>
          </el-row>
          <el-row style="text-align: center;">
            <el-col :span="8" style="padding-left: 5px; padding-right: 5px;">
              <div style="margin-bottom: 8px;color: rgba(0,0,0,.55);">输气站</div>
              <div style="margin-bottom: 5px;font-weight: 700;color: rgba(0,0,0,.85);">{{item.stationName}}</div>
            </el-col>
            <el-col :span="8" style="padding-left: 5px; padding-right: 5px;">
              <div style="margin-bottom: 8px;color: rgba(0,0,0,.55);">设备厂家</div>
              <div style="margin-bottom: 5px;font-weight: 700;color: rgba(0,0,0,.85);">{{item.factory}}</div>
            </el-col>
            <el-col :span="8" style="padding-left: 5px; padding-right: 5px;">
              <div style="margin-bottom: 8px;color: rgba(0,0,0,.55);">规格型号</div>
              <div style="margin-bottom: 5px;font-weight: 700;color: rgba(0,0,0,.85);">{{item.deviceCode}}</div>
            </el-col>
          </el-row>
        </div>                  
          </el-card>    
        </el-col>                                        
      </el-row>        
    </div>

    <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>
</template>
<style>
.box-card div[data-v-1eb5f45e] {
    font-size: 10px;
}
</style>
<script>
import {getAllDeviceType, getStationList, listGasDeviceByCondition, addDevice, updateDevice, delDevice} from '@/api/device/index'
import { getToken } from "@/utils/auth";
export default {
  dicts: ['gas_device_status','gas_device_type'],
  data() {
    return {
      // 设备类型选项
      deviceTypeList:[],
      // 输气站选项
      stationNameList:[],
      // 显示搜索条件
      showSearch: true,
      deviceList:[],
      total:0,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 20,
        deviceType:undefined,
        stationName:undefined,
        status:undefined,
      },
    }
  },
  created() {
    getAllDeviceType().then(res => {
      let newArr = []
      res.data.forEach(item => {
        let obj = {
          label:item,
          value:item
        }
        newArr.push(obj)
      })
      this.deviceTypeList = newArr
    }),//通过.then()获取接口数据

    getStationList().then(res => {
      this.stationNameList = res.rows
    })
    
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true;
      listGasDeviceByCondition(this.queryParams).then(res => {
        this.deviceList = res.rows
        this.total = res.total
        this.loading = false
        console.log(res);
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
      /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    handleDetaildata: function(row) {
      const deviceId = row.deviceId
      console.log(deviceId);
      this.$router.push({
        path:'/gas/real-data/detaildata',
        query:{id:deviceId}
      });
    },
  }
}
</script>
