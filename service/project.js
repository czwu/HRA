import constants from '../common/constants'
import BaseService from './base'
let config = {
    tableName: "TProject",
    columns: [
        { name: "projectid", type: "INT", ext: "PRIMARY KEY" },
        { name: "code", type: "VARCHAR(50)", ext: "" },
        { name: "name", type: "VARCHAR(50)", ext: "NOT NULL" }
    ],
    datas: [
        [100, 'PROJECT_001', '福清核电站'],
        [101, 'PROJECT_002', '田湾核电站'],
        [102, 'PROJECT_003', '徐大堡核电站']
    ]
}
const projectInstance = new BaseService(config)
export default projectInstance