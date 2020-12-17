import constants from '../../common/constants'
import util from '../../common/util';
import BaseService from '../base'

//情景问题表
let config = {
    tableName: "situation_issue",
    columns: [
        { name: "guid", type: "VARCHAR(50)", ext: "PRIMARY KEY" }, //唯一ID
        { name: "foreign_id", type: "VARCHAR(50)", ext: "NOT NULL" }, //关联的主数据ID  情境版本步骤guid
        { name: "code", type: "VARCHAR(50)" }, //问题编号
        { name: "descrip", type: "VARCHAR(100)" }, //问题描述'
        { name: "tester", type: "VARCHAR(50)" }, //测试者
        { name: "implementer", type: "VARCHAR(50)" }, //实施者
        { name: "type", type: "VARCHAR(50)" }, //问题分类 需要基础数据
        { name: "plain", type: "VARCHAR(200)" }, //问题方案
        { name: "hed", type: "VARCHAR(100)" }, //人因偏差
        { name: "document", type: "VARCHAR(100)" }, //相关文件
        { name: "remark", type: "VARCHAR(100)" }, //备注
        { name: "project_id", type: "VARCHAR(50)" }, //所属项目ID
        { name: "created_at", type: "INT" }, //任务创建时间
        { name: "created_by", type: "VARCHAR(50)" }, //创建人
        { name: "updated_at", type: "INT" }, //修改人
        { name: "updated_by", type: "VARCHAR(50)" }, //修改时间
        { name: "delete_flag", type: "INT", ext: " DEFAULT 0 " }
    ],
    datas: [],
    guidPrefix: "issue_",
}
class Service extends BaseService {
    getFormItems() {
        return [
            { name: '问题编号', field: 'code', datatype: 'string', type: 'text', required: true },
            { name: '问题描述', field: 'descrip', datatype: 'string', type: 'text-media', required: true, css: 'long-col' },
            { name: '测试者', field: 'tester', datatype: 'string', type: 'text', defaultValue: util.getUserName(), disabled: true },
            { name: '实施者', field: 'implementer', datatype: 'string', type: 'text' },
            { name: '问题分类', field: 'type', datatype: 'string', type: 'text' },
            { name: 'HED(人员偏差)', field: 'hed', datatype: 'string', type: 'switch', values: ['否', '是'], defaultValue: '否' },
            { name: '问题方案', field: 'plain', datatype: 'string', type: 'textarea', css: 'long-col row-textarea' },
            { name: '相关文件', field: 'document', datatype: 'string', type: 'file', css: 'long-col ' },
            { name: '备注', field: 'remark', datatype: 'string', type: 'text-media', css: 'long-col' }
        ]
    }


    autoInput(data) {
        let num = (Math.random() + '').replace('.', '').substr(0, 4);
        Object.assign(data, {
            code: 'REQ_' + num,
            descrip: '我是问题描述!',
            implementer: 'zhangqiling',
            plain: '我是问题方案....'
        })
    }
}
const service = new Service(config)
export default service;