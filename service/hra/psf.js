import constants from '../../common/constants'
import BaseService from '../base'

/**
 * HRA数据 C类-信息采集 PSF数据
 */
let config = {
    tableName: "PSF",
    columns: [
        { name: "guid", desc: "唯一ID", type: "VARCHAR(50)", ext: "PRIMARY KEY" },
        { name: "foreign_id", type: "VARCHAR(50)", ext: "NOT NULL" }, //关联的主数据ID   => 关联 typeA表 的GUID
        { name: "time_available", type: "VARCHAR(50)" }, //可用时间
        { name: "time_doc", type: "VARCHAR(50)" }, //相关文件
        { name: "time_remark", type: "VARCHAR(500)" }, //备注 
        { name: "pressure", type: "VARCHAR(50)" }, //压力
        { name: "pressure_doc", type: "VARCHAR(50)" }, //相关文件
        { name: "pressure_remark", type: "VARCHAR(500)" }, //备注 
        { name: "complex", type: "VARCHAR(50)" }, //复杂程度
        { name: "complex_doc", type: "VARCHAR(50)" }, //相关文件
        { name: "complex_remark", type: "VARCHAR(500)" }, //备注 
        { name: "experience", type: "VARCHAR(50)" }, //经验/培训
        { name: "exp_doc", type: "VARCHAR(50)" }, //相关文件
        { name: "exp_remark", type: "VARCHAR(500)" }, //备注 
        { name: "procedure_info", type: "VARCHAR(50)" }, //规程
        { name: "procedure_doc", type: "VARCHAR(50)" }, //相关文件
        { name: "procedure_remark", type: "VARCHAR(500)" }, //备注 
        { name: "hmi", type: "VARCHAR(50)" }, //工效学/人机界面
        { name: "hmi_doc", type: "VARCHAR(50)" }, //相关文件
        { name: "hmi_remark", type: "VARCHAR(500)" }, //备注 
        { name: "suitability", type: "VARCHAR(50)" }, //职责适宜度
        { name: "suitability_doc", type: "VARCHAR(50)" }, //相关文件
        { name: "suitability_remark", type: "VARCHAR(500)" }, //备注 
        { name: "process", type: "VARCHAR(50)" }, //工序
        { name: "process_doc", type: "VARCHAR(50)" }, //相关文件
        { name: "process_remark", type: "VARCHAR(500)" }, //备注 
        { name: "type", type: "INT", ext: "DEFAULT 1" }, //数据类别: 1 诊断  2 执行
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
        let dateOptions = ['时间不足够', '时间刚刚好(≈2/3倍名义时间)', '名义时间', '充足时间(1-2倍名义时间且>30min)', '很多时间(>2倍名义时间且>30min)', '信息不足'];
        let complexOptions = ['高度复杂', '中等复杂', '一般', '易于诊断', '信息不足'];
        let exOptions = ['低', '一般', '高', '信息不足'];
        let proceOptions = ['不可用', '不完善', '可用,但质量很差', '一般', '诊断/征兆导向规程', '信息不足'];
        let hmiOptions = ['缺失/误导', '差', '一般', '好', '信息不足'];
        let suitablityOptions = ['不适宜', '不太适宜', '一般', '信息不足'];
        let processOptions = ['差', '正常', '好', '信息不足'];
        return [
            { name: '可用时间', field: 'time_available', datatype: 'string', type: 'selector', css: 'long-col', values: dateOptions },
            { name: "相关文件", field: "time_doc", datatype: 'string', type: "file" },
            { name: "备注", field: "time_remark", datatype: 'string', type: 'text-media' },
            { name: '压力', field: 'pressure', datatype: 'string', type: 'selector', css: 'long-col', values: ['很高', '高', '正常', '信息不足'] },
            { name: "相关文件", field: "pressure_doc", datatype: 'string', type: "file" },
            { name: "备注", field: "pressure_remark", datatype: 'string', type: 'text-media' },
            { name: '复杂程度', field: 'complex', datatype: 'string', type: 'selector', css: 'long-col', values: complexOptions },
            { name: "相关文件", field: "complex_doc", datatype: 'string', type: "file" },
            { name: "备注", field: "complex_remark", datatype: 'string', type: 'text-media' },
            { name: '经验/培训', field: 'experience', datatype: 'string', type: 'selector', css: 'long-col', values: exOptions },
            { name: "相关文件", field: "exp_doc", datatype: 'string', type: "file" },
            { name: "备注", field: "exp_remark", datatype: 'string', type: 'text-media' },
            { name: '规程', field: 'procedure_info', datatype: 'string', type: 'selector', css: 'long-col', values: proceOptions },
            { name: "相关文件", field: "procedure_doc", datatype: 'string', type: "file" },
            { name: "备注", field: "procedure_remark", datatype: 'string', type: 'text-media' },
            { name: '工效学/人机界面', field: 'hmi', datatype: 'string', type: 'selector', css: 'long-col', values: hmiOptions },
            { name: "相关文件", field: "hmi_doc", datatype: 'string', type: "file" },
            { name: "备注", field: "hmi_remark", datatype: 'string', type: 'text-media' },
            { name: '职责适宜度', field: 'suitability', datatype: 'string', type: 'selector', css: 'long-col', values: suitablityOptions },
            { name: "相关文件", field: "suitability_doc", datatype: 'string', type: "file" },
            { name: "备注", field: "suitability_remark", datatype: 'string', type: 'text-media' },
            { name: '工序', field: 'process', datatype: 'string', type: 'selector', css: 'long-col', values: processOptions },
            { name: "相关文件", field: "process_doc", datatype: 'string', type: "file" },
            { name: "备注", field: "process_remark", datatype: 'string', type: 'text-media' }
        ]
    }
    autoInput(data) {

    }
}
const service = new Service(config)
export default service