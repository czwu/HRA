import constants from '../../common/constants'
import BaseService from '../base'

//ASEP决策树数据表
let config = {
    tableName: "SPAR_H",
    columns: [
        { name: "guid", type: "VARCHAR(50)", ext: "PRIMARY KEY" }, //唯一ID
        { name: "foreign_id", type: "VARCHAR(50)", ext: "NOT NULL" }, //关联的主数据ID   
        { name: "same_staff", type: "VARCHAR(50)" }, //人员是否相同
        { name: "same_time", type: "VARCHAR(50)" }, //时间是否相近
        { name: "same_pos", type: "VARCHAR(50)" }, //位置是否相同
        { name: "has_clue", type: "VARCHAR(50)" }, //是否有线索
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
            { name: '备注', field: 'remark', datatype: 'string', type: 'text-media', css: 'long-col' }
        ]
    }
    getRelatedFields() {
        return [
            { name: '人员', field: 'same_staff' },
            { name: '时间', field: 'same_time' },
            { name: '位置', field: 'same_pos' },
            { name: '线索', field: 'has_clue' },
            { name: '相关性', field: 'related_text' }
        ]
    }

    getRelatedTree() {
        return {
            branches: [{
                    field: 'same_staff',
                    value: '相同',
                    branches: [{
                            field: 'same_time',
                            value: '相近',
                            branches: [{
                                field: 'same_pos',
                                value: '相同',
                                branches: [{
                                    field: 'has_clue',
                                    value: '无',
                                    related: '完全相关'
                                }, {
                                    field: 'same_pos',
                                    value: '有',
                                    related: '完全相关'
                                }]
                            }, {
                                field: 'same_pos',
                                value: '不同',
                                branches: [{
                                    field: 'has_clue',
                                    value: '无',
                                    related: '高相关'
                                }, {
                                    field: 'same_pos',
                                    value: '有',
                                    related: '高相关'
                                }]
                            }]
                        },
                        {
                            field: 'same_time',
                            value: '不相近',
                            branches: [{
                                field: 'same_pos',
                                value: '相同',
                                branches: [{
                                    field: 'has_clue',
                                    value: '无',
                                    related: '高相关'
                                }, {
                                    field: 'same_pos',
                                    value: '有',
                                    related: '中相关'
                                }]
                            }, {
                                field: 'same_pos',
                                value: '不同',
                                branches: [{
                                    field: 'has_clue',
                                    value: '无',
                                    related: '中相关'
                                }, {
                                    field: 'same_pos',
                                    value: '有',
                                    related: '低相关'
                                }]
                            }]
                        }
                    ]
                },
                {
                    field: 'same_staff',
                    value: '不同',
                    branches: [{
                            field: 'same_time',
                            value: '相近',
                            branches: [{
                                field: 'same_pos',
                                value: '相同',
                                branches: [{
                                    field: 'has_clue',
                                    value: '无',
                                    related: '中相关'
                                }, {
                                    field: 'same_pos',
                                    value: '有',
                                    related: '中相关'
                                }]
                            }, {
                                field: 'same_pos',
                                value: '不同',
                                branches: [{
                                    field: 'has_clue',
                                    value: '无',
                                    related: '中相关'
                                }, {
                                    field: 'same_pos',
                                    value: '有',
                                    related: '中相关'
                                }]
                            }]
                        },
                        {
                            field: 'same_time',
                            value: '不相近',
                            branches: [{
                                field: 'same_pos',
                                value: '相同',
                                branches: [{
                                    field: 'has_clue',
                                    value: '无',
                                    related: '低相关'
                                }, {
                                    field: 'same_pos',
                                    value: '有',
                                    related: '低相关'
                                }]
                            }, {
                                field: 'same_pos',
                                value: '不同',
                                branches: [{
                                    field: 'has_clue',
                                    value: '无',
                                    related: '低相关'
                                }, {
                                    field: 'same_pos',
                                    value: '有',
                                    related: '低相关'
                                }]
                            }]
                        }
                    ]
                }, {
                    field: 'same_staff',
                    value: '',
                    related: '零相关'
                }
            ]
        }
    }
}
const service = new Service(config)
export default service;