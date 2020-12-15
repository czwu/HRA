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
        { name: "project_id", type: "VARCHAR(50)", ext: "" },
        { name: "created_at", type: "INT", ext: "" },
        { name: "created_by", type: "VARCHAR(50)", ext: "" },
        { name: "updated_at", type: "INT", ext: "" },
        { name: "updated_by", type: "VARCHAR(50)", ext: "" },
        { name: "delete_flag", type: "INT", ext: " DEFAULT 0 " }
    ],
    datas: [
        ['USER_LmnSOf9Mox2iH2xx', 'JOB_SmBfQwEc49Q5dEnZ', '李仁义', 'T0023', 45, '值长', '职责描述..', 23, 13, util.getProjectId()],
        ['USER_hUKjlStx0iXXA8HD', 'JOB_SmBfQwEc49Q5dEnZ', '张雪莉', 'T1941', 23, '操作员', '职责描述..', 3, 2, util.getProjectId()],
        ['USER_JQg8pK1Mr0dZQFl3', 'JOB_SmBfQwEc49Q5dEnZ', '王旭', 'T0920', 38, '操作员', '职责描述..', 16, 6, util.getProjectId()],
        ['USER_AQg8pK1Mr0dZQF99', 'JOB_uBuW6bWyTr7LeC1g', '张琳', 'T1024', 28, '操作员', '职责描述..', 6, 3, util.getProjectId()]
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
            { name: '职责', field: 'duty', datatype: 'string', type: 'text', css: 'long-col' }
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
}
const personService = new PersonService(config)
export default personService;