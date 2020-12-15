import constants from '../../common/constants'
import BaseService from '../base'

let config = {
    tableName: "regulation",
    columns: [
        { name: "guid", type: "VARCHAR(50)", ext: "PRIMARY KEY" }, //唯一ID
        { name: "code", type: "VARCHAR(50)", ext: "NOT NULL" }, //规程编码
        { name: "name", type: "VARCHAR(50)", ext: "NOT NULL" }, //规程名称
        { name: "type", type: "VARCHAR(50)", ext: "NOT NULL" }, //规程类型
        { name: "malfunction_type", type: "VARCHAR(50)" }, //相关事故
        { name: "project_id", type: "VARCHAR(50)" } //所属项目ID 
    ],
}
class Service extends BaseService {

}
const service = new Service(config)
export default service;