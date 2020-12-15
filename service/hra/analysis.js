import constants from '../../common/constants'
import BaseService from '../base'

/**
 * HRA数据 C类-信息采集 情景信息->人因分析需求
 */
let config = {
    tableName: "analysis",
    columns: [
        { name: "guid", type: "VARCHAR(50)", ext: "PRIMARY KEY" },
        { name: "foreign_id", type: "VARCHAR(50)", ext: "NOT NULL" }, //关联的主数据ID   => 关联 type_c表 的GUID
        { name: "key_signal", type: "VARCHAR(50)" }, //关键信息
        { name: "accident", type: "VARCHAR(50)" }, //事故
        { name: "accident_desc", type: "VARCHAR(100)" }, //事故序列说明
        { name: "success_criteria", type: "VARCHAR(500)" }, //成功准则
        { name: "time_window", type: "VARCHAR(50)" }, //时间窗口
        { name: "procedure_name", type: "VARCHAR(100)" }, //关联规程名称
        { name: "key_step", type: "VARCHAR(100)" }, //关键步骤
        { name: "hardware_sys_failure", type: "VARCHAR(100)" }, //硬件&系统故障
        { name: "pre_person_action", type: "VARCHAR(100)" }, //前序人员动作
        { name: "project_id", type: "VARCHAR(50)" } //所属项目ID
    ],
    datas: [],
    guidPrefix: "",
    feature: {
        fileSuggest: true // 删除的时候,需要连带删除关联文件
    }
}
class Service extends BaseService {
    getFormItems() {
        return [
            { field: "key_signal", name: "关键信息", datatype: 'string', type: 'text' },
            { field: "accident", name: "事故", datatype: 'string', type: "text" },
            { field: "accident_desc", name: "事故序列说明", datatype: 'string', type: 'text' },
            { field: "success_criteria", name: "成功准则", datatype: 'string', type: 'text' },
            { field: "time_window", name: "时间窗口", datatype: 'string', type: 'text' },
            { field: "procedure_name", name: "关联规程名称", datatype: 'string', type: "text" },
            { field: "key_step", name: "关键步骤", datatype: 'string', type: 'text' },
            { field: "hardware_sys_failure", name: "硬件&系统故障", datatype: 'string', type: 'text' },
            { field: "pre_person_action", name: "前序人员动作", datatype: 'string', type: 'text' }
        ]
    }
    autoInput(data) {

    }
}
const service = new Service(config)
export default service