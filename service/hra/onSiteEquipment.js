import constants from '../../common/constants'
import BaseService from '../base'
/**
 * HRA数据 A类-信息采集->可达性
 */
let config = {
    tableName: "on_site_equipment",
    columns: [
        { name: "guid", type: "VARCHAR(50)", ext: "PRIMARY KEY" },
        { name: "foreign_id", type: "VARCHAR(50)", ext: "NOT NULL" }, //关联的主数据ID   => 关联 typeA表 的GUID
        { name: "spare_need", type: "VARCHAR(1)" }, //是否需要备品、备件 
        { name: "spare_usable", type: "VARCHAR(1)" }, //是否可用
        { name: "spare_time_spent", type: "INT" }, //取备品时间
        { name: "spare_doc", type: "VARCHAR(50)" }, // 相关文件
        { name: "spare_info", type: "VARCHAR(100)" }, // 多媒体
        { name: "spare_remark", type: "VARCHAR(200)" }, //备注
        { name: "clothing_need", type: "VARCHAR(1)" }, //是否需要防护服
        { name: "clothing_usable", type: "VARCHAR(1)" }, //是否可用
        { name: "clothing_time_spent", type: "INT" }, //取防护服时间
        { name: "clothing_doc", type: "VARCHAR(50)" }, // 相关文件
        { name: "clothing_info", type: "VARCHAR(100)" }, // 多媒体
        { name: "clothing_remark", type: "VARCHAR(200)" }, //备注
        { name: "tool_need", type: "VARCHAR(1)" }, //是否需要工具
        { name: "tool_usable", type: "VARCHAR(1)" }, //是否可用
        { name: "tool_time_spent", type: "INT" }, //取工具时间
        { name: "tool_doc", type: "VARCHAR(50)" }, // 相关文件
        { name: "tool_info", type: "VARCHAR(100)" }, // 多媒体
        { name: "tool_remark", type: "VARCHAR(200)" }, //备注
        { name: 'device_code', type: "VARCHAR(50)" }, //设备编码
        { name: "maintain_simple", type: "VARCHAR(1)" }, //是否容易维护、恢复和操作
        { name: "maintain_time_spent", type: "INT" }, //需要时间
        { name: "maintain_doc", type: "VARCHAR(100)" }, //相关文件
        { name: "maintain_info", type: "VARCHAR(100)" }, //多媒体
        { name: "maintain_remark", type: "VARCHAR(500)" }, //备注
        { name: "project_id", type: "VARCHAR(50)" } //所属项目ID
    ],
    datas: [],
    guidPrefix: "INFO_",
    feature: {
        fileSuggest: true // 删除的时候,需要连带删除关联文件
    }
}
class Service extends BaseService {
    getFormItems() {
        return [
            { group: "备品、备件" },
            { field: "spare_need", name: "是否需要备品、备件", datatype: 'string', type: 'switch', labelWarp: true, values: ['否', '是'] },
            { field: "spare_usable", name: "是否可用", datatype: 'string', type: 'switch', values: ['否', '是'] },
            { field: "spare_time_spent", name: "取备品时间", datatype: 'number', type: 'text', inputSuffix: "min" },
            { field: "spare_doc", name: "相关文件", datatype: 'string', type: "file" },
            { field: "spare_info", name: "多媒体", datatype: 'string', type: 'text-media' },
            { field: "spare_remark", name: "备注", datatype: 'string', type: 'text-media', css: 'long-col' },
            { group: "防护服" },
            { field: "clothing_need", name: "是否需要防护服", datatype: 'string', type: 'switch', values: ['否', '是'] },
            { field: "clothing_usable", name: "是否可用", datatype: 'string', type: 'switch', values: ['否', '是'] },
            { field: "clothing_time_spent", name: "取防护服时间", datatype: 'number', type: 'text', inputSuffix: "min" },
            { field: "clothing_doc", name: "相关文件", datatype: 'string', type: "file" },
            { field: "clothing_info", name: "多媒体", datatype: 'string', type: 'text-media' },
            { field: "clothing_remark", name: "备注", datatype: 'string', type: 'text-media', css: 'long-col' },
            { group: "工具" },
            { field: "tool_need", name: "是否需要工具", datatype: 'string', type: 'switch', values: ['否', '是'] },
            { field: "tool_usable", name: "是否可用", datatype: 'string', type: 'switch', values: ['否', '是'] },
            { field: "tool_time_spent", name: "取工具时间", datatype: 'number', type: 'text', inputSuffix: "min" },
            { field: "tool_doc", name: "相关文件", datatype: 'string', type: "file" },
            { field: "tool_info", name: "多媒体", datatype: 'string', type: 'text-media' },
            { field: "tool_remark", name: "备注", datatype: 'string', type: 'text-media', css: 'long-col' },
            { group: "设备故障后是否容易维修、恢复和操作" },
            { field: "device_code", name: "设备编码", datatype: 'string', type: 'text' },
            { field: "maintain_simple", name: "是否容易维修、恢复和操作", datatype: 'string', labelWarp: true, type: 'switch', values: ['否', '是'] },
            { field: "maintain_time_spent", name: "需要时间", datatype: 'number', type: 'text', inputSuffix: "min" },
            { field: "maintain_doc", name: "相关文件", datatype: 'string', type: "file" },
            { field: "maintain_info", name: "多媒体", datatype: 'string', type: 'text-media' },
            { field: "maintain_remark", name: "备注", datatype: 'string', type: 'text-media', css: 'long-col' }
        ]
    }
    autoInput(data) {

    }

}
const service = new Service(config)
export default service