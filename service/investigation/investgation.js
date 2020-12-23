import constants from '../../common/constants'
import BaseService from '../base'

/**
 * 问题普查 调查项目
 */



let config = {
    tableName: "investgation",
    columns: [
        { name: "guid", type: "VARCHAR(50)", ext: "PRIMARY KEY" }, //唯一ID
        { name: "foreign_id", type: "VARCHAR(50)", ext: "NOT NULL" }, //关联设备guid
        { name: "type1", type: "VARCHAR(50)", ext: "NOT NULL" }, //调查项分类
        { name: "type2", type: "VARCHAR(50)", ext: "NOT NULL" }, //调查项分类2
        { name: "code", type: "VARCHAR(50)", ext: "NOT NULL" }, //调查项编码
        { name: "name", type: "VARCHAR(500)", ext: "NOT NULL" }, //调查项名称
        { name: "value", type: "VARCHAR(10)", ext: "" }, //调查项结果
        { name: "remark", type: "VARCHAR(200)", ext: "" }, //调查结果备注
        { name: "project_id", type: "VARCHAR(50)", ext: "" }, //所属项目ID
        { name: "created_at", type: "INT", ext: "" }, //任务创建时间
        { name: "created_by", type: "VARCHAR(50)", ext: "" }, //创建人
        { name: "updated_at", type: "INT", ext: "" }, //修改人
        { name: "updated_by", type: "VARCHAR(50)", ext: "" } //修改时间
    ],
    datas: [],
    guidPrefix: "",
}
class Service extends BaseService {
    getRequestions() {
        return [{
            type1: '工作环境',
            type2: '环境',
            name: '人员是否可能接触有毒/有害或过冷/过热物质',
            code: 'R01',
            value: '否',
            remark: ''
        }, {
            type1: '工作环境',
            type2: '环境',
            name: '工作区域温度是否在18-26°之间（超出范围的需备注说明）',
            code: 'R02',
            value: '否',
            remark: ''
        }, {
            type1: '工作环境',
            type2: '环境',
            name: '工作区域湿度是否感觉舒适（如有湿度表，测量值应为50%左右；没有的话，根据感觉是否闷热、潮湿判断）',
            code: 'R03',
            value: '否',
            remark: ''
        }, {
            type1: '工作环境',
            type2: '视觉',
            name: '应急照明系统是否在所有运行区域提供合适的光线（根据光线刺眼、光线昏暗、阴影、影响查看设备/标签/指示的情况判断）',
            code: 'R04',
            value: '否',
            remark: ''
        }, {
            type1: '工作环境',
            type2: '视觉',
            name: '照明系统是否存在眩光和反光区域',
            code: 'R05',
            value: '否',
            remark: ''
        }, {
            type1: '工作环境',
            type2: '听觉',
            name: '电厂就地工作区域的固定背景噪声水平是否超过65dBA（相当于大声说话的音量）',
            code: 'R06',
            value: '否',
            remark: ''
        }, {
            type1: '工作环境',
            type2: '听觉',
            name: '在维修工作相对较少的区域内，固定背景噪声水平是否超过80dBA,如果超过的话，是否提供相应保护（大致为闹市区繁忙马路上的音量）',
            code: 'R07',
            value: '否',
            remark: ''
        }, {
            type1: '人机功效学',
            type2: '人的能力',
            name: '大部分正常的健康员工是否能够没有危险的完成操作或工作',
            code: 'R08',
            value: '否',
            remark: ''
        }, {
            type1: '人机功效学',
            type2: '人的能力',
            name: '物体是否方便操作人员持有（不需要不舒适/不易持久的姿势推、提、拉、扶、端一个物体）',
            code: 'R09',
            value: '否',
            remark: ''
        }, {
            type1: '人机功效学',
            type2: '人的能力',
            name: '操作是否需要异常/极端的身体姿势',
            code: 'R10',
            value: '否',
            remark: ''
        }, {
            type1: '人机功效学',
            type2: '人的能力',
            name: '是否需要频繁或持续的体力',
            code: 'R11',
            value: '否',
            remark: ''
        }, {
            type1: '人机功效学',
            type2: '人因陷阱',
            name: '是否符合传统习惯、常规习惯（例如红色代表开启，绿色代表关闭，反之则违背传统习惯；阀门指示方向与管道流向垂直为关，与管道流向平行为开等）',
            code: 'R12',
            value: '否',
            remark: ''
        }, {
            type1: '人机功效学',
            type2: '人因陷阱',
            name: '是否存在相同或类似的显示、控制或设备，容易混淆',
            code: 'R13',
            value: '否',
            remark: ''
        }, {
            type1: '可达性',
            type2: '身体可达性',
            name: '路径上是否存在障碍',
            code: 'R14',
            value: '否',
            remark: ''
        }, {
            type1: '可达性',
            type2: '身体可达性',
            name: '通道是否足够宽和深，以容纳必须的人员和设备/工具',
            code: 'R15',
            value: '否',
            remark: ''
        }, {
            type1: '可达性',
            type2: '身体可达性',
            name: '在需要用手进入操作的情况，操作通道是否足以容纳手及任何手持物',
            code: 'R16',
            value: '否',
            remark: ''
        }, {
            type1: '可达性',
            type2: '身体可达性',
            name: '操作区域是否存在危险，如滑倒的可能、未良好就位的设备、移动的机械设备等',
            code: 'R17',
            value: '否',
            remark: ''
        }, {
            type1: '可达性',
            type2: '视觉可达性',
            name: '人员是否容易找到设备（视线不存在永久或临时遮挡）',
            code: 'R18',
            value: '否',
            remark: ''
        }, {
            type1: '可达性',
            type2: '视觉可达性',
            name: '观察口是否足够大且可供双眼观察（如双目镜观察）',
            code: 'R19',
            value: '否',
            remark: ''
        }, {
            type1: '可达性',
            type2: '视觉可达性',
            name: '操作人员是否存在需要从倾斜方向来观察显示的情况',
            code: 'R20',
            value: '否',
            remark: ''
        }, {
            type1: '可达性',
            type2: '视觉可达性',
            name: '就地盘的操作人员是否能看到所有与任务相关的信息',
            code: 'R21',
            value: '否',
            remark: ''
        }, {
            type1: '可操作性',
            type2: '人的能力',
            name: '经授权的操作人员的知识/经验/技能水平是否足以完成操作',
            code: 'R22',
            value: '否',
            remark: ''
        }, {
            type1: '可操作性',
            type2: '人的能力',
            name: '操作该类设备是否有特殊的技能要求',
            code: 'R23',
            value: '否',
            remark: ''
        }, {
            type1: '可操作性',
            type2: '人的能力',
            name: '操作是否对人员的身体条件/精神状态有额外的要求',
            code: 'R24',
            value: '否',
            remark: ''
        }, {
            type1: '可操作性',
            type2: '布置',
            name: '操作对象间的距离是否足够大以防止临近的设备被误触发',
            code: 'R25',
            value: '否',
            remark: ''
        }, {
            type1: '可操作性',
            type2: '布置',
            name: '操作位置是否存在过高（需要钢平台、梯子、脚手架等工具）或过低等问题（如果是，标高多少？）',
            code: 'R26',
            value: '否',
            remark: ''
        }, {
            type1: '可操作性',
            type2: '工具/设备',
            name: '是否需要辅助设备或专用工具',
            code: 'R27',
            value: '否',
            remark: ''
        }, {
            type1: '可操作性',
            type2: '工具/设备',
            name: '是否有防误碰措施（如设置物理屏障、采用需要双重操作的复合式控制区等）',
            code: 'R28',
            value: '否',
            remark: ''
        }, {
            type1: '可操作性',
            type2: '工具/设备',
            name: '维修该类设备是否需要拆卸；是否容易拆卸。',
            code: 'R29',
            value: '否',
            remark: ''
        }, {
            type1: '可操作性',
            type2: '工具/设备',
            name: '是否可能出现非预期的设备工况',
            code: 'R30',
            value: '否',
            remark: ''
        }, {
            type1: '可操作性',
            type2: '工具/设备',
            name: '设备之间的关联性，维修是否影响到别的设备',
            code: 'R31',
            value: '否',
            remark: ''
        }, {
            type1: '可操作性',
            type2: '工具/设备',
            name: '是否设备过于灵敏，一经操作即无法挽回',
            code: 'R32',
            value: '否',
            remark: ''
        }, {
            type1: '可操作性',
            type2: '工具/设备',
            name: '设备操作是否有即时的反馈（能够通过相关状态及时判断操作结果）',
            code: 'R33',
            value: '否',
            remark: ''
        }, {
            type1: '可操作性',
            type2: '报警/标识',
            name: '是否存在标识不清/信息不足',
            code: 'R34',
            value: '否',
            remark: ''
        }, {
            type1: '可操作性',
            type2: '报警/标识',
            name: '是否存在扰人报警',
            code: 'R35',
            value: '否',
            remark: ''
        }, {
            type1: '可操作性',
            type2: '报警/标识',
            name: '是否缺少备用指示',
            code: 'R36',
            value: '否',
            remark: ''
        }, {
            type1: '可操作性',
            type2: '报警/标识',
            name: '是否可能出现临时仪表不可用',
            code: 'R37',
            value: '否',
            remark: ''
        }, {
            type1: '可操作性',
            type2: '报警/标识',
            name: '标识文字是否清晰、无歧义',
            code: 'R38',
            value: '否',
            remark: ''
        }, {
            type1: '可操作性',
            type2: '报警/标识',
            name: '能否轻松区分设备的状态（开关、上锁）',
            code: 'R39',
            value: '否',
            remark: ''
        }, {
            type1: '可操作性',
            type2: '报警/标识',
            name: '设标识/指示的位置是否能够轻松看到（如果不是的话，原因是什么？）',
            code: 'R40',
            value: '否',
            remark: ''
        }, {
            type1: '可操作性',
            type2: '报警/标识',
            name: '危险是否有警告标志',
            code: 'R41',
            value: '否',
            remark: ''
        }, {
            type1: '可操作性',
            type2: '报警/标识',
            name: '是否能准确标明设备的功能分组，不易混淆（机组号、系统、功能、介质、序列等）',
            code: 'R42',
            value: '否',
            remark: ''
        }, {
            type1: '可操作性',
            type2: '危害防护',
            name: '设备是否存在不规则突出部分',
            code: 'R43',
            value: '否',
            remark: ''
        }, {
            type1: '可操作性',
            type2: '危害防护',
            name: '操作对象是否具有危险能量级（高电压或高温），是否放置在人员不能碰触的位置（如辐射、酸碱），或为设备添加防护',
            code: 'R44',
            value: '否',
            remark: ''
        }, {
            type1: '可操作性',
            type2: '危害防护',
            name: '操作人员按照程序进行设备维护时，设备是否可能对人员造成危险',
            code: 'R45',
            value: '否',
            remark: ''
        }]
    }

    getTypes() {
        return ['工作环境', '人机功效学', '可达性', '可操作性']
    }

    getChildTypes(type) {
        let list = this.getRequestions().filter(r => r.type1 == type);
        let types = [],
            typesMap = {};
        list.forEach(item => {
            let type = item.type2;
            if (!typesMap[type]) {
                types.push(type);
                typesMap[type] = true;
            }
        })
        return types
    }
}
const service = new Service(config)
export default service