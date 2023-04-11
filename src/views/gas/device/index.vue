<template>
  <div class = "app-container">
    <el-row>
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

      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
            v-hasPermi="['device:device:add']"
          >新增</el-button>
        </el-col>

        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            @click="handleExport"
            v-hasPermi="['device:device:export']"
          >导出</el-button>
        </el-col>

        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="el-icon-upload2"
            size="mini"
            @click="handleImport"
            v-hasPermi="['device:device:importDevices']"
          >导入</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar> 
      </el-row>

      <el-table v-loading="loading" :data="deviceList" :row-style="{height: '100px'}">
        <el-table-column align="center" type="index" v-if="columns[0].visible" />
        <el-table-column label="设备编码" align="center" key="deviceCode" prop="deviceCode" v-if="columns[1].visible"  />
        <el-table-column label="设备类型" align="center" key="deviceType" prop="deviceType" v-if="columns[2].visible"  />
        <el-table-column label="输气站" align="center" key="stationName" prop="stationName" v-if="columns[3].visible" />
        <el-table-column label="设备厂家" align="center" key="factory" prop="factory" v-if="columns[4].visible" />
        <el-table-column label="气源" align="center" key="gasSource" prop="gasSource" v-if="columns[5].visible" />
        <el-table-column label="规格型号" align="center" key="specifications" prop="specifications" v-if="columns[6].visible" />
        <el-table-column label="安装日期" align="center" key="installDate" prop="installDate" v-if="columns[7].visible" width="92" />
        <el-table-column label="设备状态" align="center" key="status" prop="status" v-if="columns[8].visible"  />
        <el-table-column label="更新时间" align="center" prop="updateTime" v-if="columns[9].visible" width="150">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="更新者" align="center" prop="updateBy" v-if="columns[10].visible" />
        <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
          <template slot-scope="scope" v-if="scope.row.userId !== 1">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['device:device:edit']"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['device:device:remove']"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </el-row>

      <!-- 添加或修改用户配置对话框 -->
  <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body center>
    <el-form ref="form" :model="form"  label-width="80px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="设备编码" prop="deviceCode">
          <el-input v-model="form.deviceCode" placeholder="请输入设备编码"  />
          </el-form-item>
        </el-col>
        
        <el-col :span="24">
          <el-form-item label="设备类型" prop="deviceType">
            <el-select v-model="form.deviceType" placeholder="请选择设备类型" style="width: 100%;">
              <el-option
                v-for="item in deviceTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        
        <el-form-item label="输气站" prop="stationName">
          <el-select v-model="form.stationName" placeholder="请选择输气站" clearable style="width: 100%;">
            <el-option
              v-for="item in stationNameList"
              :key="item.stationName"
              :label="item.stationName"
              :value="item.stationName">
            </el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="设备厂家" prop="factory">
          <el-input v-model="form.factory" placeholder="请输入设备厂家"  />
        </el-form-item>

        <el-form-item label="气源" prop="gasSource">
          <el-input v-model="form.gasSource" placeholder="请输入气源"  />
        </el-form-item>

        <el-form-item label="规格型号" prop="specifications">
          <el-input v-model="form.specifications" placeholder="请输入规格型号"  />
        </el-form-item>

        <el-form-item label="安装日期" prop="specifications">
          <el-date-picker
            style="width: 100%;"
            v-model="form.installDate"
            type="date"
            placeholder="选择安装日期">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="设备状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择设备状态" clearable style="width: 100%;">
            <el-option
              v-for="item in dict.type.gas_device_status"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
  
    <!-- 用户导入对话框 -->
  <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
    <el-upload
      ref="upload"
      :limit="1"
      :headers="upload.headers"
      :action="upload.url + '?updateSupport=' + upload.updateSupport"
      :disabled="upload.isUploading"
      :on-progress="handleFileUploadProgress"
      :on-success="handleFileSuccess"
      :before-upload="beforeUpload"
      :auto-upload="false"
      drag
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip text-center" slot="tip">
        <span>上传Excel格式文件</span>
      </div>
    </el-upload>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitFileForm">上 传</el-button>
      <el-button @click="upload.open = false">取 消</el-button>
    </div>
  </el-dialog>
  </div>
</template>

<script>
import {getAllDeviceType, getStationList, listGasDeviceByCondition, addDevice, updateDevice, delDevice} from '@/api/device/index'
import { getToken } from "@/utils/auth";
export default {
  dicts: ['gas_device_status','gas_device_type'],
  data() {
    return {
      // 是否显示弹出层
      open: false,
      loading:true,
      // 设备类型选项
      deviceTypeList:[],
      // 输气站选项
      stationNameList:[],
      // 显示搜索条件
      showSearch: true,
      // 弹出层标题
      title: "",
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/device/device/importDevices"
      },
      deviceList:[],
      // 列信息
      columns: [
        { key: 0, visible: true },
        { key: 1, label: `设备编码`, visible: true },
        { key: 2, label: `设备类型`, visible: true },
        { key: 3, label: `输气站`, visible: true },
        { key: 4, label: `设备厂家`, visible: true },
        { key: 5, label: `气源`, visible: true },
        { key: 6, label: `规格型号`, visible: true },
        { key: 7, label: `安装日期`, visible: true },
        { key: 8, label: `设备状态`, visible: true },
        { key: 9, label: `更新时间`, visible: true },
        { key: 10, label: `更新者`, visible: true },
      ],
      total:0,
      // 表单参数
      form: {},
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加设备";
    },

    // 表单重置
    reset() {
      this.form = {
        deviceId:undefined,
        deviceCode: undefined,
        deviceType: undefined,
        factory: undefined,
        gasSource: undefined,
        installDate: undefined,
        specifications:undefined,
        stationName: undefined,
        status: undefined,
        updateBy: undefined,
        updateTime:undefined
      };
      this.resetForm("form");
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.deviceId != undefined) {
            updateDevice(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
              addDevice(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const deviceId = row.deviceId || this.ids;
      listGasDeviceByCondition(deviceId).then(response => {
        response.rows.forEach(item => {
          if(item.deviceId === deviceId){
            this.form = item
          }
        })
        this.open = true;
        this.title = "修改设备";
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const deviceIds = row.deviceId || this.ids;
      this.$modal.confirm('是否确认删除设备编号为"' + deviceIds + '"的数据项？').then(function() {
        return delDevice(deviceIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
      /** 导出按钮操作 */
    handleExport() {
      this.download('device/device/export', {
        ...this.queryParams
      }, `user_${new Date().getTime()}.xlsx`)
    },
      /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "用户导入";
      this.upload.open = true;
    },
// 上传校验
beforeUpload(){
  // this.$message.error('错了哦，这是一条错误消息')
  // return false
},

    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      // this.$modal.msgSuccess("上传成功");
      if(response.code == 200){
        // 上传成功

        this.$message.success(`上传成功`)
      }else{
        this.$message.error(`${response.msg}`)

      }
      // this.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", { dangerouslyUseHTMLString: true });
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    }
  }, 
}
</script>
