import util from '../../common/util.js'
import constants from '../../common/constants'
import BaseService from '../base'

let config = {
    tableName: "TPerson",
    columns: [
        { name: "guid", type: "VARCHAR(50)", ext: "PRIMARY KEY" },
        { name: "jobGuid", type: "VARCHAR(50)", ext: "NOT NULL" },
        { name: "name", type: "VARCHAR(50)", ext: "NOT NULL" },
        { name: "code", type: "VARCHAR(50)", ext: "" },
        { name: "age", type: "INT", ext: "" }, //年龄
        { name: "job", type: "VARCHAR(255)", ext: "" }, //职务
        { name: "duty", type: "VARCHAR(255)", ext: "" }, //职责
        { name: "workSeniority", type: "INT", ext: "" },
        { name: "jobSeniority", type: "INT", ext: "" },
        { name: "project_id", type: "INT", ext: "" },
        { name: "created_at", type: "INT", ext: "" },
        { name: "created_by", type: "VARCHAR(50)", ext: "" },
        { name: "updated_at", type: "INT", ext: "" },
        { name: "updated_by", type: "VARCHAR(50)", ext: "" },
        { name: "delete_flag", type: "INT", ext: " DEFAULT 0 " }
    ],
    datas: [
        ['USER_LmnSOf9Mox2iH2xx', 'JOB_SmBfQwEc49Q5dEnZ', '李仁义', 'T0023', 45, '值长', '职责描述..', 23, 13, 'PROJECT_001'],
        ['USER_hUKjlStx0iXXA8HD', 'JOB_SmBfQwEc49Q5dEnZ', '张雪莉', 'T1941', 23, '操作员', '职责描述..', 3, 2, 'PROJECT_001'],
        ['USER_JQg8pK1Mr0dZQFl3', 'JOB_SmBfQwEc49Q5dEnZ', '王旭', 'T0920', 38, '操作员', '职责描述..', 16, 6, 'PROJECT_001'],
        ['USER_AQg8pK1Mr0dZQF99', 'JOB_uBuW6bWyTr7LeC1g', '张琳', 'T1024', 28, '操作员', '职责描述..', 6, 3, 'PROJECT_001']
    ],
    guidPrefix: "USER_"
}
class PersonService extends BaseService {}
const personService = new PersonService(config)
export default personService;