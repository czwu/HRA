import constants from '../common/constants'
import util from '../common/util'
import BaseService from './base'


let config = {
    tableName: "Dict", //数据字典表
    columns: [
        { name: "guid", type: "VARCHAR(50)", ext: "PRIMARY KEY" },
        { name: "type", type: "VARCHAR(50)", ext: "" }, //数据类别
        { name: "value", type: "VARCHAR(50)", ext: "NOT NULL" }, //值
        { name: "parent", type: "VARCHAR(50)", ext: "NOT NULL" }, //父类值
        { name: "created_at", type: "INT", ext: "" },
        { name: "created_by", type: "VARCHAR(50)", ext: "" },
        { name: "updated_at", type: "INT", ext: "" },
        { name: "updated_by", type: "VARCHAR(50)", ext: "" },
        { name: "delete_flag", type: "INT", ext: " DEFAULT 0 " }
    ],
    datas: [
        //文件类型
        [util.uuid(16), constants.DICT_TYPE.FOLDER_TYPE, '维修'],
        [util.uuid(16), constants.DICT_TYPE.FOLDER_TYPE, '行政隔离'],
        [util.uuid(16), constants.DICT_TYPE.FOLDER_TYPE, '巡检'],
        [util.uuid(16), constants.DICT_TYPE.FOLDER_TYPE, '定期试验'],
        [util.uuid(16), constants.DICT_TYPE.FOLDER_TYPE, '标定和定值'],
        [util.uuid(16), constants.DICT_TYPE.FOLDER_TYPE, '规程体系'],
        [util.uuid(16), constants.DICT_TYPE.FOLDER_TYPE, '报警文件'],
        [util.uuid(16), constants.DICT_TYPE.FOLDER_TYPE, '应急'],
        [util.uuid(16), constants.DICT_TYPE.FOLDER_TYPE, '培训'],
        //任务阶段
        [util.uuid(16), constants.DICT_TYPE.TASK_STAGE, 'PSAR阶段'],
        [util.uuid(16), constants.DICT_TYPE.TASK_STAGE, 'FSAR阶段'],
        [util.uuid(16), constants.DICT_TYPE.TASK_STAGE, '运行阶段'],
        //人因类别
        [util.uuid(16), constants.DICT_TYPE.TASK_HTYPE, 'A类'],
        [util.uuid(16), constants.DICT_TYPE.TASK_HTYPE, 'B类'],
        [util.uuid(16), constants.DICT_TYPE.TASK_HTYPE, 'C类'],
        [util.uuid(16), constants.DICT_TYPE.TASK_HTYPE, 'A类相关性'],
        [util.uuid(16), constants.DICT_TYPE.TASK_HTYPE, 'C类相关性'],
        //分析范围
        [util.uuid(16), constants.DICT_TYPE.TASK_ANALYSIS_SCOPE, '内部水淹'],
        [util.uuid(16), constants.DICT_TYPE.TASK_ANALYSIS_SCOPE, '内部火灾'],
        [util.uuid(16), constants.DICT_TYPE.TASK_ANALYSIS_SCOPE, '外部水淹'],
        [util.uuid(16), constants.DICT_TYPE.TASK_ANALYSIS_SCOPE, '外部火灾'],
        [util.uuid(16), constants.DICT_TYPE.TASK_ANALYSIS_SCOPE, '地震'],
        [util.uuid(16), constants.DICT_TYPE.TASK_ANALYSIS_SCOPE, '其他'],
        //任务级别
        [util.uuid(16), constants.DICT_TYPE.TASK_LEVEL, '一级'],
        [util.uuid(16), constants.DICT_TYPE.TASK_LEVEL, '二级'],
        //工况类别
        [util.uuid(16), constants.DICT_TYPE.WORKING_CONDITION_TYPE, '功率运行'],
        [util.uuid(16), constants.DICT_TYPE.WORKING_CONDITION_TYPE, '停堆运行'],
        //人员选择
        [util.uuid(16), constants.DICT_TYPE.USER_SELECT, '张娜娜'],
        [util.uuid(16), constants.DICT_TYPE.USER_SELECT, '刘亦菲'],
        [util.uuid(16), constants.DICT_TYPE.USER_SELECT, '马云'],
        [util.uuid(16), constants.DICT_TYPE.USER_SELECT, '张磊'],
        [util.uuid(16), constants.DICT_TYPE.USER_SELECT, '马化腾']
    ],
    guidPrefix: ""
}
const dictService = new BaseService(config)
export default dictService