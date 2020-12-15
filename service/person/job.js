import constants from '../../common/constants'
import util from '../../common/util'
import BaseService from '../base'

let config = {
    tableName: "TJob",
    columns: [
        { name: "guid", type: "VARCHAR(50)", ext: "PRIMARY KEY" },
        { name: "dept_guid", type: "VARCHAR(50)", ext: "NOT NULL" },
        { name: "name", type: "VARCHAR(50)", ext: "NOT NULL" },
        { name: "code", type: "VARCHAR(50)", ext: "" },
        { name: "type", type: "VARCHAR(50)", ext: "" },
        { name: "num", type: "INT", ext: "" }, //人数
        { name: "worktime", type: "VARCHAR(255)", ext: "" }, //倒班时间
        { name: "desc", type: "VARCHAR(255)", ext: "" }, //岗位描述
        { name: "project_id", type: "VARCHAR(50)", ext: "" },
        { name: "file", type: "VARCHAR(255)", ext: "" }, //文件地址
        { name: "created_at", type: "INT", ext: "" },
        { name: "created_by", type: "VARCHAR(50)", ext: "" },
        { name: "updated_at", type: "INT", ext: "" },
        { name: "updated_by", type: "VARCHAR(50)", ext: "" },
        { name: "delete_flag", type: "INT", ext: " DEFAULT 0 " }
    ],
    datas: [
        ['JOB_SmBfQwEc49Q5dEnZ', 'DEPT_Kd4yFCcYkzi0IZk4', '岗位A', 'CODE_1', 'TYPE_1', 3, '8小时3班倒', '职责描述....', util.getProjectId()],
        ['JOB_uBuW6bWyTr7LeC1g', 'DEPT_Kd4yFCcYkzi0IZk4', '岗位B', 'CODE_2', 'TYPE_2', 2, '8小时3班倒', '职责描述....', util.getProjectId()],
        ['JOB_UvnsoixfZZAVls4V', 'DEPT_Kd4yFCcYkzi0IZk4', '岗位C', 'CODE_3', 'TYPE_3', 5, '8小时3班倒', '职责描述....', util.getProjectId()],
        ['JOB_LBuoMKnNWWtGUvKZ', 'DEPT_g2zNfBtc6WNHu1AQ', '电气科岗', 'CODE_DQ', 'TYPE_3', 2, '8小时3班倒', '职责描述....', util.getProjectId()],
        ['JOB_P25bbgoUwY4HSrbo', 'DEPT_ae5sMYvqCkOKTU52', '静机科岗', 'CODE_JJ', 'TYPE_3', 1, '8小时3班倒', '职责描述....', util.getProjectId()]
    ],
    guidPrefix: "JOB_"
}
class JobService extends BaseService {
    getFormItems() {
        return [
            { name: '岗位名称', field: 'name', datatype: 'string', type: 'text', required: true },
            { name: '岗位编码', field: 'code', datatype: 'string', type: 'text', required: true },
            { name: '类别', field: 'type', datatype: 'string', type: 'text' },
            { name: '人数', field: 'num', datatype: 'number', type: 'text', inputIcon: 'iconyunsuanfu' },
            { name: '倒班时间', field: 'worktime', datatype: 'string', type: 'text' },
            { name: '相关文件', field: 'file', datatype: 'string', type: "file", css: 'long-col' },
            { name: '岗位描述', field: 'desc', datatype: 'string', type: 'text', css: 'long-col' }
        ]
    }
    remove(guid) {
        try {
            let time = Date.now(),
                userName = util.getUserName();
            let delSqls = [`UPDATE ${this.tableName} SET delete_flag = '1', updated_at = ${time}, updated_by = '${userName}' WHERE GUID = '${guid}'`];
            delSqls.push(`UPDATE TPerson SET delete_flag = '1', updated_at = ${time}, updated_by = '${userName}' WHERE job_guid = '${guid}'`)
            return new Promise((resolve, reject) => {
                this.executeSql(delSqls, resolve, reject)
            })
        } catch (e) {
            console.error(e)
        }

    }
    autoInput(data) {
        let num = (Math.random() + '').replace('.', '').substr(0, 4);
        Object.assign(data, {
            name: '岗位' + num,
            code: 'C' + num,
            type: '岗位类型',
            num: 5,
            worktime: '八小时三班倒',
            desc: '我是岗位描述信息....'
        })
    }
}
const jobService = new JobService(config)
export default jobService