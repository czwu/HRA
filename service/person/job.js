import constants from '../../common/constants'
import util from '../../common/util'
import BaseService from '../base'

let config = {
    tableName: "TJob",
    columns: [
        { name: "guid", type: "VARCHAR(50)", ext: "PRIMARY KEY" },
        { name: "deptGuid", type: "VARCHAR(50)", ext: "NOT NULL" },
        { name: "name", type: "VARCHAR(50)", ext: "NOT NULL" },
        { name: "code", type: "VARCHAR(50)", ext: "" },
        { name: "type", type: "VARCHAR(50)", ext: "" },
        { name: "num", type: "INT", ext: "" }, //人数
        { name: "worktime", type: "VARCHAR(255)", ext: "" }, //倒班时间
        { name: "duty", type: "VARCHAR(255)", ext: "" }, //职责
        { name: "project_id", type: "INT", ext: "" },
        { name: "filePathsString", type: "VARCHAR(255)", ext: "" }, //文件地址
        { name: "created_at", type: "INT", ext: "" },
        { name: "created_by", type: "VARCHAR(50)", ext: "" },
        { name: "updated_at", type: "INT", ext: "" },
        { name: "updated_by", type: "VARCHAR(50)", ext: "" },
        { name: "delete_flag", type: "INT", ext: " DEFAULT 0 " }
    ],
    datas: [
        ['JOB_SmBfQwEc49Q5dEnZ', 'DEPT_Kd4yFCcYkzi0IZk4', '岗位A', 'CODE_1', 'TYPE_1', 3, '8小时3班倒', '职责描述....', 'PROJECT_001'],
        ['JOB_uBuW6bWyTr7LeC1g', 'DEPT_Kd4yFCcYkzi0IZk4', '岗位B', 'CODE_2', 'TYPE_2', 2, '8小时3班倒', '职责描述....', 'PROJECT_001'],
        ['JOB_UvnsoixfZZAVls4V', 'DEPT_Kd4yFCcYkzi0IZk4', '岗位C', 'CODE_3', 'TYPE_3', 5, '8小时3班倒', '职责描述....', 'PROJECT_001'],
        ['JOB_LBuoMKnNWWtGUvKZ', 'DEPT_g2zNfBtc6WNHu1AQ', '电气科岗', 'CODE_DQ', 'TYPE_3', 2, '8小时3班倒', '职责描述....', 'PROJECT_001'],
        ['JOB_P25bbgoUwY4HSrbo', 'DEPT_ae5sMYvqCkOKTU52', '静机科岗', 'CODE_JJ', 'TYPE_3', 1, '8小时3班倒', '职责描述....', 'PROJECT_001']
    ],
    guidPrefix: "JOB_"
}
class JobService extends BaseService {

    remove(guid) {
        try {
            let time = Date.now(),
                userName = util.getUserName();
            let delSqls = [`UPDATE ${this.tableName} SET delete_flag = '1', updated_at = ${time}, updated_by = '${userName}' WHERE GUID = '${guid}'`];
            delSqls.push(`UPDATE TPerson SET delete_flag = '1', updated_at = ${time}, updated_by = '${userName}' WHERE jobGuid = '${guid}'`)
            return new Promise((resolve, reject) => {
                this.executeSql(delSqls, resolve, reject)
            })
        } catch (e) {
            console.error(e)
        }

    }
}
const jobService = new JobService(config)
export default jobService