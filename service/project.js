import constants from '../common/constants'
import BaseService from './base'
//项目 应用表
let config = {
    tableName: "TProject",
    columns: [
        { name: "guid", type: "VARCHAR(50)", ext: "PRIMARY KEY" },
        { name: "projectid", type: "INT" },
        { name: "code", type: "VARCHAR(50)" },
        { name: "name", type: "VARCHAR(50)", ext: "NOT NULL" },
        { name: "init", type: "INT" }, //是否已经初始化(同步过pc数据)
        { name: "init_time", type: "INT" } //用于记录该项目上次初始化的时间(同步PC端数据数据)
    ]
}
const projectInstance = new BaseService(config)
export default projectInstance