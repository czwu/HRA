import constants from '../../common/constants'
import BaseService from '../base'

//情境信息表  数据需要从HRA模块同步过来,无需再pad端创建, pad端可在情境下添加步骤记录
let config = {
    tableName: "scene",
    columns: [
        { name: "guid", type: "VARCHAR(50)", ext: "PRIMARY KEY" }, //唯一ID
        { name: "foreign_id", type: "VARCHAR(50)", ext: "NOT NULL" }, //关联的主数据ID  关联基础信息
        { name: "name", type: "VARCHAR(50)", ext: "NOT NULL" }, //场景/事件/概况
        { name: "start_time", type: "INT" }, //初始事件引出时间
        { name: "end_time", type: "INT" }, //事件结束时间
        { name: "team_name", type: "VARCHAR(50)" }, // 班组名称
        // { name: "desc", type: "VARCHAR(250)" }, // 概况
        { name: "project_id", type: "VARCHAR(50)" }, //所属项目ID 
        { name: "created_at", type: "INT" }, //任务创建时间
        { name: "created_by", type: "VARCHAR(50)" }, //创建人
        { name: "updated_at", type: "INT" }, //修改人
        { name: "updated_by", type: "VARCHAR(50)" }, //修改时间
        { name: "delete_flag", type: "INT", ext: " DEFAULT 0 " }
    ]
}
class Service extends BaseService {
    getFormItems() {
        return [
            { name: '场景/事件/概况', field: 'name', datatype: 'string', type: 'text' },
            { name: '初始事件引出时间', field: 'start_time', datetype: 'hour-minute', type: 'datepicker' },
            { name: '事件结束时间', field: 'end_time', datetype: 'hour-minute', type: 'datepicker' },
            { name: '班组名称', field: 'team_name', datatype: 'string', type: 'text' }
            // { name: '简述', field: 'desc', datatype: 'string', type: 'text' }
        ]
    }

    autoInput(data) {
        let num = (Math.random() + '').replace('.', '').substr(0, 4);
        Object.assign(data, {
            name: '场景名称' + num,
            start_time: '12:23',
            end_time: '20:21',
            team_name: '电焊组'
        })
    }
}
const service = new Service(config)
export default service;