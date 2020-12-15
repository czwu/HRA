import constants from '../../common/constants'
import BaseService from '../base'

//ASEP决策树数据表
let config = {
    tableName: "ASEP",
    columns: [
        { name: "guid", type: "VARCHAR(50)", ext: "PRIMARY KEY" }, //唯一ID
        { name: "foreign_id", type: "VARCHAR(50)", ext: "NOT NULL" }, //关联的主数据ID   
        { name: "parallel_relationship", type: "VARCHAR(50)" }, //是否属于并联关系
        { name: "same_staff", type: "VARCHAR(50)" }, //人员是否相同
        { name: "same_time", type: "VARCHAR(50)" }, //时间是否相近
        { name: "same_view", type: "VARCHAR(50)" }, //是否同一视野标度
        { name: "has_record", type: "VARCHAR(50)" }, //是否有书面记录
        { name: "same_area", type: "VARCHAR(50)" }, //是否在同一区域
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
    guidPrefix: "asep_",
}
class AsepService extends BaseService {
    getFormItems() {
        return [
            // { name: '时间是否相近', field: 'same_staff', datatype: 'string', type: 'switch', defaultValue: '是', values: ['否', '是'] },
            { name: '备注', field: 'remark', datatype: 'string', type: 'text-media', css: 'long-col' }
        ]
    }

    getRelatedFields() {
        return [
            { name: '是否属于并联关系', field: 'parallel_relationship' },
            { name: '人员是否相同', field: 'same_staff' },
            { name: '时间是否相近', field: 'same_time' },
            { name: '是否同一视野标度', field: 'same_view' },
            { name: '是否有书面记录', field: 'has_record' },
            { name: '是否在同一区域', field: 'same_area' },
            { name: '相关性等级', field: 'related_text' }
        ]
    }

    getRelatedTree() {
        return {
            branches: [{
                field: 'parallel_relationship',
                value: '是',
                branches: [{
                        field: 'same_staff',
                        value: '是',
                        branches: [{
                                field: 'same_time',
                                value: '是',
                                branches: [{
                                        field: 'same_view',
                                        value: '是',
                                        related: '完全相关'
                                    },
                                    {
                                        field: 'same_view',
                                        value: '否',

                                        branches: [{
                                                field: 'has_record',
                                                value: '是',
                                                related: '零相关'
                                            },
                                            {
                                                field: 'has_record',
                                                value: '否',

                                                branches: [{
                                                        field: 'same_area',
                                                        value: '是',
                                                        related: '高相关'
                                                    },
                                                    {
                                                        field: 'same_area',
                                                        value: '否',
                                                        related: '零相关'
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                field: 'same_time',
                                value: '否',
                                related: '零相关'
                            }
                        ]
                    },
                    {
                        field: 'same_staff',
                        value: '否',
                        related: '零相关'
                    }
                ]
            }, {
                field: 'parallel_relationship',
                value: '否',
                related: '零相关'
            }]
        }
    }
}
const service = new AsepService(config)

export default service;