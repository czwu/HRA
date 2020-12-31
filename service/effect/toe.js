import constants from '../../common/constants'
import util from '../../common/util'
import BaseService from '../base'


//toe
let config = {
    tableName: "toe",
    columns: [
        { name: "guid", type: "VARCHAR(50)", ext: "PRIMARY KEY" }, //唯一ID
        { name: "foreign_id", type: "VARCHAR(50)", ext: "NOT NULL" }, //关联场景/事件ID
        { name: "type", type: "VARCHAR(50)" }, //主类型 分为  全局情景因子 识别报警 检测指示状态 情景/问题理解 相应计划决策 操作 交流和协调   
        { name: "question", type: "VARCHAR(50)" }, //问题项名称
        { name: "question_index", type: "VARCHAR(50)" }, //问题项下标 从1开始
        { name: "option_name", type: "VARCHAR(50)" }, //问题选项
        { name: "option_index", type: "VARCHAR(50)" }, //问题选项下标 从1开始       
        { name: "value1", type: "VARCHAR(100)" }, //扩展值2
        { name: "value2", type: "VARCHAR(100)" }, //扩展值2
        { name: "descrip", type: "VARCHAR(100)" }, //其他具体的,内容
        { name: "project_id", type: "VARCHAR(50)" }, //所属项目ID 
        { name: "created_at", type: "INT" }, //任务创建时间
        { name: "created_by", type: "VARCHAR(50)" }, //创建人
        { name: "updated_at", type: "INT" }, //修改人
        { name: "updated_by", type: "VARCHAR(50)" }, //修改时间
        { name: "delete_flag", type: "INT", ext: " DEFAULT 0 " }
    ],
    datas: [],
    guidPrefix: ""
}
class Service extends BaseService {

