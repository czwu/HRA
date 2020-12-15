import constants from '../../common/constants'
import util from '../../common/util'
import BaseService from '../base'

//电厂基础信息表
let config = {
    tableName: "plant",
    columns: [
        { name: "guid", type: "VARCHAR(50)", ext: "PRIMARY KEY" }, //唯一ID
        { name: "name", type: "VARCHAR(50)", ext: "NOT NULL" }, //电厂名称   
        { name: "config", type: "VARCHAR(50)" }, //电厂配置
        { name: "unit", type: "VARCHAR(50)" }, //机组
        { name: "unit_states", type: "VARCHAR(50)" }, //机组状态(运行工况)
        { name: "power_level", type: "VARCHAR(50)" }, //电功率水平
        { name: "workplace", type: "VARCHAR(150)" }, //工作地点
        { name: "dt", type: "VARCHAR(150)" }, //日期
        { name: "filler", type: "VARCHAR(50)" }, //填写人 默认当前用户
        { name: "job", type: "VARCHAR(50)" }, //工作岗位
        { name: "project_id", type: "VARCHAR(50)" }, //所属项目ID 
        { name: "created_at", type: "INT" }, //任务创建时间
        { name: "created_by", type: "VARCHAR(50)" }, //创建人
        { name: "updated_at", type: "INT" }, //修改人
        { name: "updated_by", type: "VARCHAR(50)" }, //修改时间
        { name: "delete_flag", type: "INT", ext: " DEFAULT 0 " }
    ],
    datas: [],
    guidPrefix: ""
}
class Service extends BaseService {
    getFormItems() {
        return [
            { name: '电厂名称', field: 'name', datatype: 'string', type: 'text' },
            { name: '电厂配置', field: 'config', datatype: 'string', type: 'text' },
            { name: '机组', field: 'unit', datatype: 'string', type: 'text' },
            { name: '机组状态(运行工况)', field: 'unit_states', datatype: 'string', type: 'text' },
            { name: '电功率水平', field: 'power_level', datatype: 'string', type: 'text' },
            { name: '工作地点', field: 'workplace', datatype: 'string', type: 'text' },
            { name: '日期', field: 'dt', datatype: 'string', type: 'datepicker', defaultValue: parseInt(Date.now() / 1000), disabled: true },
            { name: '填写人', field: 'filler', datatype: 'string', type: 'text', defaultValue: util.getUserName(), disabled: true },
            { name: '工作岗位', field: 'job', datatype: 'string', type: 'text' }
        ]
    }
    autoInput(data) {
        let num = (Math.random() + '').replace('.', '').substr(0, 4);
        Object.assign(data, {
            name: '电厂_' + num,
            config: '基本配置信息',
            unit: '机组信息',
            unit_states: '正常运行',
            power_level: 'level1',
            workplace: '某某电厂某某办公室',
            job: '一线岗位'
        })
    }
}
const service = new Service(config)
export default service;