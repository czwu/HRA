import constants from '../../common/constants'
import BaseService from '../base'
import typeAInfoService from './typeAInfo'
import warningSerivice from './warning'
import directiveSerivice from './directive'
import plainSerivice from './plain'
import accessbilityService from './accessibility'

let config = {
    tableName: "TypeA",
    columns: [
        { name: "guid", type: "VARCHAR(50)", ext: "PRIMARY KEY" }, //唯一ID
        { name: "task_id", type: "VARCHAR(50)", ext: "NOT NULL", foreign_key: true }, //唯一ID
        { name: "code", type: "VARCHAR(50)", ext: "NOT NULL" }, //编码
        { name: "human_error_code", type: "VARCHAR(50)", ext: "" }, //人误编码
        { name: "device_type", type: "VARCHAR(100)", ext: "" }, //设备类型
        { name: "device_funciton", type: "VARCHAR(100)", ext: "" }, //设备功能
        { name: "normal_text", type: "VARCHAR(100)", ext: "" }, //正常状态文本
        { name: "normal_status", type: "VARCHAR(10)", ext: "" }, //正常状态
        { name: "demand_status", type: "VARCHAR(10)", ext: "" }, //需求状态
        { name: "manual_valve_switch", type: "VARCHAR(10)", ext: "" }, //手动阀开关状态 (田工沟通,需废除, 已在表单中删除)
        { name: "human_error_factor", type: "VARCHAR(50)", ext: "" }, //可能的人误点
        { name: "human_error_pattern", type: "VARCHAR(50)", ext: "" }, //人误失误模式
        { name: "human_error_desc", type: "VARCHAR(200)", ext: "" }, //人误描述
        { name: "filter_reason", type: "VARCHAR(500)", ext: "" }, //筛选原因
        { name: "filter_by", type: "VARCHAR(255)", ext: "" }, //筛选依据
        { name: "filter_results", type: "VARCHAR(255)", ext: "" }, //筛选结果
        { name: "success_criteria", type: "VARCHAR(255)", ext: "" }, //成功准则
        { name: "human_error_value", type: "VARCHAR(10)", ext: "" }, //人误概率选值
        { name: "human_error_probability", type: "VARCHAR(10)", ext: "" }, //人误概率
        { name: "error_factor", type: "VARCHAR(50)", ext: "" }, //误差因子
        { name: "raw", type: "VARCHAR(50)", ext: "" },
        { name: "rdw", type: "VARCHAR(50)", ext: "" },
        { name: "fv", type: "VARCHAR(50)", ext: "" },
        { name: "fc", type: "VARCHAR(50)", ext: "" },
        { name: "sens", type: "VARCHAR(50)", ext: "" },
        { name: "senslow", type: "VARCHAR(50)", ext: "" },
        { name: "info_src", type: "VARCHAR(50)", ext: "" }, //信息来源
        { name: "remark", type: "VARCHAR(255)", ext: "" }, //备注
        { name: "version", type: "VARCHAR(50)", ext: "" }, //版本
        { name: "project_id", type: "VARCHAR(50)", ext: "" }, //所属项目ID
        { name: "created_at", type: "INT", ext: "" }, //任务创建时间
        { name: "created_by", type: "VARCHAR(50)", ext: "" }, //创建人
        { name: "updated_at", type: "INT", ext: "" }, //修改人
        { name: "updated_by", type: "VARCHAR(50)", ext: "" }, //修改时间
        { name: "delete_flag", type: "INT", ext: " DEFAULT 0 " }
    ],
    datas: [],
    guidPrefix: "A_",
    feature: {
        fileSuggest: false //删除的时候,是否需要连带删除关联文件   备注:主数据暂未关联文件
    }
}
class TypeAService extends BaseService {
    getFormItems() {
        return [
            { name: '编码', field: 'code', datatype: 'string', type: 'text', required: true },
            { name: '人误编码', field: 'human_error_code', datatype: 'string', type: 'text', required: true },
            { name: '设备类型', field: 'device_type', datatype: 'string', type: 'text', required: true },
            { name: '设备功能', field: 'device_funciton', datatype: 'string', type: 'text', css: 'long-col' },
            { name: '正常状态', field: 'normal_status', datatype: 'string', type: 'switch', defaultValue: '开', values: ['关', '开'], css: 'long-col', inputField: 'normal_text' },
            { name: '需求状态', field: 'demand_status', datatype: 'string', type: 'switch', defaultValue: '关', values: ['关', '开'] },
            // { name: '手动阀开关状态', field: 'manual_valve_switch', datatype: 'string', type: 'switch', defaultValue: '开', values: ['关', '开'] },
            { name: '可能的人误点', field: 'human_error_factor', datatype: 'string', type: 'text', css: 'long-col' },
            { name: '人误失误模式', field: 'human_error_pattern', datatype: 'string', type: 'text', css: 'long-col' },
            { name: '人误描述', field: 'human_error_desc', datatype: 'string', type: 'text', css: 'long-col' },
            { name: '筛选原因', field: 'filter_reason', datatype: 'string', type: 'multi-select', css: 'long-col', dictType: constants.DICT_TYPE.FILTER_REASON, split: "|" },
            { name: '筛选依据', field: 'filter_by', datatype: 'string', type: 'text', css: 'long-col' },
            { name: '筛选结果', field: 'filter_results', datatype: 'string', type: 'text', css: 'long-col' },
            { name: '成功准则', field: 'success_criteria', datatype: 'string', type: 'text', css: 'long-col' },
            { name: '人误概率选值', field: 'human_error_value', datatype: 'string', type: 'text', defaultValue: '0' },
            { name: '人误概率', field: 'human_error_probability', datatype: 'string', type: 'text' },
            { name: '误差因子', field: 'error_factor', datatype: 'string', type: 'text' },
            { name: "RAW", field: "raw", datatype: 'string', type: 'text' },
            { name: "RDW", field: "rdw", datatype: 'string', type: 'text' },
            { name: "FV", field: "fv", datatype: 'string', type: 'text' },
            { name: "FC", field: "fc", datatype: 'string', type: 'text' },
            { name: 'SENS', field: 'sens', datatype: 'string', type: 'text' },
            { name: 'SENSLOW', field: 'senslow', datatype: 'string', type: 'text' },
            { name: '信息来源', field: 'info_src', datatype: 'string', type: 'text' },
            { name: '备注', field: 'remark', datatype: 'string', type: 'text', css: 'long-col' },
            { name: '版本', field: 'version', datatype: 'string', type: 'text' }
        ]
    }
    autoInput(data) {
        let num = (Math.random() + '').replace('.', '').substr(0, 4);
        Object.assign(data, {
            code: 'EAS' + num + 'PO',
            human_error_code: 'CSP' + num + 'NN-MS',
            device_type: '电动泵',
            device_funciton: '抽水两用泵，工作介质可以为气体和液体。既可抽水、也可抽气',
            human_error_factor: '地震',
            human_error_pattern: 'damin',
            human_error_desc: '手动阀置于错',
            filter_reason: '原因:xxxxx',
            filter_by: '无',
            filter_results: '未知',
            human_error_probability: '无'
        })
    }

    remove(guid) {
        //调用基类方法删除数据后,再通过相关联的数据服务,删除相关数据
        return super.remove(guid).then(() => {
            typeAInfoService.removeBy({ foreign_id: guid });
            accessbilityService.removeBy({ foreign_id: guid });
            warningSerivice.removeBy({ foreign_id: guid });
            directiveSerivice.removeBy({ foreign_id: guid });
            plainSerivice.removeBy({ foreign_id: guid });
        });
    }

}
const typeAService = new TypeAService(config)
export default typeAService