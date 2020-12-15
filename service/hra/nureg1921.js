import constants from '../../common/constants'
import BaseService from '../base'

//ASEP决策树数据表
let config = {
    tableName: "NUREG_1921",
    columns: [
        { name: "guid", type: "VARCHAR(50)", ext: "PRIMARY KEY" }, //唯一ID
        { name: "foreign_id", type: "VARCHAR(50)", ext: "NOT NULL" }, //关联的主数据ID   
        { name: "intervene", type: "VARCHAR(50)" }, //成功干预
        { name: "same_team", type: "VARCHAR(50)" }, //班组
        { name: "cognition", type: "VARCHAR(50)" }, //认知
        { name: "prompt ", type: "VARCHAR(50)" }, //提示要求
        { name: "hr ", type: "VARCHAR(50)" }, //人力
        { name: "same_pos ", type: "VARCHAR(50)" }, //位置
        { name: "follow_time ", type: "VARCHAR(50)" }, //后续时间
        { name: "pressure ", type: "VARCHAR(50)" }, //压力
        { name: "related_text", type: "VARCHAR(50)" }, //相关性文本
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
            { name: '成功干预', field: 'intervene' },
            { name: '班组', field: 'same_team' },
            { name: '认知', field: 'cognition' },
            { name: '提升要求', field: 'prompt' },
            { name: '人力', field: 'hr' },
            { name: '位置', field: 'same_pos' },
            { name: '后续时间', field: 'follow_time' },
            { name: '压力', field: 'pressure' },
            { name: '相关性', field: 'related_text' }
        ]
    }

    getRelatedTree() {
        return {
            branches: [{
                    field: 'intervene',
                    value: '否',
                    branches: [{
                        field: 'same_team',
                        value: '相同',
                        branches: [{
                            field: 'cognition',
                            value: '共同',
                            related: '完全相关'
                        }, {
                            field: 'cognition',
                            value: '不同',
                            branches: [{
                                field: 'prompt',
                                value: '同时',
                                branches: [{
                                    field: 'hr',
                                    value: '充分',
                                    branches: [{
                                        field: 'same_pos',
                                        value: '相同',
                                        branches: [{
                                            field: 'pressure',
                                            value: '高',
                                            level: 8,
                                            related: '完全相关'
                                        }, {
                                            field: 'pressure',
                                            value: '中',
                                            level: 8,
                                            related: '高相关'
                                        }]
                                    }, {
                                        field: 'same_pos',
                                        value: '不同',
                                        branches: [{
                                            field: 'pressure',
                                            value: '高',
                                            level: 8,
                                            related: '中相关'
                                        }, {
                                            field: 'pressure',
                                            value: '中',
                                            level: 8,
                                            related: '低相关'
                                        }]
                                    }]
                                }, {
                                    field: 'hr',
                                    value: '不充分',
                                    related: '完全相关'
                                }]
                            }, {
                                field: 'prompt',
                                value: '顺序',
                                branches: [{
                                    field: 'same_pos',
                                    value: '相同',
                                    level: 6,
                                    branches: [{
                                        field: 'follow_time',
                                        value: '0 - 15',
                                        branches: [{
                                            field: 'pressure',
                                            value: '高',
                                            related: '完全相关'
                                        }, {
                                            field: 'pressure',
                                            value: '中',
                                            related: '高相关'
                                        }]
                                    }, {
                                        field: 'follow_time',
                                        value: '15 - 30',
                                        branches: [{
                                            field: 'pressure',
                                            value: '高',
                                            related: '高相关'
                                        }, {
                                            field: 'pressure',
                                            value: '中',
                                            related: '中相关'
                                        }]
                                    }, {
                                        field: 'follow_time',
                                        value: '30 - 60',
                                        branches: [{
                                            field: 'pressure',
                                            value: '高',
                                            related: '中相关'
                                        }, {
                                            field: 'pressure',
                                            value: '中',
                                            related: '低相关'
                                        }]
                                    }, {
                                        field: 'follow_time',
                                        value: '60 - 120',
                                        branches: [{
                                            field: 'pressure',
                                            value: '高',
                                            related: '低相关'
                                        }, {
                                            field: 'pressure',
                                            value: '中',
                                            related: '零相关'
                                        }]
                                    }]
                                }, {
                                    field: 'same_pos',
                                    value: '不同',
                                    level: 6,
                                    branches: [{
                                        field: 'pressure',
                                        value: '高',
                                        level: 8,
                                        related: '低相关'
                                    }, {
                                        field: 'pressure',
                                        value: '中',
                                        level: 8,
                                        related: '零相关'
                                    }]
                                }]
                            }]
                        }]
                    }, {
                        field: 'same_team',
                        value: '不同',
                        branches: [{
                            field: 'pressure',
                            value: '高',
                            level: 8,
                            related: '低相关'
                        }, {
                            field: 'pressure',
                            value: '中',
                            level: 8,
                            related: '零相关'
                        }]
                    }]
                },
                {
                    field: 'intervene',
                    value: '是',
                    related: '零相关'
                }
            ]
        }
    }
}
const service = new Service(config)
export default service;