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
        { name: "sort_no", type: "INT" }, //sort 排序
        { name: "created_at", type: "INT", ext: "" },
        { name: "created_by", type: "VARCHAR(50)", ext: "" },
        { name: "updated_at", type: "INT", ext: "" },
        { name: "updated_by", type: "VARCHAR(50)", ext: "" },
        { name: "delete_flag", type: "INT", ext: " DEFAULT 0 " }
    ],
    //当该处数据都可以从global中获取后, 需要移除datas中的数据,
    datas: [
        //文件类型
        [util.uuid(16), constants.DICT_TYPE.FOLDER_TYPE, '维修', '维修', null, 1],
        [util.uuid(16), constants.DICT_TYPE.FOLDER_TYPE, '行政隔离', '行政隔离', null, 2],
        [util.uuid(16), constants.DICT_TYPE.FOLDER_TYPE, '巡检', '巡检', null, 3],
        [util.uuid(16), constants.DICT_TYPE.FOLDER_TYPE, '定期试验', '定期试验', null, 4],
        [util.uuid(16), constants.DICT_TYPE.FOLDER_TYPE, '标定和定值', '标定和定值', null, 5],
        [util.uuid(16), constants.DICT_TYPE.FOLDER_TYPE, '规程体系', '规程体系', null, 6],
        [util.uuid(16), constants.DICT_TYPE.FOLDER_TYPE, '报警文件', '报警文件', null, 7],
        [util.uuid(16), constants.DICT_TYPE.FOLDER_TYPE, '应急', '应急', null, 8],
        [util.uuid(16), constants.DICT_TYPE.FOLDER_TYPE, '培训', '培训', null, 9],
        //任务阶段
        [util.uuid(16), constants.DICT_TYPE.TASK_STAGE, 'PSAR阶段', 'PSAR阶段', null, 1],
        [util.uuid(16), constants.DICT_TYPE.TASK_STAGE, 'FSAR阶段', 'FSAR阶段', null, 2],
        [util.uuid(16), constants.DICT_TYPE.TASK_STAGE, '运行阶段', '运行阶段', null, 3],
        //人因类别
        [util.uuid(16), constants.DICT_TYPE.TASK_HTYPE, 'A类', 'A类', null, 1],
        [util.uuid(16), constants.DICT_TYPE.TASK_HTYPE, 'C类', 'C类', null, 2],
        [util.uuid(16), constants.DICT_TYPE.TASK_HTYPE, 'A类相关性', 'A类相关性', null, 3],
        [util.uuid(16), constants.DICT_TYPE.TASK_HTYPE, 'C类相关性', 'C类相关性', null, 4],
        //分析范围
        [util.uuid(16), constants.DICT_TYPE.TASK_ANALYSIS_SCOPE, '内部水淹', '内部水淹', null, 1],
        [util.uuid(16), constants.DICT_TYPE.TASK_ANALYSIS_SCOPE, '内部火灾', '内部火灾', null, 2],
        [util.uuid(16), constants.DICT_TYPE.TASK_ANALYSIS_SCOPE, '外部水淹', '外部水淹', null, 3],
        [util.uuid(16), constants.DICT_TYPE.TASK_ANALYSIS_SCOPE, '外部火灾', '外部火灾', null, 4],
        [util.uuid(16), constants.DICT_TYPE.TASK_ANALYSIS_SCOPE, '地震', '地震', null, 5],
        [util.uuid(16), constants.DICT_TYPE.TASK_ANALYSIS_SCOPE, '乏地', '乏地', null, 6],
        [util.uuid(16), constants.DICT_TYPE.TASK_ANALYSIS_SCOPE, '内部事件', '内部事件', null, 7],
        //任务级别
        [util.uuid(16), constants.DICT_TYPE.TASK_LEVEL, '一级', '一级', null, 1],
        [util.uuid(16), constants.DICT_TYPE.TASK_LEVEL, '二级', '二级', null, 2],
        //工况类别
        [util.uuid(16), constants.DICT_TYPE.WORKING_CONDITION_TYPE, '功率运行工况', '功率运行工况', null, 1],
        [util.uuid(16), constants.DICT_TYPE.WORKING_CONDITION_TYPE, '低功率和停堆工况', '低功率和停堆工况', null, 2],

        //筛选原则
        [util.uuid(16), constants.DICT_TYPE.FILTER_REASON, '反应堆在正常运行过程中投运的系统或设备', '反应堆在正常运行过程中投运的系统或设备', null, 1],
        [util.uuid(16), constants.DICT_TYPE.FILTER_REASON, '主控室报警信号', '主控室报警信号', null, 2],
        [util.uuid(16), constants.DICT_TYPE.FILTER_REASON, '阀值继电器T1试验', '阀值继电器T1试验', null, 3],
        [util.uuid(16), constants.DICT_TYPE.FILTER_REASON, '存在有效的行政隔离手段确保设备状态', '存在有效的行政隔离手段确保设备状态', null, 4],
        [util.uuid(16), constants.DICT_TYPE.FILTER_REASON, '系统要求时存在自动保护信号恢复设备状态', '系统要求时存在自动保护信号恢复设备状态', null, 5],
        [util.uuid(16), constants.DICT_TYPE.FILTER_REASON, '可能导致某些人误出现的因素对于某个部件或设备来说不存在', '可能导致某些人误出现的因素对于某个部件或设备来说不存在', null, 6],
        [util.uuid(16), constants.DICT_TYPE.FILTER_REASON, '人误的发生不会造成任何严重后果或可以被立即恢复', '人误的发生不会造成任何严重后果或可以被立即恢复', null, 7],

    ],
    guidPrefix: "",
    feature: { orderby: ' order by sort_no asc' }
}
const dictService = new BaseService(config)
export default dictService

//行为模型阶段 [探查 识别 诊断 操作]