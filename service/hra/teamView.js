import constants from '../../common/constants'
import BaseService from '../base'

//视图 班组人员视图

class ViewService {
    getTableItems(type) {
        let columns = [
            { name: '岗位', field: 'job', width: '10%' },
            { name: '资质要求', field: 'qr', width: '10%' },
            { name: '职责', field: 'duty', width: '20%' },
            { name: '换班管理', field: 'worktime', width: '15%' },
            // { name: '工作地点', field: 'workplace', width: '15%' },
            { name: '对应人员姓名', field: 'name', width: '15%' },
            { name: '年龄', field: 'age', width: '10%' },
            { name: '工作年限', field: 'work_seniority', width: '10%' },
            { name: '资质', field: 'job_seniority', width: '10%' },
        ]
        return columns
    }
    getTableData({ deptId = '' }) {
        let sql = `select A.name as job,B.duty, A.worktime,B.name,B.age,B.work_seniority,b.job_seniority from TJob A, TPerson B, TDept C 
        where A.dept_guid = C.guid and B.job_guid = A.guid and A.delete_flag = 0 and B.delete_flag = 0 and C.guid='${deptId}'`
        return new Promise((resolve, reject) => {
            plus.sqlite.selectSql({
                name: constants.db_name,
                sql: sql,
                success(e) {
                    console.error('sqlData', e)
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
const service = new ViewService()
export default service;