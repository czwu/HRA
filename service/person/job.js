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
        { name: "descrip", type: "VARCHAR(255)", ext: "" }, //岗位描述
        { name: "project_id", type: "VARCHAR(50)", ext: "" },
        { name: "file_path", type: "VARCHAR(255)", ext: "" }, //文件地址
        { name: "created_at", type: "INT", ext: "" },
        { name: "created_by", type: "VARCHAR(50)", ext: "" },
        { name: "updated_at", type: "INT", ext: "" },
        { name: "updated_by", type: "VARCHAR(50)", ext: "" },
        { name: "delete_flag", type: "INT", ext: " DEFAULT 0 " }
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
            { name: '相关文件', field: 'file_path', datatype: 'string', type: "file", css: 'long-col' },
            { name: '岗位描述', field: 'descrip', datatype: 'string', type: 'text', css: 'long-col' }
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
            descrip: '我是岗位描述信息....'
        })
    }
}
const jobService = new JobService(config)
export default jobService