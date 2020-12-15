import constants from '../../common/constants'
import BaseService from '../base'

/**
 * HRA数据 C类-信息采集 情景信息->事件树故障树
 */
let config = {
    tableName: "fault_event",
    columns: [
        { name: "guid", type: "VARCHAR(50)", ext: "PRIMARY KEY" },
        { name: "foreign_id", type: "VARCHAR(50)", ext: "NOT NULL" }, //关联的主数据ID   => 关联 type_c表 的GUID
        { name: "event_doc", type: "VARCHAR(200)" }, //相关文件
        { name: "event_remark", type: "VARCHAR(500)" }, //备注
        { name: "fault_doc", type: "VARCHAR(200)" }, //相关文件
        { name: "fault_remark", type: "VARCHAR(500)" }, //备注
        { name: "project_id", type: "VARCHAR(50)" } //所属项目ID
    ],
    datas: [],
    guidPrefix: "",
    feature: {
        fileSuggest: false // 删除的时候,需要连带删除关联文件
    }
}
class Service extends BaseService {
    getFormItems() {
        return [
            { group: '事件树' },
            { field: "event_doc", name: "相关文件", datatype: 'string', type: "file" },
            { field: "event_remark", name: "备注", datatype: 'string', type: 'text-media', css: 'long-col' },
            { group: '故障树' },
            { field: "fault_doc", name: "相关文件", datatype: 'string', type: "file" },
            { field: "fault_remark", name: "备注", datatype: 'string', type: 'text-media', css: 'long-col' }
        ]
    }
    autoInput(data) {

    }


}
const service = new Service(config)
export default service