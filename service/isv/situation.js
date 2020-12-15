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
        { name: "desc", type: "VARCHAR(200)" }, // 情境简述
        { name: "project_id", type: "VARCHAR(50)" } //所属项目ID
    ],
    datas: [
        { guid: 'GUID001', name: '热态设备1', code: 'MN001', type: '事故', role: 'SRO', desc: '我是情境简述' },
        { guid: 'GUID002', name: '热态设备2', code: 'MN002', type: '事故', role: 'SRO', desc: '我是情境简述' },
        { guid: 'GUID003', name: '热态设备3', code: 'MN003', type: '启停堆', role: 'SRO', desc: '我是情境简述' },
        { guid: 'GUID004', name: '热态设备4', code: 'MN004', type: '启停堆', role: 'SRO', desc: '我是情境简述' },
        { guid: 'GUID005', name: '热态设备5', code: 'MN005', type: '功率控制', role: 'SRO', desc: '我是情境简述' },
        { guid: 'GUID006', name: '热态设备6', code: 'MN006', type: '功率控制', role: 'SRO', desc: '我是情境简述' },
        { guid: 'GUID007', name: '热态设备7', code: 'MN007', type: '功率控制', role: 'SRO', desc: '我是情境简述' },
        { guid: 'GUID008', name: '热态设备8', code: 'MN008', type: '大修', role: 'SRO', desc: '我是情境简述' },
        { guid: 'GUID009', name: '热态设备9', code: 'MN009', type: '大修', role: 'SRO', desc: '我是情境简述' },
        { guid: 'GUID011', name: '热态设备10', code: 'MN0010', type: '大修', role: 'SRO', desc: '我是情境简述' }
    ]
}
class Service extends BaseService {}
const service = new Service(config)
export default service;