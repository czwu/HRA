import constants from '../../common/constants'
import BaseService from '../base'

/**
 * HRA数据 C类-信息采集 情景信息->事件树故障树
 */
let config = {
    tableName: "inspection",
    columns: [
        { name: "guid", type: "VARCHAR(50)", ext: "PRIMARY KEY" },
        { name: "foreign_id", type: "VARCHAR(50)", ext: "NOT NULL" }, //关联的主数据ID   => 关联 type_a表 的GUID
        { name: "has_inspect", type: "VARCHAR(10)" }, //相关文件
        { name: "inspect_doc", type: "VARCHAR(200)" }, //相关文件
        { name: "inspect_info", type: "VARCHAR(200)" }, //相关资料
        { name: "inspect_remark", type: "VARCHAR(500)" }, //备注
        { name: "has_record", type: "VARCHAR(10)" }, //备注
        { name: "record_doc", type: "VARCHAR(200)" }, //相关文件
        { name: "record_info", type: "VARCHAR(200)" }, //相关资料
        { name: "record_remark", type: "VARCHAR(500)" }, //备注
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
            { field: "has_inspect", name: "是否日常巡检", datatype: 'string', type: 'switch', defaultValue: '是', values: ['否', '是'] },
            { field: "inspect_doc", name: "相关文件", datatype: 'string', type: "file", css: 'long-col' },
            { field: "inspect_info", name: "多媒体", datatype: 'string', type: 'text-media' },
            { field: "inspect_remark", name: "备注", datatype: 'string', type: 'text-media' },
            { field: "has_record", name: "是否书面记录", datatype: 'string', type: 'switch', defaultValue: '是', values: ['否', '是'] },
            { field: "record_doc", name: "相关文件", datatype: 'string', type: "file", css: 'long-col' },
            { field: "record_info", name: "多媒体", datatype: 'string', type: 'text-media' },
            { field: "record_remark", name: "备注", datatype: 'string', type: 'text-media' }
        ]
    }
    autoInput(data) {

    }


}
const service = new Service(config)
export default service