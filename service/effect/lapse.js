import constants from '../../common/constants'
import BaseService from '../base'

//人员效能->场景->绩效评分 失误模式选项数据表 
let config = {
    tableName: "lapse",
    columns: [
        { name: "guid", type: "VARCHAR(50)", ext: "PRIMARY KEY" }, //唯一ID
        { name: "foreign_id", type: "VARCHAR(50)", ext: "NOT NULL" }, //关联的主数据ID  关联场景
        { name: "type", type: "INT" }, //失误模式分类
        { name: "name", type: "VARCHAR(200)" }, //当前选中项的名称
        { name: "code", type: "VARCHAR(200)" }, //当前选中项的code  
        { name: "parent_code", type: "VARCHAR(200)" }, //父级code 
        { name: "remark", type: "VARCHAR(200)" }, //补充备注
        { name: "project_id", type: "VARCHAR(50)" }, //所属项目ID 
        { name: "created_at", type: "INT" }, //任务创建时间
        { name: "created_by", type: "VARCHAR(50)" }, //创建人
        { name: "updated_at", type: "INT" }, //修改人
        { name: "updated_by", type: "VARCHAR(50)" } //修改时间
    ]
}
class Service extends BaseService {
    getOptionList(treeList) {
        let list = []
        this.treeEach(treeList, (data, parent) => {
            if (parent) {
                data.type = parent.type
                data.parent_code = parent.code
            }
            if (data.type_code) {
                data.expand = true;
            }
            data.selected = false;
            data.remark = ''
            data.guid = this.genGuid();
            list.push(data);
        });
        return list;
    }

    treeEach(treeData, fn, parent) {
        treeData.forEach(data => {
            fn(data, parent);
            if (data.options) {
                this.treeEach(data.options, fn, data)
            }
        })
    }

