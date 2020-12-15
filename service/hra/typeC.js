import constants from '../../common/constants'
import BaseService from '../base'
import warningSerivice from './warning'
import directiveSerivice from './directive'
import accessbilityService from './accessibilityC'
import analysisService from './analysis'
import behaviorTypeService from './behaviorType'
import faultEventService from './faultEvent'
import onSiteEquipmentService from './onSiteEquipment'
import cbdtService from './CBDT'
import psfService from './psf'

let config = {
    tableName: "TYPE_C",
    columns: [
        { name: "guid", type: "VARCHAR(50)", ext: "PRIMARY KEY" }, //唯一ID
        { name: "task_id", type: "VARCHAR(50)", ext: "NOT NULL", foreign_key: true }, //唯一ID
        { name: "system", type: "VARCHAR(50)", ext: "NOT NULL" }, //系统
        { name: "human_error_code", type: "VARCHAR(50)" }, //人误编码
        { name: "accident", type: "VARCHAR(100)" }, //事故
        { name: "accident_desc", type: "VARCHAR(100)" }, //事故序列说明(事故情景描述)
        { name: "human_error_desc", type: "VARCHAR(200)" }, //人误描述
        { name: "success_criteria", type: "VARCHAR(255)" }, //成功准则

        { name: "key_signal", type: "VARCHAR(100)" }, //关键信号
        { name: "key_signal_time", type: "VARCHAR(50)" }, //关键信号出现时间(TC)
        { name: "fault_tree", type: "VARCHAR(50)" }, //所在事件树/故障树
        { name: "header_code", type: "VARCHAR(50)" }, //所在功能题头编号
        { name: "hardware_sys_failure", type: "VARCHAR(50)" }, //硬件&系统故障
        { name: "pre_person_action", type: "VARCHAR(50)" }, //前序人员动作
        { name: "info_src", type: "VARCHAR(50)" }, //信息来源
        { name: "raw", type: "VARCHAR(50)" },
        { name: "rdw", type: "VARCHAR(50)" },
        { name: "fv", type: "VARCHAR(50)" },
        { name: "fc", type: "VARCHAR(50)" },
        { name: "sens", type: "VARCHAR(50)" },
        { name: "senshign", type: "VARCHAR(50)" },
        { name: "senslow", type: "VARCHAR(50)" },
        { name: "remark", type: "VARCHAR(255)" }, //备注
        { name: "version", type: "VARCHAR(50)" }, //版本
        { name: "status", type: "VARCHAR(50)" }, //校验状态
        { name: "project_id", type: "VARCHAR(50)" }, //所属项目ID
        { name: "created_at", type: "INT" }, //任务创建时间
        { name: "created_by", type: "VARCHAR(50)" }, //创建人
        { name: "updated_at", type: "INT" }, //修改人
        { name: "updated_by", type: "VARCHAR(50)" }, //修改时间
        { name: "delete_flag", type: "INT", ext: " DEFAULT 0 " }
    ],
    datas: [],
    guidPrefix: "C_",
    feature: {
        fileSuggest: false // 删除的时候,是否需要连带删除关联文件   备注:主数据暂未关联文件
    }
}
class TypeAService extends BaseService {
    getFormItems() {
        return [
            { name: '系统', field: 'system', datatype: 'string', type: 'text', required: true },
            { name: '人误编码', field: 'human_error_code', datatype: 'string', type: 'text', required: true },
            { name: '事故', field: 'accident', datatype: 'string', type: 'text' },
            { name: '事故序列说明(事故情景描述)', field: 'accident_desc', datatype: 'string', type: 'text', css: 'long-col' },
            { name: '人误描述', field: 'human_error_desc', datatype: 'string', type: 'text', css: 'long-col' },
            { name: '成功准则', field: 'success_criteria', datatype: 'string', type: 'text', css: 'long-col' },
            { name: '关键信号', field: 'key_signal', datatype: 'string', type: 'text' },
            { name: '关键信号出现时间(TC)', field: 'key_signal_time', datatype: 'string', type: 'text' },
            { name: '所在事件树/故障树', field: 'fault_tree', datatype: 'string', type: 'text' },
            { name: '所在功能题头编号', field: 'header_code', datatype: 'string', type: 'text' },
            { name: '硬件&系统故障', field: 'hardware_sys_failure', datatype: 'string', type: 'text' },
            { name: '前序人员动作', field: 'pre_person_action', datatype: 'string', type: 'text' },
            { name: '信息来源', field: 'info_src', datatype: 'string', type: 'text' },
            { name: "RAW", field: "raw", datatype: 'string', type: 'text' },
            { name: "RDW", field: "rdw", datatype: 'string', type: 'text' },
            { name: "FV", field: "fv", datatype: 'string', type: 'text' },
            { name: "FC", field: "fc", datatype: 'string', type: 'text' },
            { name: 'SENS', field: 'sens', datatype: 'string', type: 'text' },
            { name: 'SENS.HIGN', field: 'senshign', datatype: 'string', type: 'text' },
            { name: 'SENS.LOW', field: 'senslow', datatype: 'string', type: 'text' },
            { name: '备注', field: 'remark', datatype: 'string', type: 'text', css: 'long-col' },
            { name: '版本', field: 'version', datatype: 'string', type: 'text' },
            { name: '校验状态', field: 'status', datatype: 'string', type: 'text' }
        ]
    }
    autoInput(data) {
        let num = (Math.random() + '').replace('.', '').substr(0, 4);
        Object.assign(data, {
            system: 'CIS',
            human_error_code: 'CSP' + num + 'NN-MS',
            accident: 'LOCA.瞬态类',
            accident_desc: 'LOCA,瞬态事故后,操作员手动隔离安全壳',
            key_signal: '通ADS手动启动',
            success_criteria: '操作员15分钟内手动隔离安全壳',
            key_signal_time: '4',
            human_error_desc: '操作员未能将手动隔离安全壳'
        })
    }

    remove(guid) {
        //调用基类方法删除数据后,再通过相关联的数据服务,删除相关数据
        return super.remove(guid).then(() => {
            accessbilityService.removeBy({ foreign_id: guid });
            directiveSerivice.removeBy({ foreign_id: guid });
            warningSerivice.removeBy({ foreign_id: guid });
            analysisService.removeBy({ foreign_id: guid });
            behaviorTypeService.removeBy({ foreign_id: guid });
            faultEventService.removeBy({ foreign_id: guid });
            onSiteEquipmentService.removeBy({ foreign_id: guid });
            cbdtService.removeBy({ foreign_id: guid });
            psfService.removeBy({ foreign_id: guid });
        });
    }

}
const typeAService = new TypeAService(config)
export default typeAService