    getQuestions() {
        let questions = [{
                type: '全局情景因子',
                questions: [{
                    question: '工作负荷',
                    options: [
                        "一般：所有班组成员都有第二人检查和后备",
                        "共同的需求：一个班组成员有自己的任务但没有后备；所有其他人员都有一般的第二人检查和后备",
                        "多个共同的需求：超负荷，没有第二人检查。所有人都有各自的任务但没有后备"
                    ]
                }, {
                    question: '时间临界状态',
                    options: [
                        "充足的可用时间",
                        "一般的可用时间",
                        "大部分在控制室内：控制室内的高水平的近距离交流（协调不同盘台的操纵员操作）"
                    ]
                }, {
                    question: '交流的程度',
                    options: [
                        "一般：在主控室内标准水平的三向交流，并偶尔和就地沟通",
                        "大部分在就地：就地操作员之间的高水平的近距离交流（例如协调火灾的响应）",
                        "几乎没有足够的可用时间：例如高节奏和时间紧迫的任务"
                    ]
                }, {
                    question: '其他方面',
                    options: [
                        "非标准的：反常的情景迫使操纵员考虑先前的发现/事件/失效",
                        "嘈杂的环境：吵杂的环境噪声使得交流具有挑战性",
                        "协调：需要和就地人员密切协调",
                        "广播不可用：需要使用广播但不可用",
                        "多个需求：对精力有多个竞争性的需求/注意力不集中",
                        "记忆：需要记忆"
                    ]
                }]
            },
            {
                type: '识别报警',
                questions: [{
                    question: '识别模式',

                    options: [
                        "显示：基于一个或多个自动显示线索的识别",
                        "规程导向的检查：规程指导操纵员来检查报警",
                        "规程导向的监视：报警在规程特定的监视列表中",
                        "注意/检查：通过先前获取的信息指引"
                    ]
                }, {
                    question: '报警盘状态',
                    options: [
                        "黑色：单个报警或一组报警指向系统问题",
                        "忙：除紧急报警外，报警盘发出一些（但不是很多）其他的报警",
                        "超负荷：除紧急报警外，报警盘发出许多其他的报警"
                    ]
                }, {
                    question: '报警/指示变化的预期',
                    options: [
                        "预期的：根据他们对电厂当前状态的理解（包括由于维修和测试不在线的系统），报警或者指示的变化是预期的",
                        "不是预期的：操纵员没有料到会有这个报警或者指示的变化",
                        "规程导向的监视：报警在规程特定的监视列表中",
                        "不适应"
                    ]
                }]
            },
            {
                type: '监测指示状态',
                questions: [{
                    question: '识别模式',
                    options: [
                        "规程导向的检查：规程指导班组成员检查特定的指示或参数",
                        "规程导向的监视",
                        "知识型监视：对情景的知识或者参数变化的预期促使班组监视",
                        "注意/检查：没有规程导向的监视或者对电厂参数的关注"
                    ]
                }, {
                    question: '变化幅度',
                    options: [
                        "轻微的变化：例如，需要努力才能识别到的变化",
                        "明显的变化：例如，当看到时，非常显著并可立即识别到的变化"
                    ]
                }, {
                    question: '报警/指示变化的预期',
                    options: [
                        "没有模拟机仿真：需要操纵员根据记忆来应对",
                        "小的指示：只能在近距离才能看到",
                        "类似的显示：同一块控制盘台上有多个完全相同的显示"
                    ]
                }]
            },
            {
                type: '情景/问题理解',

                questions: [{
                    question: '识别模式',
                    options: [
                        "技能",
                        "规程",
                        "基于知识型"
                    ]
                }, {
                    question: '熟悉程度',
                    options: [
                        "标准的：班组可根据先前的培训应对这个挑战",
                        "新的：这涉及到带来挑战的变化，例如一个新的规程、场景或者任务",
                        "异常的：标准的培训需要适应异常情景（例如，规程没有包括的状况）"
                    ]
                }, {
                    question: '输出',
                    text_index: 1, //text 
                    text1: "规程ID ",
                    text2: "步骤",
                    value1: "",
                    value2: "",
                    options: [
                        "规程：诊断结果是执行规程步骤，或目前执行规程步骤的跳转或跳转至其他规程。",
                        "技能：诊断结果是执行技能型操作",
                        "知识型：诊断结果是执行知识型操作"
                    ]
                }, {
                    question: '信息集成',
                    options: [
                        "信息的时间：包括较慢的信息反馈和延时的信息",
                        "不明确的信息：系统提供的信息含糊不清或不能指向问题的本质",
                        "集成要求：诊断要求多个信息的集成"
                    ]
                }, {
                    question: '信息具体性',
                    options: [
                        "具体的：报警/报警模式/指示指向具体的系统问题",
                        "不具体的：报警/或指示不能直接指向具体的系统问题，需要操纵员认知来努力集成这些信息，并识别具体的系统问题",
                        "不适用"
                    ]
                }, {
                    question: '信息质量',
                    options: [
                        "丢失的信息：包括被掩盖的信息",
                        "误导的信息：导致错误诊断的信息",
                        "冲突的信息：指向不止一个诊断或者和其他报警或指示冲突的信息"
                    ]
                }, {
                    question: '其他（具体的）:',
                    input: true,
                    desc: ""

                }]
            },
            {
                type: '响应计划决策',
                questions: [{
                    question: '决策基础',
                    options: [
                        "规程：由规程或者其他导则指引的决策",
                        "技能：技能指引的决策；无规程，操纵员可根据记忆决策",
                        "知识：无规程可用；班组成员根据工程或技术知识和操作经验来响应"
                    ]
                }, {
                    question: '熟悉性',
                    options: [
                        "标准的：班组可根据先前的培训应对这个挑战",
                        "新的：这涉及到带来挑战的变化，例如一个新的规程、场景或者任务",
                        "异常的：标准的培训需要适应异常情景（例如，规程没有包括的状况）"
                    ]
                }, {
                    question: '不确定性',
                    options: [
                        "清晰：无不确定性或竞争性的目标 –决策准则清晰",
                        "不确定：缺少信息或模糊不清的决策准则",
                        "竞争性的优先级：多个竞争性的目标，可预见的严重的后果",
                        "冲突性的导则：政策、实践和规程有冲突性的导则"
                    ]
                }, {
                    question: '其他（具体的）:',
                    input: true,
                    desc: ""

                }]
            },
            {
                type: '操作',

                questions: [{
                    question: '操作类型',
                    options: [
                        "简单明了",
                        "顺序：一系列不连续的操作需要以特定的顺序执行",
                        "监视：动态控制操作需要持续监视和操作来控制和保持一个参数在特定范围内"
                    ]
                }, {
                    question: '位置',
                    options: [
                        "主或辅助控制盘",
                        "后备盘"
                    ]
                }, {
                    question: '导则',
                    options: [
                        "规程：操作由规程指引",
                        "操作技能（非故障的硬件）：在非故障的指示或者硬件的情况下，该操作由操作技能而非导则来指导",
                        "STAR（故障硬件）：在故障的指示或者硬件的情况下，操纵员需要进行STAR（stop-think-act-review）"
                    ]
                }, {
                    question: '恢复能力',
                    options: [
                        "立即恢复：可通过纠正，该操作可被立即恢复",
                        " 不确定：缺少信息或模糊不清的决策准则",
                        "竞争性的优先级：多个竞争性的目标，可预见的严重的后果"
                    ]
                }, {
                    question: '信息具体性',
                    options: [
                        "反直觉的电厂响应：电厂状态与直觉矛盾",
                        "反直觉的控制：控制需要反直觉的操作",
                        "多余的精力来努力：执行该操作需要执行的活动，例如机组切换或心算",
                        "不恰当的反馈：系统/控制状态反馈缺失或迟缓",
                        "相似的控制：在相同控制盘台上的相似控制"
                    ]
                }, {
                    question: '其他（具体的）:',
                    input: true,
                    desc: ""
                }]
            },
            {
                type: '交流和协调',
                questions: [{
                    question: '交流驱动',
                    options: [
                        "程导向（而不是简报）"
                    ]
                }, {
                    question: '方向',
                    text_index: 2, //text 
                    text1: "请求：模拟机模拟的操作（具体到需要交互的部件） ",
                    text2: "执行操作延时（具体延迟时间）",
                    value1: "",
                    value2: "",
                    options: [
                        "来自电话（而不是简报）",
                        "通过电话（例如和就地操作员）",
                        "没有特别的驱动方向（例如和就地操作员）",
                        "后备盘"
                    ]
                }, {
                    question: '其他（具体的）:',
                    input: true,
                    desc: ""
                }]
            }
        ]
        questions.forEach((group, i) => {
            group.questions.forEach((question, j) => {
                question.question_index = `${i+1}-${j+1}`
                let options = question.options;
                question.options = []
                options && options.forEach((option, index) => {
                    let css = option == '通过电话（例如和就地操作员）' ? 'warp-row' : '' //该选项含有两个输入框,整体过长,需要换行
                    question.type = group.type;
                    question.options.push({ name: option, selected: false, index: index + 1, css })
                })
            })
        })
        return questions;
    }

}

const service = new Service(config)
export default service;