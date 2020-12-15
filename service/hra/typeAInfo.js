import constants from '../../common/constants'
import BaseService from '../base'

/**
 * HRA数据 A类-信息采集 公共表(设备信息,操作对象,报警,指示,工作计划,试验验证,日常巡检,培训)     备注:可达性由于字段区别太大,无法共用该表
 * 信息类型通过 info_type 区分
 */
let config = {
    tableName: "TYPEA_INFO",
    columns: [
        { name: "guid", desc: "唯一ID", type: "VARCHAR(50)", ext: "PRIMARY KEY" },
        { name: "foreign_id", type: "VARCHAR(50)", ext: "NOT NULL" }, //关联的主数据ID   => 关联 typeA表 的GUID
        { name: "position", type: "VARCHAR(100)" }, //位置   (设备信息与操作对象) 
        { name: "real_position", type: "VARCHAR(100)" }, //其他位置  (设备信息-操作对象) 
        { name: 'verify', type: "VARCHAR(10)" }, // 是否试验验证 (验证)
        { name: 'experienced', type: "VARCHAR(10)" }, // 熟练度 (培训)
        { name: 'operator', type: "VARCHAR(100)" }, // 操作人员 (工作计划)
        { name: "document", type: "VARCHAR(200)" }, //相关文件 (通用)
        { name: "information", type: "VARCHAR(100)" }, //多媒体 (通用)
        { name: "remark", type: "VARCHAR(500)" }, //备注 通用字段
        { name: "info_type", type: "VARCHAR(50)" }, //区分信息类型 device:设备信息, object:操作对象, warning:报警信息,directive 指示, plain:工作计划, verify:验证,training:培训
        { name: "project_id", type: "VARCHAR(50)" } //所属项目ID
    ],
    datas: [],
    guidPrefix: "INFO_",
    feature: {
        fileSuggest: true // 删除的时候,需要连带删除关联文件
    }
}
class Service extends BaseService {
    getFormItems({ info_type = constants.INFO_TYPE.DEVICE } = {}) {
        let comments = { '熟手': '*熟手:指熟悉某项工作的人', '新手': '*新手:指新做某项工作,对工作还不熟悉的人' };
        var formItems = [
            { field: "position", name: "位置", datatype: 'string', type: 'switch', values: ['否', '是'], for: `${constants.INFO_TYPE.DEVICE},${constants.INFO_TYPE.OBJECT}` },
            { field: "real_position", name: "实际位置", datatype: 'string', type: "text", placeholder: '是否与位置相同，如果不是请输入正确位置地点', for: `${constants.INFO_TYPE.DEVICE},${constants.INFO_TYPE.OBJECT}` },
            { field: "operator", name: "操作人员", datatype: 'string', type: "select", css: 'long-col', dicttype: constants.DICT_TYPE.USER_SELECT, for: `${constants.INFO_TYPE.PLAIN}` },
            { field: "verify", name: "是否试验验证", datatype: 'string', type: 'switch', defaultValue: '是', values: ['否', '是'], for: `${constants.INFO_TYPE.VERIFY}` },
            { field: "experienced", name: "熟练度", datatype: 'string', type: 'item-select', defaultValue: '', values: ['熟手', '新手'], comments, for: `${constants.INFO_TYPE.TRAINING}` },
            { field: "document", name: "相关文件", datatype: 'string', type: "file", css: 'long-col' },
            { field: "information", name: "多媒体", datatype: 'string', type: 'text-media', css: 'long-col' },
            { field: "remark", name: "备注", datatype: 'string', type: 'text-media', css: 'long-col' }
        ]

        return formItems.filter(item => {
            return (!item.for || item.for.indexOf(info_type) != -1)
        })
    }
    autoInput(data) {

    }


}
const service = new Service(config)
export default service