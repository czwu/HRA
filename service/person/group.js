import constants from '../../common/constants'
import util from '../../common/util'
import BaseService from '../base'

let config = {
    tableName: "TGroup",
    columns: [
        { name: "guid", type: "VARCHAR(50)", ext: "PRIMARY KEY" },
        { name: "name", type: "VARCHAR(50)", ext: "NOT NULL" },
        { name: "custom", type: "INT", ext: "DEFAULT 0" },
        { name: "project_id", type: "VARCHAR(50)", ext: "NULL" },
        { name: "created_at", type: "INT", ext: "NULL" },
        { name: "created_by", type: "VARCHAR(50)", ext: "NULL" },
        { name: "updated_at", type: "INT", ext: "NULL" },
        { name: "updated_by", type: "VARCHAR(50)", ext: "NULL" },
        { name: "delete_flag", type: "INT", ext: " DEFAULT 0 " }
    ]
}
class GroupService extends BaseService {

    remove(guid) {
        let time = Date.now(),
            userName = util.getUserName();
        let delSqls = [`UPDATE ${this.tableName} SET delete_flag = '1', updated_at = ${time}, updated_by = '${userName}' WHERE GUID = '${guid}'`];
        delSqls.push(`UPDATE TDept SET delete_flag = '1', updated_at = ${time}, updated_by = '${userName}' WHERE group_guid = '${guid}'`)
        delSqls.push(`UPDATE TJob SET delete_flag = '1', updated_at = ${time}, updated_by = '${userName}' WHERE dept_guid IN (Select guid from TDept where  group_guid ='${guid}')`)
        return new Promise((resolve, reject) => {
            this.executeSql(delSqls, resolve, reject)
        })
    }

    initDefaultGroups() {
        return new Promise((resolve, reject) => {
            this.insertList([{ guid: this.genGuid(), name: '日常人员配置' }, { guid: this.genGuid(), name: '运行班组' }, { guid: this.genGuid(), name: '应急人员' }], 'multi').then((e) => {
                resolve(e)
            })
        })
    }
}
const groupService = new GroupService(config)
export default groupService