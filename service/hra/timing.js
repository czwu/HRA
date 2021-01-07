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
        { name: "tsw", type: "INT" }, //时间窗口 TW
        { name: "tdelay1", type: "INT" }, //关键信号出现时间 诊断 
        { name: "tdelay2", type: "INT" }, //关键信号出现时间 执行 
        { name: "tcatch", type: "INT" }, //取规程时间 TP
        { name: "tcog_value", type: "VARCHAR(500)" }, //诊断时间  多条数据,存储格式为 10|李三, 12|张晓, 13|王力宏
        { name: "tcog", type: "INT" }, //诊断时间 TD 平均值
        { name: "texe_value", type: "VARCHAR(500)" }, //执行时间  多条数据,存储格式为 10|李三, 12|张晓, 13|王力宏
        { name: "texe", type: "INT" }, //执行时间 TA 平均值
        { name: "tpath_value", type: "VARCHAR(500)" }, //路径时间  多条数据,存储格式为 10|李三, 12|张晓, 13|王力宏
        { name: "tpath", type: "INT" }, //路径时间 TL 平均值
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
            { field: "tsw", name: "时间窗口 Tsw", datatype: 'number', type: 'text', inputSuffix: "min" },
            { field: "tcatch", name: "取规程时间 Tcatch", datatype: 'number', type: 'text', inputSuffix: "min" },
            { field: "tdelay1", name: "关键信号出现时间 Tdelay1(诊断)", datatype: 'number', type: 'text', inputSuffix: "min", labelWarp: true },
            { field: "tdelay2", name: "关键信号出现时间 Tdelay2(执行)", datatype: 'number', type: 'text', inputSuffix: "min", labelWarp: true },
            { group: '诊断时间Tcog' },
            { addField: 'tcog_value', css: 'no-border', fieldName: 'tcog_field', fieldTitle: '诊断时间Tcog', num: 0 },
            { field: "tcog", name: "诊断时间 Tcog (平均值)", datatype: 'number', type: 'label', inputSuffix: "min", css: 'long-col', placeholder: '请输入以上诊断时间数据,可自动计算' },
            { group: '执行时间Texe' },
            { addField: 'texe_value', css: 'no-border', fieldName: 'texe_field', fieldTitle: '执行时间Texe', num: 0 },
            { field: "texe", name: "执行时间 Texe (平均值)", datatype: 'number', type: 'label', inputSuffix: "min", css: 'long-col', placeholder: '请输入以上执行时间数据,可自动计算' },
            { group: '路径时间Tpath' },
            { addField: 'tpath_value', css: 'no-border', fieldName: 'tpath_field', fieldTitle: '路径时间Tpath', num: 0 },
            { field: "tpath", name: "路径时间 Tpath (平均值)", datatype: 'number', type: 'label', inputSuffix: "min", css: 'long-col', placeholder: '请输入以上路径时间数据,可自动计算' },
            { field: "remark", name: "备注", datatype: 'string', type: 'text-media', css: 'long-col' }
        ]
    }
}
const service = new Service(config)
export default service