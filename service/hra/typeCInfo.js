import constants from '../../common/constants'
import BaseService from '../base'

/**
 * HRA数据 A类-信息采集 公共表(设备信息,操作对象,报警,指示,工作计划,试验验证,日常巡检,培训)     备注:可达性由于字段区别太大,无法共用该表
 * 信息类型通过 info_type 区分
 */
let config = {
    tableName: "TYPEC_INFO",
    columns: [
        { name: "guid", desc: "唯一ID", type: "VARCHAR(50)", ext: "PRIMARY KEY" },
        { name: "foreign_id", type: "VARCHAR(50)", ext: "NOT NULL" }, //关联的主数据ID   => 关联 typeA表 的GUID
        { name: "procedure_steps", type: "VARCHAR(500)" }, //规程信息 用来记录规程的步骤id, 用逗号分隔
        { name: "team_id", type: "VARCHAR(50)" }, //主控班组信息 用来记录班组人员id信息, 用逗号分隔
        { name: "remark", type: "VARCHAR(200)" }, //备注 通用字段
        { name: "info_type", type: "VARCHAR(50)" }, //区分信息类型 warning:报警信息,directive 指示, team 主控班组信息, procedure 规程
        { name: "project_id", type: "VARCHAR(50)" } //所属项目ID
    ],
    datas: [],
    guidPrefix: "INFO_",
    feature: {
        fileSuggest: false // 删除的时候,需要连带删除关联文件
    }
}
class Service extends BaseService {
    getFormItems() {
        return [
            { field: "remark", name: "备注", datatype: 'string', type: 'text-media', css: 'long-col' }
        ]
    }
    autoInput(data) {}
}
const service = new Service(config)
export default service