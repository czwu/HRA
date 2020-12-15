import constants from '../../common/constants'
import BaseService from '../base'

/**
 * HRA数据 C类-信息采集->行为分析
 */
let config = {
    tableName: "behavior_type",
    columns: [
        { name: "guid", type: "VARCHAR(50)", ext: "PRIMARY KEY" },
        { name: "foreign_id", type: "VARCHAR(50)", ext: "NOT NULL" }, //关联的主数据ID   => 关联 type_c表 的GUID
        { name: "model_type", type: "VARCHAR(50)" }, //模型选择
        { name: "model_doc", type: "VARCHAR(200)" }, //相关文件
        { name: "model_info", type: "VARCHAR(100)" }, //多媒体
        { name: "model_remark", type: "VARCHAR(500)" }, //备注
        { name: "operating_type", type: "VARCHAR(50)" }, //模型选择
        { name: "operating_doc", type: "VARCHAR(200)" }, //相关文件
        { name: "operating_info", type: "VARCHAR(100)" }, //多媒体
        { name: "operating_remark", type: "VARCHAR(500)" }, //备注
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
        let comments = {
            '技能型': '*技能型:指在某个领域岗位一线,掌握专门知识和技术,具备一定的操作技能并在工作实践中能够运用自己的技术和能力进行实际操作的人员',
            '规则型': '*规则型:指运行、运行规律所遵循的发则进行操作的人员',
            '知识型': '*知识型:指在一个组织之中智慧所创造的价值高于其动手所创造的价值的人员'
        };
        return [
            { field: "model_type", name: "模型选择", datatype: 'string', type: 'item-select', defaultValue: '', values: ['技能型', '规则型', '知识型'], css: 'long-col', comments },
            { field: "model_doc", name: "相关文件", datatype: 'string', type: "file" },
            { field: "model_info", name: "多媒体", datatype: 'string', type: 'text-media' },
            { field: "model_remark", name: "备注", datatype: 'string', type: 'text-media', css: 'long-col' },
            { field: "operating_type", name: "模型选择", datatype: 'string', type: 'item-select', defaultValue: '', values: ['恢复性操作', '支持性系统操作', '常规操作'], css: 'long-col' },
            { field: "operating_doc", name: "相关文件", datatype: 'string', type: "file" },
            { field: "operating_info", name: "多媒体", datatype: 'string', type: 'text-media' },
            { field: "operating_remark", name: "备注", datatype: 'string', type: 'text-media', css: 'long-col' }
        ]
    }
    autoInput(data) {

    }


}
const service = new Service(config)
export default service