    getLapseOptions() {
        let options = [{
                type: '监视/识别',
                type_code: 'T1',
                options: [
                    { name: '报警问题:关键报警未识别或未响应', code: 'T1-01' },
                    { name: '指示问题:关键参数值未识别或未正确读取', code: 'T1-02' },
                    {
                        name: '其他（详细说明）:',
                        inputField: 'text1',
                        code: 'T1-03'
                    }
                ]
            },
            {
                type: '理解',
                type_code: 'T2',
                options: [
                    { name: '解释错误：关键数据解释错误', code: 'T2-01' },
                    { name: '不信任：不采用、不信任或不重视关键数据', code: 'T2-02' },
                    { name: '不正确/不完整：未能形成正确理解或修正最初的错误观念', code: 'T2-03' },
                    { name: '意识：缺乏电厂情景意识', code: 'T2-04' },
                    { name: '迟缓：对电厂参数的理解迟缓', code: 'T2-05' },
                    {
                        name: '其他（详细说明）:',
                        inputField: 'text1',
                        code: 'T2-06'
                    }
                ]
            },
            {
                type: '完成响应计划/规程',
                type_code: 'T3',
                options: [{
                        group: 'T3', //同一组为单选, 带有group 属性的,都说明为单选
                        code: 'T3-01',
                        name: '相关的规程导则可用',
                        options: [
                            { group: 'T3-01', name: '未查阅：未查阅可用的规程', code: 'T3-01-01' },
                            {
                                name: '遵循问题：遵循或使用规程有困难',
                                group: 'T3-01',
                                code: 'T3-01-02',
                                options: [
                                    { name: '错误：使用或转入错误的规程', code: 'T3-01-02-01' },
                                    { name: '解释错误：规程指令解释错误', code: 'T3-01-02-02' },
                                    { name: '偏离：错误的决定偏离正确规程', code: 'T3-01-02-03' },
                                    { name: '特殊的/集中的失误：解释错误、遗漏或不正确执行某步骤中的一个或多个子步骤', code: 'T3-01-02-04' },
                                    { name: '使用原则：违反一般使用原则（说明）：', code: 'T3-01-02-05' },
                                    { name: '其他（详细说明）：', code: 'T3-01-02-06' }
                                ]
                            },
                            {
                                name: '不适用：不适用当前情景',
                                group: 'T3-01',
                                options: [
                                    { name: '前瞻性：未能采取前瞻操作/预期所需操作', code: 'T3-01-03-01' },
                                    { name: '适用性：规程不适用于情景', code: 'T3-01-03-02' },
                                    { name: '重新评估：未能随着情景变化重新评估/修改响应', code: 'T3-01-03-03' },
                                    { name: '特殊的/集中的失误：解释错误、遗漏或不正确执行某步骤中的一个或多个子步骤', code: 'T3-01-03-04' },
                                    { name: '优先级：未能正确平衡优先级别', code: 'T3-01-03-05' },
                                    { name: '其他（详细说明）：', code: 'T3-01-03-06' }
                                ],
                                code: 'T3-01-03'
                            }
                        ]
                    },
                    {
                        group: 'T3',
                        code: 'T3-02',
                        name: '相关的规程导则不可用',
                        options: [
                            { name: '选择：作出错误的选择', code: 'T3-02-01' },
                            { name: '全面性：未能考虑所有的选择', code: 'T3-02-02' },
                            { name: '延迟：决策延迟', code: 'T3-02-03' },
                            { name: '其他（详细说明）:', code: 'T3-02-04' }
                        ]
                    }
                ]
            },
            {
                type: '操作',
                type_code: 'T4',
                options: [
                    { group: 'T4', name: '操作未执行：忘记执行所需操作', radio: true, code: 'T4-01' },
                    {
                        group: 'T4',
                        code: 'T4-02',
                        name: '连续性操作执行不正确',
                        options: [
                            { name: '错误的对象', code: 'T4-02-01' },
                            { name: '错误的位置', code: 'T4-02-02' },
                            { name: '遗漏：遗漏一个或多个步骤', code: 'T4-02-03' },
                            { name: '顺序：按照错误的顺序执行操作', code: 'T4-02-04' },
                            { name: '状态错误：未执行主操作中的关键操作', code: 'T4-02-05' },
                            {
                                name: '其他（详细说明）:',
                                code: 'T4-02-06'
                            }
                        ]
                    },
                    { group: 'T4', name: '动态的手动控制：动态的手动控制问', radio: true, code: 'T4-03' },
                    {
                        group: 'T4',
                        code: 'T4-04',
                        name: '其他（详细说明）:'
                    }
                ]
            },
            {
                type: '管理',
                type_code: 'T5',
                multi: true,
                options: [{
                        group: 'T5',
                        code: 'T5-01',
                        name: '全局监视错误',
                        options: [
                            { name: '大屏幕画面：未持续关注电厂状态或情景的大屏幕画面', code: 'T5-01-01' },
                            { name: '不充分的全局监视：未充分监视任务', code: 'T5-01-02' },
                            { name: '标准水平：未达到标准水平', code: 'T5-01-03' },
                            { name: '简报：简报不达标（沟通问题）', code: 'T5-01-04' },
                            { name: '反应性：未持续关注反应性（理解事件如何影响反应堆堆芯）', code: 'T5-01-05' },
                            { name: '技术规格书：未持续关注技术规格书', code: 'T5-01-06' }
                        ]
                    },
                    {
                        group: 'T5',
                        code: 'T5-02',
                        name: '领导能力失效：未能保证清晰的指令',
                        options: [
                            { name: '指令沟通：班组设置或沟通指令不充分', code: 'T5-02-01' },

                            { name: '指令沟通：班组设置或沟通指令不充分', code: 'T5-02-02' },
                            {
                                name: '团队功能：未形成/保持有效的团队合作',
                                code: 'T5-02-03',
                                options: [
                                    { name: '积极响应：所有成员未积极响应', code: 'T5-02-03-01' },
                                    { name: '质疑态度：不鼓励质疑的态度', code: 'T5-02-03-02' },
                                    { name: '团队角色：未形成团队角色的理解', code: 'T5-02-03-03' },
                                    { name: '民意测验：未提供机会获得其他人员的输入', code: 'T5-02-03-04' }
                                ]
                            },
                            { name: '优先级错误：优先级错误（最重要事项排第一）', code: 'T5-02-04' },
                            { name: '分配问题：任务分配失败', code: 'T5-02-05' },
                            { name: '太被动：保持一种被动态度而不是主动态度', code: 'T5-02-06' },
                            { name: '班组负荷问题：未有效的使用资源', code: 'T5-02-07' }
                        ]
                    },

                    {
                        group: 'T5',
                        code: 'T5-03',
                        name: '其他（详细说明）:'
                    }
                ]
            },
            {
                type: '团队协作',
                type_code: 'T6',

                options: [
                    { name: '协调性差：未能协调好精力，如协调由于电厂操纵员汽轮机降负荷太快反应堆操纵员未能支持的问题', code: 'T6-01' },
                    { name: '缺乏归属意识：缺乏已定义好的角色或责任导致缺乏归属意识', code: 'T6-02' },
                    { name: '主题归类：操纵员未告知其他人员操作的影响', code: 'T6-03' },
                    { name: '缺乏共同的理解：缺乏共同的理解和指导', code: 'T6-04' },
                    { name: '人员冲突：相互之间不尊重或未解决人员冲突', code: 'T6-05' },
                    { name: '概括性/包含性差：部分班组成员起支配作用，而其他人不愿意提供输入', code: 'T6-06' },
                    {
                        name: '简报遗漏或不完全',
                        code: 'T6-07',

                        options: [
                            { name: '未开展情景简报', code: 'T6-07-01' },
                            { name: '未记录班组更新', code: 'T6-07-02' },
                            { name: '已做简报差/不清晰', code: 'T6-07-03' }
                        ]
                    },
                    {
                        name: '其他（详细说明）:',
                        code: 'T6-08'
                    }
                ]
            },
            {
                type: '沟通',
                type_code: 'T7',
                options: [{
                        group: 'T7',
                        code: 'T7-01',
                        name: '指令发出者失误：指令发出者未沟通或沟通不正确',
                        options: [
                            { name: '未沟通：关键信息未沟通', code: 'T7-01-01' },
                            {
                                name: '沟通不正确',
                                code: 'T7-01-02',
                                options: [
                                    { name: '错误的信息', code: 'T7-01-02-01' },
                                    { name: '不完整的信息', code: 'T7-01-02-02' },
                                    { name: '不准确的信息', code: 'T7-01-02-03' },
                                    { name: '模棱两可的信息：沟通内容不具体', code: 'T7-01-02-04' },
                                    {
                                        name: '其他（详细说明）:',
                                        inputField: 'text1',
                                        code: 'T7-01-02-05'
                                    },
                                ]
                            }, {
                                name: '沟通不达标',
                                code: 'T7-01-03',
                                options: [
                                    { group: 'T7-01-03', name: '指导性差：未指向正确人员', code: 'T7-01-03-01' },
                                    { group: 'T7-01-03', name: '错误的格式：使用不正确的术语表达或清晰度', code: 'T7-01-03-02' },
                                    { group: 'T7-01-03', name: '时机差：太早或太晚', code: 'T7-01-03-03' },
                                    {
                                        group: 'T7-01-03',
                                        name: '其他（详细说明）:',
                                        code: 'T7-01-03-04'
                                    },
                                ]
                            }
                        ]
                    },
                    {
                        group: 'T7',
                        code: 'T7-02',
                        name: '接收者理解错误',
                        options: [{
                            group: 'T7-02',
                            name: '未复述：理解错误且未复述',
                            code: 'T7-02-01'
                        }, {
                            group: 'T7-02',
                            name: '复述:指令发出者未纠正',
                            code: 'T7-02-02'
                        }]
                    }
                ]
            }
        ];
        return options
    }

} { name: '' }
const service = new Service(config)
export default service;