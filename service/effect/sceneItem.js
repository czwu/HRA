import constants from '../../common/constants'
import BaseService from '../base'

//场景中 失效系统或部件   失效屏蔽  报警或指示
let config = {
    tableName: "scene_item",
    columns: [
        { name: "guid", type: "VARCHAR(50)", ext: "PRIMARY KEY" }, //唯一ID
        { name: "foreign_id", type: "VARCHAR(50)", ext: "NOT NULL" }, //关联的主数据ID  关联基础信息
        { name: "code", type: "VARCHAR(50)", ext: "NOT NULL" }, //设备编号
        { name: "type", type: "INT", ext: "NOT NULL" }, //类型 1 失效系统或部件2 失效/屏蔽  3 报警或指示
        { name: "remark", type: "VARCHAR(500)" }, //初始事件引出时间
        { name: "project_id", type: "VARCHAR(50)" }, //所属项目ID 
        { name: "created_at", type: "INT" }, //任务创建时间
        { name: "created_by", type: "VARCHAR(50)" }, //创建人
        { name: "updated_at", type: "INT" }, //修改人
        { name: "updated_by", type: "VARCHAR(50)" }, //修改时间
        { name: "delete_flag", type: "INT", ext: " DEFAULT 0 " }
    ],
    // rebuild: true
}
class Service extends BaseService {

}
const service = new Service(config)
export default service;