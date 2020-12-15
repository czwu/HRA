import constants from '../../common/constants'
import BaseService from '../base'

//A类数据信息的工作计划表 
let config = {
    tableName: "plain",
    columns: [
        { name: "guid", type: "VARCHAR(50)", ext: "PRIMARY KEY" }, //唯一ID
        { name: "foreign_id", type: "VARCHAR(50)", ext: "NOT NULL" }, //关联的主数据ID   
        { name: "code", type: "VARCHAR(50)" }, //编号
        { name: "name", type: "VARCHAR(50)" }, //计划名称
        { name: "stage", type: "INT" }, //周期
        { name: "type", type: "VARCHAR(10)" }, //计划类别
        { name: "project_id", type: "VARCHAR(50)" }, //所属项目ID
        { name: "created_at", type: "INT" }, //任务创建时间
        { name: "created_by", type: "VARCHAR(50)" }, //创建人
        { name: "updated_at", type: "INT" }, //修改人
        { name: "updated_by", type: "VARCHAR(50)" }, //修改时间
        { name: "delete_flag", type: "INT", ext: " DEFAULT 0 " }
    ],
    datas: [],
    guidPrefix: "warn_",
}
class PlainService extends BaseService {
    getFormItems() {
        return [
            { name: '编号', field: 'code', datatype: 'string', type: 'text', required: true },
            { name: '计划名称', field: 'name', datatype: 'string', type: 'text', required: true },
            { name: '周期', field: 'stage', datatype: 'number', type: 'text' },
            { name: '计划类别', field: 'type', datatype: 'string', type: 'text' }
        ]
    }

    getTableItems() {
        return [
            { name: '编号', field: 'code', width: '20%' },
            { name: '计划名称', field: 'name', width: '30%' },
            { name: '周期', field: 'stage', width: '20%' },
            { name: '计划类别', field: 'type', width: '20%' }
        ]
    }

    autoInput(data) {
        data.code = '001';
        data.name = '检查数据清单';
        data.stage = 1;
        data.type = '巡检计划';
    }
}
const service = new PlainService(config)
export default service;