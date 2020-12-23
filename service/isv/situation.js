import constants from '../../common/constants'
import BaseService from '../base'

//情境信息表  数据需要从HRA模块同步过来,无需再pad端创建, pad端可在情境下添加步骤记录
let config = {
    tableName: "situation",
    columns: [
        { name: "guid", type: "VARCHAR(50)", ext: "PRIMARY KEY" }, //唯一ID
        { name: "name", type: "VARCHAR(50)", ext: "NOT NULL" }, //情境名称   
        { name: "code", type: "VARCHAR(50)" }, //情境编码
        { name: "type", type: "VARCHAR(50)" }, //情境类型
        { name: "role", type: "VARCHAR(50)" }, // 角色
        { name: "descrip", type: "VARCHAR(200)" }, // 情境简述
        { name: "project_id", type: "VARCHAR(50)" }, //所属项目ID
        { name: "created_at", type: "INT" }, //任务创建时间
        { name: "created_by", type: "VARCHAR(50)" }, //创建人
        { name: "updated_at", type: "INT" }, //修改人
        { name: "updated_by", type: "VARCHAR(50)" }, //修改时间
        { name: "delete_flag", type: "INT", ext: " DEFAULT 0 " }
    ],
    datas: [

    ],
}
class Service extends BaseService {

    getFormItems() {
        return [
            { name: '情境名称', field: 'name', datatype: 'string', type: 'text', required: true },
            { name: '情境编码', field: 'code', datatype: 'string', type: 'text', required: true },
            { name: '情境类型', field: 'type', datatype: 'string', type: 'text' },
            { name: '角色', field: 'role', datatype: 'string', type: 'text' },
            { name: '情境简述', field: 'descrip', datatype: 'string', type: 'text-media', css: 'long-col' }
        ]
    }


    autoInput(data) {
        let num = (Math.random() + '').replace('.', '').substr(0, 4);
        Object.assign(data, {
            name: '热态设备' + num,
            code: 'GUID' + num,
            type: '事故',
            role: 'SRO',
            descrip: '我是情境简述....'
        })
    }
}
const service = new Service(config)
export default service;