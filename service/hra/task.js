import constants from '../../common/constants'
import BaseService from '../base'


let config = {
    tableName: "Task",
    columns: [
        { name: "guid", type: "VARCHAR(50)", ext: "PRIMARY KEY" }, //唯一ID
        { name: "name", type: "VARCHAR(50)", ext: "NOT NULL" }, //任务名称
        { name: "code", type: "VARCHAR(50)", ext: "NOT NULL" }, //任务编码
        { name: "stage", type: "VARCHAR(50)", ext: "" }, //阶段
        { name: "level", type: "VARCHAR(50)", ext: "" }, //级别
        { name: "working_condition_type", type: "VARCHAR(50)", ext: "" }, //工况类别
        { name: "htype", type: "VARCHAR(50)", ext: "" }, //人因类别
        { name: "desc", type: "VARCHAR(500)", ext: "" }, //任务描述
        { name: "analysis_scope", type: "VARCHAR(50)", ext: "" }, //分析范围
        { name: "principal", type: "VARCHAR(50)", ext: "" }, //任务负责人
        { name: "participants", type: "VARCHAR(255)", ext: " DEFAULT 0 " }, //任务参与人员
        { name: "deadline_at", type: "VARCHAR(50)", ext: "" }, //任务截止时间
        { name: "remark", type: "VARCHAR(255)", ext: "" }, //备注
        { name: "project_id", type: "VARCHAR(50)", ext: "" }, //所属项目ID
        { name: "created_at", type: "INT", ext: "" }, //任务创建时间
        { name: "created_by", type: "VARCHAR(50)", ext: "" }, //创建人
        { name: "updated_at", type: "INT", ext: "" }, //修改人
        { name: "updated_by", type: "VARCHAR(50)", ext: "" }, //修改时间
        { name: "delete_flag", type: "INT", ext: " DEFAULT 0 " }
    ],
    datas: [],
    guidPrefix: "task_",
}
class TaskService extends BaseService {
    getFormItems() {
        return [
            { name: '任务名称', field: 'name', datatype: 'string', type: 'text', required: true },
            { name: '任务编码', field: 'code', datatype: 'string', type: 'text', required: true },
            { name: '阶段', field: 'stage', datatype: 'string', type: 'select', dicttype: constants.DICT_TYPE.TASK_STAGE, required: true },
            { name: '级别', field: 'level', datatype: 'string', type: 'select', dicttype: constants.DICT_TYPE.TASK_LEVEL, required: true },
            { name: '工况类别', field: 'working_condition_type', datatype: 'string', type: 'select', dicttype: constants.DICT_TYPE.WORKING_CONDITION_TYPE, required: true },
            { name: '人因类别', field: 'htype', datatype: 'string', type: 'select', dicttype: constants.DICT_TYPE.TASK_HTYPE, required: true },
            { name: '分析范围', field: 'analysis_scope', datatype: 'string', type: 'select', dicttype: constants.DICT_TYPE.TASK_ANALYSIS_SCOPE, required: true },
            { name: '任务负责人', field: 'principal', datatype: 'string', type: 'select', dicttype: constants.DICT_TYPE.USER_SELECT, required: true },
            { name: '任务参与人员', field: 'participants', datatype: 'string', type: 'select', dicttype: constants.DICT_TYPE.USER_SELECT, multi: true, required: true },
            { name: '任务描述', field: 'desc', datatype: 'string', type: 'textarea', css: 'long-col row-textarea' },
            { name: '截止时间', field: 'deadline_at', datatype: 'string', type: 'datepicker', datetype: 'datetime' },
            { name: '备注', field: 'remark', datatype: 'string', type: 'textarea', css: 'long-col row-textarea' }
        ]
    }
    autoInput(data) {
        let num = (Math.random() + '').replace('.', '').substr(0, 5);
        data.name = 'AIEOVN-AC-' + num;
        data.code = 'A1' + num;
        data.stage = 'PSAR阶段';
        data.level = '一级';
        data.working_condition_type = '功率运行';
        data.htype = 'A类相关性';
        data.analysis_scope = '内部水淹';
        data.principal = '马云';
        data.participants = '张娜娜';
        data.deadline_at = '2020-09-10 14:20'
        data.desc = data.name + ': 任务描述, 我是任务描述'
        data.remark = '需要紧急处理'
    }

}
const taskService = new TaskService(config)
export default taskService