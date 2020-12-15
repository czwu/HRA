import constants from '../../common/constants'
import util from '../../common/util'
import BaseService from '../base'

let config = {
    tableName: "TDept",
    columns: [
        { name: "guid", type: "VARCHAR(50)", ext: "PRIMARY KEY" },
        { name: "group_guid", type: "VARCHAR(50)", ext: "NOT NULL" },
        { name: "name", type: "VARCHAR(50)", ext: "NOT NULL" },
        { name: "project_id", type: "VARCHAR(50)", ext: "" },
        { name: "created_at", type: "INT", ext: "" },
        { name: "created_by", type: "VARCHAR(50)", ext: "" },
        { name: "updated_at", type: "INT", ext: "" },
        { name: "updated_by", type: "VARCHAR(50)", ext: "" },
        { name: "delete_flag", type: "INT", ext: " DEFAULT 0 " }

    ],
    datas: [
        ['DEPT_Kd4yFCcYkzi0IZk4', 'GR_iDG7K7EuUu19m5oi', '仪控科', util.getProjectId()],
        ['DEPT_g2zNfBtc6WNHu1AQ', 'GR_iDG7K7EuUu19m5oi', '电气科', util.getProjectId()],
        ['DEPT_ae5sMYvqCkOKTU52', 'GR_iDG7K7EuUu19m5oi', '静机科', util.getProjectId()],
        ['DEPT_MJkSz3OOD1LMKuEB', 'GR_FR5NqiuNFGvZDwBm', '一值', util.getProjectId()],
        ['DEPT_XGXVf9E33bncEkuL', 'GR_FR5NqiuNFGvZDwBm', '二值', util.getProjectId()],
        ['DEPT_oId0G0mFsIkvSwjk', 'GR_FR5NqiuNFGvZDwBm', '三值', util.getProjectId()],
        ['DEPT_Q968fnAppayMbcpM', 'GR_IMfQKktTjY3U5CDq', '厂区应急', util.getProjectId()],
        ['DEPT_6KCrRWzpWqdr2GIb', 'GR_IMfQKktTjY3U5CDq', '厂房A应急', util.getProjectId()],
        ['DEPT_8eZiOKpHpaXTQFG4', 'GR_IMfQKktTjY3U5CDq', '厂房B应急', util.getProjectId()]
    ],
    guidPrefix: "DEPT_"
}

class DeptService extends BaseService {
    remove(guid) {
        let time = Date.now(),
            userName = util.getUserName();
        let delSqls = [`UPDATE ${this.tableName} SET delete_flag = '1', updated_at = ${time}, updated_by = '${userName}' WHERE GUID = '${guid}'`];
        delSqls.push(`UPDATE TJob SET delete_flag = '1', updated_at = ${time}, updated_by = '${userName}' WHERE dept_guid = '${guid}'`)
        delSqls.push(`UPDATE TPerson SET delete_flag = '1', updated_at = ${time}, updated_by = '${userName}' WHERE job_guid IN (Select guid from TJob where  dept_guid ='${guid}')`)
        return new Promise((resolve, reject) => {
            this.executeSql(delSqls, resolve, reject)
        })
    }

    queryTeams() {
        let sql = `select A.name, A.guid from TDept A, TGroup B 
        where A.group_guid = B.guid and B.name='运行班组' and A.delete_flag = 0 and B.project_id='${util.getProjectId()}' `
        return new Promise((resolve, reject) => {
            plus.sqlite.selectSql({
                name: constants.db_name,
                sql: sql,
                success(e) {
                    resolve(e);
                },
                fail(e) {
                    console.error("query Failed!", e)
                    reject(e);
                }
            })
        })
    }
}
const deptService = new DeptService(config)
export default deptService