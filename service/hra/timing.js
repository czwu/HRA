import constants from '../../common/constants'
import BaseService from '../base'

/**
 * HRA数据 C类-信息采集 情景信息->时序
 */
let config = {
    tableName: "timing",
    columns: [
        { name: "guid", type: "VARCHAR(50)", ext: "PRIMARY KEY" },
        { name: "foreign_id", type: "VARCHAR(50)", ext: "NOT NULL" }, //关联的主数据ID   => 关联 type_c表 的GUID
        { name: "tw", type: "INT" }, //时间窗口 TW
        { name: "tc", type: "INT" }, //关键信号出现时间 TC
        { name: "tp", type: "INT" }, //取规程时间 TP
        { name: "td_value", type: "VARCHAR(500)" }, //诊断时间  多条数据,存储格式为 10|李三, 12|张晓, 13|王力宏
        { name: "td", type: "INT" }, //诊断时间 TD 平均值
        { name: "ta_value", type: "VARCHAR(500)" }, //执行时间  多条数据,存储格式为 10|李三, 12|张晓, 13|王力宏
        { name: "ta", type: "INT" }, //执行时间 TA 平均值
        { name: "tl_value", type: "VARCHAR(500)" }, //路径时间  多条数据,存储格式为 10|李三, 12|张晓, 13|王力宏
        { name: "tl", type: "INT" }, //路径时间 TL 平均值
        { name: "remark", type: "VARCHAR(500)" }, //备注
        { name: "project_id", type: "VARCHAR(50)" } //所属项目ID
    ],
    datas: [],
    guidPrefix: "",
    feature: {
        fileSuggest: false // 删除的时候,需要连带删除关联文件,  暂未关联文件
    }
}
class Service extends BaseService {
    getFormItems() {
        return [
            { field: "tw", name: "时间窗口 Tw", datatype: 'number', type: 'text', inputSuffix: "min" },
            { field: "tp", name: "取规程时间 Tp", datatype: 'number', type: 'text', inputSuffix: "min" },
            { field: "tc", name: "关键信号出现时间 Tc", datatype: 'number', type: 'text', inputSuffix: "min" },
            { group: '诊断时间Td' },
            { addField: 'td_value', css: 'no-border', fieldName: 'td_field', fieldTitle: '诊断时间Td', num: 0 },
            { field: "td", name: "诊断时间 Td (平均值)", datatype: 'number', type: 'label', inputSuffix: "min", css: 'long-col', placeholder: '请输入以上诊断时间数据,可自动计算' },
            { group: '执行时间Ta' },
            { addField: 'ta_value', css: 'no-border', fieldName: 'ta_field', fieldTitle: '执行时间Ta', num: 0 },
            { field: "ta", name: "执行时间 Ta (平均值)", datatype: 'number', type: 'label', inputSuffix: "min", css: 'long-col', placeholder: '请输入以上执行时间数据,可自动计算' },
            { group: '路径时间TL' },
            { addField: 'tl_value', css: 'no-border', fieldName: 'tl_field', fieldTitle: '路径时间TL', num: 0 },
            { field: "tl", name: "路径时间 TL (平均值)", datatype: 'number', type: 'label', inputSuffix: "min", css: 'long-col', placeholder: '请输入以上路径时间数据,可自动计算' },
            { field: "remark", name: "备注", datatype: 'string', type: 'text-media', css: 'long-col' }
        ]
    }
}
const service = new Service(config)
export default service