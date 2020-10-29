import constants from '../../common/constants'
import util from '../../common/util'
import BaseService from '../base'

let config = {
    tableName: "TDept",
    columns: [
        { name: "guid", type: "VARCHAR(50)", ext: "PRIMARY KEY" },
        { name: "groupGuid", type: "VARCHAR(50)", ext: "NOT NULL" },
        { name: "name", type: "VARCHAR(50)", ext: "NOT NULL" },
        { name: "project_id", type: "INT", ext: "" },
        { name: "created_at", type: "INT", ext: "" },
        { name: "created_by", type: "VARCHAR(50)", ext: "" },
        { name: "updated_at", type: "INT", ext: "" },
        { name: "updated_by", type: "VARCHAR(50)", ext: "" },
        { name: "delete_flag", type: "INT", ext: " DEFAULT 0 " }

    ],
    datas: [
        ['DEPT_Kd4yFCcYkzi0IZk4', 'GR_iDG7K7EuUu19m5oi', '仪控科', 'PROJECT_001'],
        ['DEPT_g2zNfBtc6WNHu1AQ', 'GR_iDG7K7EuUu19m5oi', '电气科', 'PROJECT_001'],
        ['DEPT_ae5sMYvqCkOKTU52', 'GR_iDG7K7EuUu19m5oi', '静机科', 'PROJECT_001'],
        ['DEPT_MJkSz3OOD1LMKuEB', 'GR_FR5NqiuNFGvZDwBm', '一值', 'PROJECT_001'],
        ['DEPT_XGXVf9E33bncEkuL', 'GR_FR5NqiuNFGvZDwBm', '二值', 'PROJECT_001'],
        ['DEPT_oId0G0mFsIkvSwjk', 'GR_FR5NqiuNFGvZDwBm', '三值', 'PROJECT_001'],
        ['DEPT_Q968fnAppayMbcpM', 'GR_IMfQKktTjY3U5CDq', '厂区应急', 'PROJECT_001'],
        ['DEPT_6KCrRWzpWqdr2GIb', 'GR_IMfQKktTjY3U5CDq', '厂房A应急', 'PROJECT_001'],
        ['DEPT_8eZiOKpHpaXTQFG4', 'GR_IMfQKktTjY3U5CDq', '厂房B应急', 'PROJECT_001']
    ],
    guidPrefix: "DEPT_"
}

class DeptService extends BaseService {
    remove(guid) {
        let time = Date.now(),
            userName = util.getUserName();
        let delSqls = [`UPDATE ${this.tableName} SET delete_flag = '1', updated_at = ${time}, updated_by = '${userName}' WHERE GUID = '${guid}'`];
        delSqls.push(`UPDATE TJob SET delete_flag = '1', updated_at = ${time}, updated_by = '${userName}' WHERE deptGuid = '${guid}'`)
        delSqls.push(`UPDATE TPerson SET delete_flag = '1', updated_at = ${time}, updated_by = '${userName}' WHERE jobGuid IN (Select guid from TJob where  deptGuid ='${guid}')`)
        return new Promise((resolve, reject) => {
            this.executeSql(delSqls, resolve, reject)
        })
    }
}
const deptService = new DeptService(config)
export default deptService