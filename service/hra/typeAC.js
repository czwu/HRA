import constants from '../../common/constants'
import BaseService from '../base'
import asepService from './asep'
/**
 * A类相关性 数据表
 */
let config = {
    tableName: "typeA_C",
    columns: [
        { name: "guid", type: "VARCHAR(50)", ext: "PRIMARY KEY" }, //唯一ID
        { name: "task_id", type: "VARCHAR(50)", ext: "NOT NULL", foreign_key: true }, //关联a类相关性任务id
        { name: "event_id", type: "VARCHAR(50)", ext: "NOT NULL" }, //关联该A类事件本身的guid
        { name: "group_id", type: "VARCHAR(50)", ext: "NOT NULL" }, //同一组数据ID相同
        { name: "group_name", type: "VARCHAR(50)" }, //分组
        { name: "system_code", type: "VARCHAR(50)" }, //系统码
        { name: "room_no", type: "VARCHAR(50)" }, //房间号
        { name: "device_funciton", type: "VARCHAR(50)" }, //设备功能
        { name: "device_type", type: "VARCHAR(50)" }, //名称
        { name: "code", type: "VARCHAR(50)" }, //编码
        { name: "correlation", type: "VARCHAR(50)" }, //相关性
        { name: "correlation_type", type: "VARCHAR(50)" }, //相关性 事件树类型
        { name: "value", type: "VARCHAR(50)" }, //原值
        { name: "correction_value", type: "VARCHAR(50)" }, //修正值
        { name: "he_probability", type: "VARCHAR(50)" }, //联合人误概率
        { name: "he_probability_correction", type: "VARCHAR(50)" }, //联合人误概率修正值
        { name: "he_correction", type: "VARCHAR(50)" }, //人误编码修正

        { name: "version", type: "VARCHAR(50)" }, //版本
        { name: "status", type: "VARCHAR(50)" }, //状态
        { name: "document", type: "VARCHAR(200)" }, //相关文件
        { name: "remark", type: "VARCHAR(500)" }, //备注
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
    // rebuild: true,
    feature: {
        fileSuggest: true, // 删除的时候,需要连带删除关联文件
        orderby: ' order by stage_index asc'
    }
}
class TypeACService extends BaseService {
    getFormItems({ form_mode }) {
        var fields = [
            { name: '分组', field: 'group_name', datatype: 'string', type: 'text', required: true, single: true, _mode: 'group' },
            { name: '系统码', field: 'system_code', datatype: 'string', type: 'label', _mode: 'group' },
            { name: '房间号', field: 'room_no', datatype: 'string', type: 'label', _mode: 'group' },
            { name: '设备功能', field: 'device_funciton', datatype: 'string', type: 'label' },
            { name: '名称', field: 'name', datatype: 'string', type: 'label' },
            { name: '编码', field: 'code', datatype: 'string', type: 'label' },
            { name: '相关性', field: 'correlation', datatype: 'string', type: 'label' },
            { name: '原值', field: 'value', datatype: 'string', type: 'label' },
            { name: '修正值', field: 'correction_value', datatype: 'string', type: 'label' },
            { name: '联合人误概率', field: 'he_probability', datatype: 'string', type: 'label', _mode: 'group' },
            { name: '联合人误概率修正值', field: 'he_probability_correction', datatype: 'string', type: 'label', _mode: 'group', labelWarp: true },
            // { name: '人误编码修正', field: 'he_correction', datatype: 'string', type: 'label' },
            { name: '版本', field: 'version', datatype: 'string', type: 'label', _mode: 'group' },
            { name: '状态', field: 'status', datatype: 'string', type: 'label', _mode: 'group' },
            { name: "相关文件", field: "document", datatype: 'string', type: "file", css: 'long-col' }, //高度 相关文件
            { name: "备注", field: "remark", datatype: 'string', type: "text-media", css: 'long-col' }, //高度 相关文件
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
                system_code: "CET" + num + '__' + i,
                room_no: 'R' + num + '__' + i,
                name: '隔离阀' + '__' + i,
                device_funciton: '安全壳隔离阀' + '__' + i,
                code: 'ETY' + num + 'VA' + '__' + i,
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
const typeACService = new TypeACService(config)
export default typeACService