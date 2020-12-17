import constants from '../common/constants'
import BaseService from './base'
//项目 应用表
let config = {
    tableName: "TProject",
    columns: [
        { name: "guid", type: "VARCHAR(50)", ext: "PRIMARY KEY" },
        { name: "projectid", type: "INT" },
        { name: "code", type: "VARCHAR(50)" },
        { name: "name", type: "VARCHAR(50)", ext: "NOT NULL" }
    ],
    datas: [
        ['JIE49483KFJD223', 100, 'PROJECT_001', '福清核电站'],
        ['JIE49483KFJD224', 101, 'PROJECT_002', '田湾核电站'],
        ['JIE49483KFJD225', 102, 'PROJECT_003', '徐大堡核电站']
    ]
}
const projectInstance = new BaseService(config)
export default projectInstance