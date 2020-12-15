import constants from '../common/constants'
import util from '../common/util'
import BaseService from './base'


let config = {
    tableName: "Dict", //数据字典表
    columns: [
        { name: "guid", type: "VARCHAR(50)", ext: "PRIMARY KEY" },
        { name: "type", type: "VARCHAR(50)", ext: "" }, //数据类别
        { name: "value", type: "VARCHAR(50)", ext: "NOT NULL" }, //值
        { name: "name", type: "VARCHAR(50)", ext: "NOT NULL" }, //值
        { name: "parent", type: "VARCHAR(50)", ext: "NOT NULL" }, //父类值
        { name: "created_at", type: "INT", ext: "" },
        { name: "created_by", type: "VARCHAR(50)", ext: "" },
        { name: "updated_at", type: "INT", ext: "" },
        { name: "updated_by", type: "VARCHAR(50)", ext: "" },
        { name: "delete_flag", type: "INT", ext: " DEFAULT 0 " }
    ],
    datas: [
        //文件类型
        [util.uuid(16), constants.DICT_TYPE.FOLDER_TYPE, '维修', '维修', null],
        [util.uuid(16), constants.DICT_TYPE.FOLDER_TYPE, '行政隔离', '行政隔离', null],
        [util.uuid(16), constants.DICT_TYPE.FOLDER_TYPE, '巡检', '巡检', null],
        [util.uuid(16), constants.DICT_TYPE.FOLDER_TYPE, '定期试验', '定期试验', null],
        [util.uuid(16), constants.DICT_TYPE.FOLDER_TYPE, '标定和定值', '标定和定值', null],
        [util.uuid(16), constants.DICT_TYPE.FOLDER_TYPE, '规程体系', '规程体系', null],
        [util.uuid(16), constants.DICT_TYPE.FOLDER_TYPE, '报警文件', '报警文件', null],
        [util.uuid(16), constants.DICT_TYPE.FOLDER_TYPE, '应急', '应急', null],
        [util.uuid(16), constants.DICT_TYPE.FOLDER_TYPE, '培训', '培训', null],
        //任务阶段
        [util.uuid(16), constants.DICT_TYPE.TASK_STAGE, 'PSAR阶段', 'PSAR阶段', null],
        [util.uuid(16), constants.DICT_TYPE.TASK_STAGE, 'FSAR阶段', 'FSAR阶段', null],
        [util.uuid(16), constants.DICT_TYPE.TASK_STAGE, '运行阶段', '运行阶段', null],
        //人因类别
        [util.uuid(16), constants.DICT_TYPE.TASK_HTYPE, 'A类', 'A类', null],
        [util.uuid(16), constants.DICT_TYPE.TASK_HTYPE, 'C类', 'C类', null],
        [util.uuid(16), constants.DICT_TYPE.TASK_HTYPE, 'A类相关性', 'A类相关性', null],
        [util.uuid(16), constants.DICT_TYPE.TASK_HTYPE, 'C类相关性', 'C类相关性', null],
        //分析范围
        [util.uuid(16), constants.DICT_TYPE.TASK_ANALYSIS_SCOPE, '内部水淹', '内部水淹', null],
        [util.uuid(16), constants.DICT_TYPE.TASK_ANALYSIS_SCOPE, '内部火灾', '内部火灾', null],
        [util.uuid(16), constants.DICT_TYPE.TASK_ANALYSIS_SCOPE, '外部水淹', '外部水淹', null],
        [util.uuid(16), constants.DICT_TYPE.TASK_ANALYSIS_SCOPE, '外部火灾', '外部火灾', null],
        [util.uuid(16), constants.DICT_TYPE.TASK_ANALYSIS_SCOPE, '地震', '地震', null],
        [util.uuid(16), constants.DICT_TYPE.TASK_ANALYSIS_SCOPE, '其他', '其他', null],
        //任务级别
        [util.uuid(16), constants.DICT_TYPE.TASK_LEVEL, '一级', '一级', null],
        [util.uuid(16), constants.DICT_TYPE.TASK_LEVEL, '二级', '二级', null],
        //工况类别
        [util.uuid(16), constants.DICT_TYPE.WORKING_CONDITION_TYPE, '功率运行', '功率运行', null],
        [util.uuid(16), constants.DICT_TYPE.WORKING_CONDITION_TYPE, '停堆运行', '停堆运行', null],

        //人员选择
        [util.uuid(16), constants.DICT_TYPE.USER_SELECT, '张娜娜', '张娜娜', null],
        [util.uuid(16), constants.DICT_TYPE.USER_SELECT, '刘亦菲', '刘亦菲', null],
        [util.uuid(16), constants.DICT_TYPE.USER_SELECT, '马云', '马云', null],
        [util.uuid(16), constants.DICT_TYPE.USER_SELECT, '张磊', '张磊', null],
        [util.uuid(16), constants.DICT_TYPE.USER_SELECT, '马化腾', '马化腾', null],

    ],
    guidPrefix: "",
    feature: { orderby: ' order by value asc' }
}
const dictService = new BaseService(config)
export default dictService

//行为模型阶段 [探查 识别 诊断 操作]