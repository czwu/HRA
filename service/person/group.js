import constants from '../../common/constants'
import util from '../../common/util'
import BaseService from '../base'

let config = {
    tableName: "TGroup",
    columns: [
        { name: "guid", type: "VARCHAR(50)", ext: "PRIMARY KEY" },
        { name: "name", type: "VARCHAR(50)", ext: "NOT NULL" },
        { name: "custom", type: "INT", ext: "DEFAULT 0" },
        { name: "project_id", type: "INT", ext: "NULL" },
        { name: "created_at", type: "INT", ext: "NULL" },
        { name: "created_by", type: "VARCHAR(50)", ext: "NULL" },
        { name: "updated_at", type: "INT", ext: "NULL" },
        { name: "updated_by", type: "VARCHAR(50)", ext: "NULL" },
        { name: "delete_flag", type: "INT", ext: " DEFAULT 0 " }

    ],
    datas: [
        ['GR_iDG7K7EuUu19m5oi', '日常人员配置', 0, 'PROJECT_001', Date.now() / 1000],
        ['GR_FR5NqiuNFGvZDwBm', '运行班组', 0, 'PROJECT_001', Date.now() / 1000 + 10],
        ['GR_IMfQKktTjY3U5CDq', '应急人员', 0, 'PROJECT_001', Date.now() / 1000 + 20],
        ['GR_HB5jyPuXsDNmZVm9', '日常人员配置', 0, 'PROJECT_002', Date.now() / 1000 + 30],
        ['GR_yUdtF9lxdBHjwweH', '运行班组', 0, 'PROJECT_002', Date.now() / 1000 + 40],
        ['GR_bfZSWjCv68IGRQMU', '应急人员', 0, 'PROJECT_002', Date.now() / 1000 + 50],
        ['GR_HB5jyPuXs55ZVm91', '日常人员配置', 0, 'PROJECT_003', Date.now() / 1000 + 30],
        ['GR_yUdtF9l6dBHjwweH', '运行班组', 0, 'PROJECT_003', Date.now() / 1000 + 40]
    ],
    guidPrefix: "GR_"
}
class GroupService extends BaseService {

    remove(guid) {
        let time = Date.now(),
            userName = util.getUserName();
        let delSqls = [`UPDATE ${this.tableName} SET delete_flag = '1', updated_at = ${time}, updated_by = '${userName}' WHERE GUID = '${guid}'`];
        delSqls.push(`UPDATE TDept SET delete_flag = '1', updated_at = ${time}, updated_by = '${userName}' WHERE groupGuid = '${guid}'`)
        delSqls.push(`UPDATE TJob SET delete_flag = '1', updated_at = ${time}, updated_by = '${userName}' WHERE deptGuid IN (Select guid from TDept where  groupGuid ='${guid}')`)
        return new Promise((resolve, reject) => {
            this.executeSql(delSqls, resolve, reject)
        })
    }
}
const groupService = new GroupService(config)
export default groupService