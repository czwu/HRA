import constants from '../../common/constants'
import BaseService from '../base'

let config = {
    tableName: "regulation_item",
    columns: [
        { name: "guid", type: "VARCHAR(50)", ext: "PRIMARY KEY" }, //唯一ID
        { name: "regulation_code", type: "VARCHAR(50)", ext: "NOT NULL" }, //规程编码
        { name: "step_name", type: "VARCHAR(50)", ext: "NOT NULL" }, //步骤名
        { name: "step_num", type: "VARCHAR(50)", ext: "NOT NULL" }, //步骤号
        { name: "action_code", type: "VARCHAR(50)" }, //预期相应编号
        { name: "action_title", type: "VARCHAR(50)" }, //预期相应
        { name: "action_time", type: "VARCHAR(50)" }, //预期相应执行时间
        { name: "unexpected_action_code", type: "VARCHAR(50)" }, //非预期相应编号
        { name: "unexpected_action_title", type: "VARCHAR(50)" }, //非预期相应
        { name: "unexpected_action_time", type: "VARCHAR(50)" }, //非预期相应执行时间
        { name: "action_type", type: "VARCHAR(50)" }, //动作类型
        { name: "behavior_model_stage", type: "VARCHAR(50)" }, //行为模型阶段
        { name: "team", type: "VARCHAR(50)" }, //操作班组
        { name: "project_id", type: "VARCHAR(50)" } //所属项目ID 
    ],
}
class Service extends BaseService {

}
const service = new Service(config)
export default service;