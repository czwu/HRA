import constants from '../../common/constants'
import BaseService from '../base'
/**
 * HRA数据 A类-信息采集->可达性
 */
let config = {
    tableName: "accessibility",
    columns: [
        { name: "guid", desc: "唯一ID", type: "VARCHAR(50)", ext: "PRIMARY KEY" },
        { name: "foreign_id", type: "VARCHAR(50)", ext: "NOT NULL" }, //关联的主数据ID   => 关联 typeA表 的GUID
        { name: "obstacle", type: "VARCHAR(1)" }, //是否有障碍 
        { name: "obstacle_doc", type: "VARCHAR(100)" }, //障碍 相关文件
        { name: "obstacle_info", type: "VARCHAR(100)" }, //障碍 多媒体
        { name: "obstacle_remark", type: "VARCHAR(500)" }, //备注
        { name: "height", type: "INT" }, //高度 单位M 
        { name: "height_tool", type: "VARCHAR(50)" }, //辅助装置  (钢平台  梯子  脚手架)
        { name: "height_doc", type: "VARCHAR(100)" }, //高度 相关文件
        { name: "height_info", type: "VARCHAR(100)" }, //高度 多媒体
        { name: "height_remark", type: "VARCHAR(500)" }, //高度备注
        { name: 'handle_space', type: "VARCHAR(10)" }, // 操作空间 够 不够 较危险
        { name: 'window', type: "VARCHAR(10)" }, // 窗户
        { name: 'well', type: "VARCHAR(10)" }, //井
        { name: 'pit', type: "VARCHAR(10)" }, // 坑地
        { name: 'pipeline_room', type: "VARCHAR(10)" }, //管道间
        { name: 'cable_room', type: "VARCHAR(10)" }, //电缆间
        { name: "handle_doc", type: "VARCHAR(100)" }, //操作空间 相关文件
        { name: "handle_info", type: "VARCHAR(100)" }, //操作空间 多媒体
        { name: "handle_remark", type: "VARCHAR(500)" }, //操作空间 备注
        { name: "access_time", type: "INT" }, //主控区域到达就地设备时间 单位分钟
        { name: "operator_access_time", type: "INT" }, //操作员指标到设备时间 单位分钟
        { name: "access_doc", type: "VARCHAR(200)" }, //相关文件 (通用)
        { name: "access_info", type: "VARCHAR(100)" }, //多媒体 (通用)
        { name: "access_remark", type: "VARCHAR(500)" }, //可达 备注
        { name: "project_id", type: "VARCHAR(50)" } //所属项目ID
    ],
    datas: [],
    guidPrefix: "INFO_",
    feature: {
        fileSuggest: true // 删除的时候,需要连带删除关联文件
    }
}
class accessbilityService extends BaseService {
    getFormItems() {
        return [
            { group: "障碍" },
            { field: "obstacle", name: "是否有障碍", datatype: 'string', type: 'switch', defaultValue: '是', values: ['否', '是'] },
            { field: "obstacle_doc", name: "相关文件", datatype: 'string', type: "file", css: 'long-col' },
            { field: "obstacle_info", name: "多媒体", datatype: 'string', type: 'text-media', css: 'long-col' },
            { field: "obstacle_remark", name: "备注", datatype: 'string', type: 'text-media', css: 'long-col' },
            { group: "高度" },
            { field: "height", name: "高度", datatype: 'number', type: 'text', inputSuffix: "m" }, //高度 单位M 
            { field: "height_tool", name: "辅助装置", datatype: 'string', type: 'item-select', values: constants.HEIGHT_TOOLS, allowInput: true, css: 'long-col', inputIcon: 'iconccedit' }, //高度辅助装置  (钢平台  梯子  脚手架)
            { field: "height_doc", name: "相关文件", datatype: 'string', type: "file", css: 'long-col' }, //高度 相关文件
            { field: "height_info", name: "多媒体", datatype: 'string', type: 'text-media', css: 'long-col' }, //高度 多媒体
            { field: "height_remark", name: "备注", datatype: 'string', type: 'text-media', css: 'long-col' }, //高度备注
            { group: "操作空间" },
            {
                field: 'handle_space',
                name: "操作空间",
                datatype: 'string',
                type: 'item-select',
                values: constants.HANDLE_SPACE,
                bgcolor: ['#25CA9D', '#F59a23', '#d9001b'],
                onChange(value, formdata) {
                    if (value == '够') {
                        formdata.window = formdata.well = formdata.pit = formdata.pipeline_room = formdata.cable_room = '否'
                    }
                }
            }, // 操作空间 够 不够 较危险
            { field: "window", name: "窗户", datatype: 'string', type: 'switch', defaultValue: 'Y', values: ['否', '是'] },
            { field: "well", name: "井", datatype: 'string', type: 'switch', defaultValue: 'Y', values: ['否', '是'] },
            { field: "pit", name: "坑地", datatype: 'string', type: 'switch', defaultValue: 'Y', values: ['否', '是'] },
            { field: "pipeline_room", name: "管道间", datatype: 'string', type: 'switch', defaultValue: 'Y', values: ['否', '是'] },
            { field: "cable_room", name: "电缆间", datatype: 'string', type: 'switch', defaultValue: 'Y', values: ['否', '是'] },
            { field: "handle_doc", name: "相关文件", datatype: 'string', type: "file", css: 'long-col' }, //高度 相关文件
            { field: "handle_info", name: "多媒体", datatype: 'string', type: 'text-media', css: 'long-col' }, //高度 多媒体
            { field: "handle_remark", name: "备注", datatype: 'string', type: 'text-media', css: 'long-col' }, //高度备注
            { group: "可达就地设备的路径时间" },
            { field: "access_time", name: "主控区域到达就地设备时间", datatype: 'number', type: 'text', labelWarp: true, inputSuffix: "min" },
            { field: "operator_access_time", name: "操作员指标到设备时间", datatype: 'number', type: 'text', labelWarp: true, inputSuffix: "min" },
            { field: "access_doc", name: "相关文件", datatype: 'string', type: "file", css: 'long-col' }, //高度 相关文件
            { field: "access_info", name: "多媒体", datatype: 'string', type: 'text-media', css: 'long-col' }, //高度 多媒体
            { field: "access_remark", name: "备注", datatype: 'string', type: 'text-media', css: 'long-col' }, //高度备注

        ]
    }
    autoInput(data) {

    }

}
const service = new accessbilityService(config)
export default service