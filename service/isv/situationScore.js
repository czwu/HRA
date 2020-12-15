import constants from '../../common/constants'
import BaseService from '../base'

//情景评分表
let config = {
    tableName: "situation_score",
    columns: [
        { name: "guid", type: "VARCHAR(50)", ext: "PRIMARY KEY" }, //唯一ID
        { name: "foreign_id", type: "VARCHAR(50)", ext: "NOT NULL" }, //关联的主数据ID  
        { name: "answer1", type: "VARCHAR(500)" }, //问题1答案
        { name: "answer2", type: "VARCHAR(500)" }, //问题2答案
        { name: "score_type", type: "INT" }, // 打分选项类型类型 1:工作负荷NASA TLX等级分数, 2:3D SART等级分数
        { name: "score_1", type: "INT" }, // NASA TLX 等级分数 从低到高
        { name: "score_2", type: "INT" }, // 
        { name: "score_3", type: "INT" },
        { name: "score_4", type: "INT" },
        { name: "score_5", type: "INT" },
        { name: "score_6", type: "INT" },
        { name: "score_total", type: "INT" }, // 总分
        { name: "tester_opinion", type: "INT" }, // 测试人员其他意见
        { name: "project_id", type: "VARCHAR(50)" }, //所属项目ID
        { name: "created_at", type: "INT" }, //任务创建时间
        { name: "created_by", type: "VARCHAR(50)" }, //创建人
        { name: "updated_at", type: "INT" }, //修改人
        { name: "updated_by", type: "VARCHAR(50)" }, //修改时间
        { name: "delete_flag", type: "INT", ext: " DEFAULT 0 " }
    ],
    datas: [],
    guidPrefix: "score_"

}
class Service extends BaseService {

}
const service = new Service(config)
export default service;