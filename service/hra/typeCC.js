import constants from '../../common/constants'
import BaseService from '../base'
import asepService from './asep'
/**
 * A类相关性 数据表
 */
let config = {
    tableName: "TYPEC_C",
    columns: [
        { name: "guid", type: "VARCHAR(50)", ext: "PRIMARY KEY" }, //唯一ID
        { name: "task_id", type: "VARCHAR(50)", ext: "NOT NULL" }, //关联C类相关性任务id
        { name: "event_id", type: "VARCHAR(50)", ext: "NOT NULL" }, //关联该C类事件的guid
        { name: "group_id", type: "VARCHAR(50)", ext: "NOT NULL" }, //同一组数据ID相同
        { name: "human_error_code", type: "VARCHAR(50)" }, //人误编码
        { name: "group_name", type: "VARCHAR(50)" }, //分组
        { name: "accident", type: "VARCHAR(100)" }, //事故
        { name: "system", type: "VARCHAR(50)" }, //系统
        { name: "accident_desc", type: "VARCHAR(100)" }, //事故序列说明(事故情景描述)
        { name: "correlation", type: "VARCHAR(50)" }, //相关性
        { name: "correlation_type", type: "VARCHAR(50)" }, //相关性 事件树类型
        { name: "value", type: "VARCHAR(50)" }, //原值
        { name: "correction_value", type: "VARCHAR(50)" }, //修正值
        { name: "he_probability", type: "VARCHAR(50)" }, //联合人误概率
        { name: "he_probability_correction", type: "VARCHAR(50)" }, //联合人误概率修正值
        { name: "he_correction", type: "VARCHAR(50)" }, //人误编码修正
        { name: "document", type: "VARCHAR(200)" }, //相关文件
        { name: "remark", type: "VARCHAR(500)" }, //备注
        { name: "version", type: "VARCHAR(50)" }, //版本
        { name: "status", type: "VARCHAR(50)" }, //状态
        { name: "stage", type: "INT" }, //该组数据的总阶数 2,3,4,5,6
        { name: "stage_index", type: "INT" }, //当前数据的阶数
        { name: "project_id", type: "VARCHAR(50)" }, //所属项目ID
        { name: "created_at", type: "INT" }, //任务创建时间
        { name: "created_by", type: "VARCHAR(50)" }, //创建人
        { name: "updated_at", type: "INT" }, //修改人
        { name: "updated_by", type: "VARCHAR(50)" }, //修改时间
        { name: "delete_flag", type: "INT", ext: " DEFAULT 0 " }
    ],
    datas: [],
    feature: {
        fileSuggest: true, // 删除的时候,需要连带删除关联文件
        orderby: ' order by stage_index asc'
    }
}
class Service extends BaseService {
    getFormItems({ form_mode }) {
        var fields = [
            { name: '分组', field: 'group_name', datatype: 'string', type: 'text', required: true, single: true, _mode: 'group' },
            { name: '人误编码', field: 'human_error_code', datatype: 'string', type: 'label' },
            { name: '系统', field: 'system', datatype: 'string', type: 'label' },
            { name: '事故', field: 'accident', datatype: 'string', type: 'label' },
            { name: '事故序列说明(事故情景描述)', field: 'accident_desc', datatype: 'string', type: 'label', css: 'long-col' },
            { name: '相关性', field: 'correlation', datatype: 'string', type: 'label' },
            { name: '原值', field: 'value', datatype: 'string', type: 'label' },
            { name: '修正值', field: 'correction_value', datatype: 'string', type: 'label' },
            { name: '联合人误概率', field: 'he_probability', datatype: 'string', type: 'label', _mode: 'group', _mode: 'group' },
            { name: '联合人误概率修正值', field: 'he_probability_correction', datatype: 'string', type: 'label', _mode: 'group' },
            { name: '人误编码修正', field: 'he_correction', datatype: 'string', type: 'label' },
            { name: '版本', field: 'version', datatype: 'string', type: 'label', _mode: 'group' },
            { name: '状态', field: 'status', datatype: 'string', type: 'label', _mode: 'group' },
            { name: "相关文件", field: "document", datatype: 'string', type: "file", css: 'long-col' },
            { name: "备注", field: "remark", datatype: 'string', type: "text-media", css: 'long-col' },

        ]
        if (form_mode == 'group') {
            return fields.filter(f => f._mode == 'group')
        } else {
            fields.splice(9, 2);
            fields.shift();
            return fields;
        }
    }
    autoInput(datas) {
        let num = (Math.random() + '').replace('.', '').substr(0, 4);
        datas.forEach((data, i) => {
            Object.assign(data, {
                group_name: 'group' + num,
                correlation: "高相关"
            })
        })

    }

    remove(guid) {
        //调用基类方法删除数据后,再通过相关联的数据服务,删除相关数据
        return super.remove(guid).then(() => {
            asepService.removeBy({ foreign_id: guid })
        });
    }

    updateName(group_id, name) {
        var sql = `update ${this.tableName} set group_name='${name}' where group_id='${group_id}'`
        return new Promise((resolve, reject) => {
            plus.sqlite.executeSql({
                name: constants.db_name,
                sql: sql,
                success(e) {
                    resolve(e);
                },
                fail(e) {
                    console.error("update Failed!", e)
                    reject(e);
                }
            })
        })
    }

}
const service = new Service(config)
export default service