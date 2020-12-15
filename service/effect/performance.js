import constants from '../../common/constants'
import BaseService from '../base'

//人员效能->场景->绩效评分
let config = {
    tableName: "performance",
    columns: [
        { name: "guid", type: "VARCHAR(50)", ext: "PRIMARY KEY" }, //唯一ID
        { name: "foreign_id", type: "VARCHAR(50)", ext: "NOT NULL" }, //关联的主数据ID  关联场景
        { name: "level", type: "VARCHAR(10)" }, // 等级   1非常满意 2满意 3有偏差 4不满意
        { name: "inpo", type: "VARCHAR(10)" }, // inpo   1,2,3
        { name: "err_mode", type: "VARCHAR(10)" }, // 失误模型   1,2,3
        { name: "score1", type: "INT" }, //失误原因1 评分
        { name: "answer1", type: "VARCHAR(200)" }, //失误原因1 回答
        { name: "restore1", type: "VARCHAR(200)" }, //失误原因1 人误恢复情况
        { name: "effect1", type: "VARCHAR(200)" }, //失误原因1 人误对核电站的影响
        { name: "measure1", type: "VARCHAR(200)" }, //失误原因1 改进措施和建议
        { name: "document1", type: "VARCHAR(200)" }, //失误原因1 相关文件
        { name: "remark1", type: "VARCHAR(200)" }, //失误原因1 备注
        { name: "score2", type: "INT" }, //失误原因1 评分
        { name: "answer2", type: "VARCHAR(200)" }, //失误原因2 回答
        { name: "restore2", type: "VARCHAR(200)" }, //失误原因2 恢复情况
        { name: "effect2", type: "VARCHAR(200)" }, //失误原因2 人误对核电站的影响
        { name: "measure2", type: "VARCHAR(200)" }, //失误原因2 改进措施和建议
        { name: "document2", type: "VARCHAR(200)" }, //失误原因2 相关文件
        { name: "remark2", type: "VARCHAR(200)" }, //失误原因2 备注
        { name: "type", type: "INT" }, //评分类型 1:综合数据采集  2基于规程任务数据采集
        { name: "project_id", type: "VARCHAR(50)" }, //所属项目ID 
        { name: "created_at", type: "INT" }, //任务创建时间
        { name: "created_by", type: "VARCHAR(50)" }, //创建人
        { name: "updated_at", type: "INT" }, //修改人
        { name: "updated_by", type: "VARCHAR(50)" }, //修改时间
        { name: "delete_flag", type: "INT", ext: " DEFAULT 0 " }
    ],
}
class Service extends BaseService {

}
const service = new Service(config)
export default service;