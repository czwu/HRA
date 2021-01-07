import constants from '../../common/constants'
import BaseService from '../base'

//ASEP决策树数据表
let config = {
    tableName: "THERP",
    columns: [
        { name: "guid", type: "VARCHAR(50)", ext: "PRIMARY KEY" }, //唯一ID
        { name: "foreign_id", type: "VARCHAR(50)", ext: "NOT NULL" }, //关联的主数据ID   
        { name: "pressure_type", type: "VARCHAR(50)" }, //1 低压力事件树, 2中压力事件树 3 高压力事件树
        { name: "time_window", type: "VARCHAR(50)" }, //时间窗口
        { name: "time_space", type: "VARCHAR(50)" }, //时间间隙
        { name: "complexity", type: "VARCHAR(50)" }, //复杂性
        { name: "regulations_type", type: "INT" }, //规程导则类型
        { name: "related_text", type: "VARCHAR(50)" }, //相关性 完全相关 高相关 中相关 低相关 零相关
        { name: "related_value", type: "VARCHAR(50)" }, //相关性值
        { name: "remark", type: "VARCHAR(500)", ext: " DEFAULT '' " }, //备注
        { name: "project_id", type: "VARCHAR(50)" }, //所属项目ID
        { name: "created_at", type: "INT" }, //任务创建时间
        { name: "created_by", type: "VARCHAR(50)" }, //创建人
        { name: "updated_at", type: "INT" }, //修改人
        { name: "updated_by", type: "VARCHAR(50)" }, //修改时间
        { name: "delete_flag", type: "INT", ext: " DEFAULT 0 " }
    ],
    datas: [],
    guidPrefix: "THERP_",
}



class Service extends BaseService {
    getFormItems() {
        return [
            { name: "类型", field: "pressure_type", datatype: 'string', type: 'item-select', defaultValue: '', values: ['低压力事件树', '中压力事件树', '高压力事件树'], css: 'long-col' },
            // { name: '复杂性是否复杂', field: 'complexity', datatype: 'string', type: 'switch', defaultValue: '复杂', values: ['简单', '复杂'] },
            { name: '备注', field: 'remark', datatype: 'string', type: 'text-media', css: 'long-col' }
        ]
    }
    getRelatedFields() {
        return [
            { name: '时间窗口', field: 'time_window' },
            { name: '时间间隙', field: 'time_space' },
            { name: '复杂性', field: 'complexity' },
            { name: '规程导则类型', field: 'regulations_type' },
            { name: '相关性等级', field: 'related_text' }
        ]
    }
    getRelatedTree() {
        return {
            branches: [{
                field: 'time_window',
                value: 'Tm ≤ 15min',
                branches: [{
                        field: 'time_space',
                        value: 'Td ≥ 5min',
                        branches: [{
                                field: 'complexity',
                                value: '简单',
                                branches: [{
                                        field: 'regulations_type',
                                        value: '清晰',
                                        related: '完全相关'
                                    },
                                    {
                                        field: 'regulations_type',
                                        value: '不清晰',
                                        related: '高相关'
                                    }
                                ]
                            },
                            {
                                field: 'complexity',
                                value: '复杂',
                                branches: [{
                                        field: 'regulations_type',
                                        value: '清晰',
                                        related: '完全相关'
                                    },
                                    {
                                        field: 'regulations_type',
                                        value: '不清晰',
                                        related: '高相关'
                                    }
                                ]
                            }
                        ]
                    },
                    { field: 'time_space', value: '0 < Td < 5min', related: '高相关' }
                ]
            }, {
                field: 'time_window',
                value: '15 < Tm ≤ 30min',
                branches: [{
                        field: 'time_space',
                        value: 'Td ≥ 5min',
                        branches: [{
                                field: 'complexity',
                                value: '简单',
                                branches: [{
                                        field: 'regulations_type',
                                        value: '清晰',
                                        related: '高相关'
                                    },
                                    {
                                        field: 'regulations_type',
                                        value: '不清晰',
                                        related: '中相关'
                                    }
                                ]
                            },
                            {
                                field: 'complexity',
                                value: '复杂',
                                branches: [{
                                        field: 'regulations_type',
                                        value: '清晰',
                                        related: '中相关'
                                    },
                                    {
                                        field: 'regulations_type',
                                        value: '不清晰',
                                        related: '低相关'
                                    }
                                ]
                            }
                        ]
                    },
                    { field: 'time_space', value: '0 < Td < 5min', related: '低相关' }
                ]
            }, {
                field: 'time_window',
                value: '30 < Tm ≤ 60min',
                branches: [{
                        field: 'time_space',
                        value: '5 ≤ Td < 30min',
                        branches: [{
                                field: 'complexity',
                                value: '简单',
                                branches: [{
                                        field: 'regulations_type',
                                        value: '清晰',
                                        related: '中相关'
                                    },
                                    {
                                        field: 'regulations_type',
                                        value: '不清晰',
                                        related: '中相关'
                                    }
                                ]
                            },
                            {
                                field: 'complexity',
                                value: '复杂',
                                branches: [{
                                        field: 'regulations_type',
                                        value: '清晰',
                                        related: '低相关'
                                    },
                                    {
                                        field: 'regulations_type',
                                        value: '不清晰',
                                        related: '低相关'
                                    }
                                ]
                            }
                        ]
                    },
                    { field: 'time_space', value: '0 < Td < 5min', related: '低相关' }
                ]
            }, {
                field: 'time_window',
                value: 'Tm > 60min',
                branches: [{
                        field: 'time_space',
                        value: 'Td ≥ 30min',
                        branches: [{
                                field: 'complexity',
                                value: '简单',
                                branches: [{
                                        field: 'regulations_type',
                                        value: '清晰',
                                        related: '低相关'
                                    },
                                    {
                                        field: 'regulations_type',
                                        value: '不清晰',
                                        related: '零相关'
                                    }
                                ]
                            },
                            {
                                field: 'complexity',
                                value: '复杂',
                                branches: [{
                                        field: 'regulations_type',
                                        value: '清晰',
                                        related: '零相关'
                                    },
                                    {
                                        field: 'regulations_type',
                                        value: '不清晰',
                                        related: '零相关'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        field: 'time_space',
                        value: '5 ≤ Td < 30min',
                        branches: [{
                                field: 'complexity',
                                value: '简单',
                                branches: [{
                                        field: 'regulations_type',
                                        value: '清晰',
                                        related: '低相关'
                                    },
                                    {
                                        field: 'regulations_type',
                                        value: '不清晰',
                                        related: '零相关'
                                    }
                                ]
                            },
                            {
                                field: 'complexity',
                                value: '复杂',
                                branches: [{
                                        field: 'regulations_type',
                                        value: '清晰',
                                        related: '零相关'
                                    },
                                    {
                                        field: 'regulations_type',
                                        value: '不清晰',
                                        related: '零相关'
                                    }
                                ]
                            }
                        ]
                    },
                    { field: 'time_space', value: '0 < Td < 5min', related: '零相关' }
                ]
            }]
        }
    }
}
const service = new Service(config)
export default service;