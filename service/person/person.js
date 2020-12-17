import util from '../../common/util.js'
import constants from '../../common/constants'
import BaseService from '../base'

let config = {
    tableName: "TPerson",
    columns: [
        { name: "guid", type: "VARCHAR(50)", ext: "PRIMARY KEY" },
        { name: "job_guid", type: "VARCHAR(50)", ext: "NOT NULL" },
        { name: "name", type: "VARCHAR(50)", ext: "NOT NULL" },
        { name: "code", type: "VARCHAR(50)", ext: "" },
        { name: "age", type: "INT", ext: "" }, //年龄
        { name: "job", type: "VARCHAR(255)", ext: "" }, //职务
        { name: "duty", type: "VARCHAR(255)", ext: "" }, //职责
        { name: "work_seniority", type: "INT", ext: "" },
        { name: "job_seniority", type: "INT", ext: "" },
        { name: "remark", type: "VARCHAR(200)", ext: "" },
        { name: "project_id", type: "VARCHAR(50)", ext: "" },
        { name: "created_at", type: "INT", ext: "" },
        { name: "created_by", type: "VARCHAR(50)", ext: "" },
        { name: "updated_at", type: "INT", ext: "" },
        { name: "updated_by", type: "VARCHAR(50)", ext: "" },
        { name: "delete_flag", type: "INT", ext: " DEFAULT 0 " }
    ],
    guidPrefix: "USER_"
}
class PersonService extends BaseService {
    getFormItems() {
        let values = [];
        for (let i = 0; i < 100; i++) {
            values.push(i)
        }
        return [
            { name: '姓名', field: 'name', datatype: 'string', type: 'text', required: true },
            { name: '员工编码', field: 'code', datatype: 'string', type: 'text', required: true },
            { name: '职称/职务', field: 'job', datatype: 'string', type: 'text' },
            { name: '年龄', field: 'age', datatype: 'number', type: 'selector', values },
            { name: '工作年限', field: 'work_seniority', datatype: 'number', type: 'selector', values },
            { name: '岗位工作年限', field: 'job_seniority', datatype: 'number', type: 'selector', values },
            { name: '职责', field: 'duty', datatype: 'string', type: 'text', css: 'long-col' },
            { name: '备注', field: 'reamrk', datatype: 'string', type: 'text-media', css: 'long-col' }
        ]
    }

    autoInput(data) {
        let num = (Math.random() + '').replace('.', '').substr(0, 4);
        Object.assign(data, {
            name: '测试人员' + num,
            code: 'P' + num,
            job: '值长',
            age: 30,
            work_seniority: 8,
            job_seniority: 4,
            duty: '我是职责信息....'
        })
    }

    queryJobUsers() {
        // let sql = `select A.* ,B.name as job_name from TPerson A left join TJob B on B.guid = A.job_guid where  
        // B.guid in (select D.guid from Tdept D where D.group_guid in (select G.guid from TGROUP G where G.name='日常人员配置'))
        //  and A.project_id='${util.getProjectId()}' and A.delete_flag = 0 order by job_name `
        let sql = `select A.* ,B.name as job_name from TPerson A left join TJob B on B.guid = A.job_guid 
        where B.dept_guid in (select D.guid from Tdept D where D.group_guid in (select G.guid from TGROUP G where G.name='日常人员配置')) and A.project_id='${util.getProjectId()}'  and A.delete_flag = 0 order by job_name`
        console.log(sql)
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
const personService = new PersonService(config)
export default personService;