import constants from '../../common/constants'
import BaseService from '../base'

//情景步骤表
let config = {
    tableName: "situation_step",
    columns: [
        { name: "guid", type: "VARCHAR(50)", ext: "PRIMARY KEY" }, //唯一ID
        { name: "foreign_id", type: "VARCHAR(50)", ext: "NOT NULL" }, //关联的主数据ID  情境版本GUID
        { name: "step_guid", type: "VARCHAR(50)", ext: "NOT NULL" }, //步骤id  
        { name: "step_name", type: "VARCHAR(50)", ext: "NOT NULL" }, //步骤   
        { name: "step_num", type: "VARCHAR(50)", ext: "NOT NULL" }, //步骤号 
        { name: "regulation_code", type: "VARCHAR(50)" }, //规程号
        { name: "action_title", type: "VARCHAR(200)" }, //预期相应
        { name: "expected", type: "INT" }, //是否预期响应
        { name: "unexpected_action_title", type: "VARCHAR(200)" }, //非预期响应
        { name: "unexpected", type: "INT" }, //是否有非预期响应
        { name: "start_time", type: "VARCHAR(20)" }, //开始时间
        { name: "end_time", type: "VARCHAR(20)" }, //完成时间 
        { name: "duration", type: "VARCHAR(20)" }, //持续时间
        { name: "estimated_time", type: "INT" }, //预计时间
        { name: "role", type: "VARCHAR(50)" }, //角色
        { name: "tutelage", type: "VARCHAR(10)" }, //监护
        { name: "remark", type: "VARCHAR(200)" }, //备注
        { name: "project_id", type: "VARCHAR(50)" }, //所属项目ID
        { name: "created_at", type: "INT" }, //任务创建时间
        { name: "created_by", type: "VARCHAR(50)" }, //创建人
        { name: "updated_at", type: "INT" }, //修改人
        { name: "updated_by", type: "VARCHAR(50)" } //修改时间
        // { name: "delete_flag", type: "INT", ext: " DEFAULT 0 " }
    ],
    guidPrefix: "step_"
}



class Service extends BaseService {
    getFormItems({ form_mode }) {
        // if (form_mode == 'create') {
        return [
            { group: "时间" },
            { name: "开始时间", field: "start_time", type: 'text', placeholder: '00:00:00', inputIcon: 'iconshijian' },
            { name: "完成时间", field: "end_time", type: 'text', placeholder: '00:00:00', inputIcon: 'iconshijian' },
            { name: "持续时间", field: "duration", type: 'label', placeholder: '00:00:00' },
            { name: "预计时间", field: "estimated_time", type: 'text', placeholder: '00:00:00' },
            { name: "角色", field: "role", type: 'item-select', values: ['ROA', 'ROB', 'ROC', '值长', '副值长', '安工'], css: 'long-col' },
            { name: "监护", field: "tutelage", type: 'switch', values: ['否', '是'], defaultValue: '否' },
            { name: "备注", field: "remark", type: 'text-media', css: 'long-col' }
        ]
    }
    queryByForeignId(foreign_id) {
        let sql = "select a.*,c.foreign_id as has_req from  situation_step a left join (select distinct(b.foreign_id) from situation_issue b where b.delete_flag=0) c on a.guid=c.foreign_id where  a.foreign_id='" + foreign_id + "'"
        return new Promise((resolve, reject) => {
            plus.sqlite.selectSql({
                name: constants.db_name,
                sql: sql,
                success(e) {
                    resolve(e);
                },
                fail(e) {
                    reject(e);
                }
            })
        })
    }

    autoInput(data) {

    }
}
const service = new Service(config)
export default service;