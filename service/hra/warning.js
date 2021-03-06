import constants from '../../common/constants'
import BaseService from '../base'

//报警信息表
let config = {
    tableName: "Warning",
    columns: [
        { name: "guid", type: "VARCHAR(50)", ext: "PRIMARY KEY" }, //唯一ID
        { name: "foreign_id", type: "VARCHAR(50)", ext: "NOT NULL" }, //关联的主数据ID   => 关联 A类主数据或C类主数据 的GUID
        { name: "code", type: "VARCHAR(50)", ext: "NOT NULL" }, //报警编码
        { name: "device_code", type: "VARCHAR(50)" }, //相关设备编码
        { name: "position", type: "VARCHAR(50)" }, //位置
        { name: "level", type: "VARCHAR(10)" }, //报警级别
        { name: "descrip", type: "VARCHAR(500)" }, //报警描述
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
class Service extends BaseService {
    getFormItems() {
        return [
            { name: '报警编码', field: 'code', datatype: 'string', type: 'text', required: true },
            { name: '报警描述', field: 'descrip', datatype: 'string', type: 'text' },
            { name: '位置', field: 'position', datatype: 'string', type: 'text' },
            { name: '相关设备编码', field: 'device_code', datatype: 'string', type: 'text', required: true },
            { name: '报警级别', field: 'level', datatype: 'string', type: 'selector', values: ['W', 'P', 'R', 'Y', 'G'] }
        ]
    }
    getTableItems() {
        return [
            { name: '报警编码', field: 'code', width: '15%' },
            { name: '报警描述', field: 'descrip', width: '40%' },
            { name: '位置', field: 'position', width: '10%' },
            { name: '相关设备编码', field: 'device_code', width: '15%' },
            { name: '报警级别', field: 'level', css: 'center', width: '10%', values: ['W', 'P', 'R', 'Y', 'G'], bgcolor: ['#EEE', '#FE55A8', '#FF4242', '#FFE742', '#25CA9D'] }
        ]
    }

    autoInput(data) {
        let num = (Math.random() + '').replace('.', '').substr(0, 5);
        data.code = 'XRS' + num + 'KS';
        data.descrip = '' + num + 'MO 冷却水流量低';
        data.level = 'W';
        data.device_code = 'ESA' + num + 'VB';
        data.position = 'IIC';
    }

}
const service = new Service(config)
export default service;