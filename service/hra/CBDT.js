import constants from '../../common/constants'
import BaseService from '../base'

//ASEP决策树数据表
let config = {
    tableName: "CBDT",
    columns: [
        { name: "guid", type: "VARCHAR(50)", ext: "PRIMARY KEY" }, //唯一ID
        { name: "foreign_id", type: "VARCHAR(50)", ext: "NOT NULL" }, //关联的主数据ID   
        { name: "group_name", type: "VARCHAR(10)" }, //组名称
        { name: "item_index", type: "INT" }, // 问题在组中的序号 一个组分为 多个问题 使用index 区分  1,2,3,4,5
        { name: "item_name", type: "VARCHAR(50)" }, // 调查项目名称
        { name: "item_value", type: "INT" }, //调查项选值 1:是 与 0 :否  
        { name: "item_answer", type: "VARCHAR(200)" }, //问题回答
        { name: "item_doc", type: "VARCHAR(200)" }, //相关文件
        { name: "item_remark", type: "VARCHAR(200)" }, //备注
        { name: "project_id", type: "VARCHAR(50)" }, //所属项目ID
        { name: "created_at", type: "INT" }, //任务创建时间
        { name: "created_by", type: "VARCHAR(50)" }, //创建人
        { name: "updated_at", type: "INT" }, //修改人
        { name: "updated_by", type: "VARCHAR(50)" }, //修改时间
        { name: "delete_flag", type: "INT", ext: " DEFAULT 0 " }
    ],
    datas: [],
    guidPrefix: "CBDT_",
}
class Service extends BaseService {

    initCBDT(foreign_id, callback) {
        let items = this.getCBDTItems();
        this.query({ foreign_id: foreign_id }).then(datas => {
            if (!datas.length) {
                items.forEach(item => {
                    item.guid = this.genGuid();
                    item.foreign_id = foreign_id;
                    item.item_value = 0;
                    item.item_answer = '';
                    item.item_doc = '';
                    item.item_remark = ''
                })
                this.insertList(items, 'multi');
                callback(items);
            } else {
                datas.forEach(data => {
                    items.forEach(item => {
                        if (item.group_name == data.group_name && item.item_index == data.item_index) {
                            Object.assign(item, data)
                        }
                    })
                })
                callback(items);
            }
        })
    }

    getCBDTItems() {
        let items = [{
                group_name: 'pca',
                item_index: '1',
                item_name: '控制室有用的指示',
                req: '控制室的指示可用：控制室内所要求的指示是否可用？'
            },
            {
                group_name: 'pca',
                item_index: '2',
                item_name: '控制室精确的指示',
                req: '控制室的指示精确：可用的指示是否精确，或者操纵员是否知道其不精确（例如，由于就地极端环境或仪表的隔离导致仪表的降级）'
            },
            {
                group_name: 'pca',
                item_index: '3',
                item_name: '规程中警告/可选择',
                req: '规程中有警示/替代信息：如果正常显示的信息预期不可靠时，规程中是否能提供警示或替代信息的注释？'
            },
            {
                group_name: 'pca',
                item_index: '4',
                item_name: '指示器培训',
                req: '指示信息的培训：班组成员是否接受过与本场景相似条件下解释或获取所需信息的培训。'
            },
            {
                group_name: 'pcb',
                item_index: '1',
                item_name: '低 vs 高  工作量 ',
                req: '高vs低工作负荷：在高工作负荷或注意力分散时，对人机界面关键的线索是否会出现？工作负荷或注意力分散可导致注意力不集中（计划性检查的遗漏），这对于Pcb来说是一个最基本的失效机理，并且其与以下两个因素相互作用。'
            },
            {
                group_name: 'pcb',
                item_index: '2',
                item_name: '检查 vs 监控',
                req: '检查或监测：是否要求操纵员对某个参数进行一次检查，或是否要求操纵员持续监测直到参数达到某个特定值。监测分支失效的一个相对较高概率发生于在指示超出阈值之前，未能足够频繁地进行监控，从而捕捉到所要求的阈值，而不是偶尔性检查参数的这种完全失效。'
            },
            {
                group_name: 'pcb',
                item_index: '3',
                item_name: '前面 vs 后面 仪表盘',
                req: '操作台或后备盘：要检查的指示信号是否在操作台的主要控制区域显示，或操纵员是否需要离开主要控制区域去检查指示信号？如果这样的话，操纵员更有可能会分散注意力，或只是关注其认为更具有紧迫性的事情，而不是立刻去观察信号。这将增加其遗忘的概率。'
            },
            {
                group_name: 'pcb',
                item_index: '4',
                item_name: '报警 vs 不报警',
                req: '报警或未报警：线索的临界值是否被信号指示灯发出？如果是的话，操纵员更有可能自己去检查它，报警更多充当一个预先存在的恢复机制或一个增加的安全因素。对于某个参数达到或超出特定值（CP-2和CP-3类人机界面）触发动作，这些分支应当仅在报警设定值接近预订临界值的情况下使用；如果报警在达到相关值之前很久就达到了，它可能会被消声，因此不能作为有效的恢复机制。'
            },
            {
                group_name: 'pcc',
                item_index: '1',
                item_name: '指示器容易定位',
                req: '指示信号易于定位：布局、界限划分、操作台的标签等是否有利于快速定位所需要的指示信号？如果这些区域存在明显的人因缺陷，并且存在与正确的指示信号非常相似、十分易于混淆的候选对象，以致显示的值导致操纵员不会再读数后重新检查指示信号一致性，则答案是否。'
            },
            {
                group_name: 'pcc',
                item_index: '2',
                item_name: '易读数/不易读数 指示器',
                req: '良好/不好的指示器：所需的指示器是否存在可能导致读数错误的人因工程缺陷？如果是的话，继续以下分支。'
            },
            {
                group_name: 'pcc',
                item_index: '3',
                item_name: '正式交流',
                req: '正式交流：是否存在正式或半正式的沟通协议。在这份协议中规定，发送数值的人总是与那些与该值相关联的参数一直（这种有限的形式足以使接收信息的人在理解他的请求时，察觉到其中可能存在的任何错误）'
            },
            {
                group_name: 'pcd',
                item_index: '1',
                item_name: '如上所述 所有线索',
                req: '所有线索都存在：规程中是否存在线索状态或参数值？例如，如果蒸汽管线放射性高作为决策或动作的标准之一，蒸汽管线放射性指示器则显示为高，而不是正常值。如果指示信号没有明显失效，但不会给出规程中规定的数值，则选择“NO”分支（例如，蒸汽管线被隔离）。'
            },
            {
                group_name: 'pcd',
                item_index: '2',
                item_name: '差异的警告',
                req: '差异警告：如果线索可能不同于预期时，规程中是否提供了警告，或者如果提示状态不符合说明，请提供如何继续操作的说明。'
            },
            {
                group_name: 'pcd',
                item_index: '3',
                item_name: '特殊培训',
                req: '特定的培训。操作员是否接受过与当前情景的信号布局类似，并强调面对信号状态恶化情况下能够对规程做出正确理解的模拟机培训？'
            },
            {
                group_name: 'pcd',
                item_index: '4',
                item_name: '普通培训',
                req: '一般性培训：操作人员是否接受过使他们能够认识到信号/提示等在当前情景下情况下是错误的培训？也就是说，一些每个持证操纵员都应该知道的事情。以隔离蒸汽管道上的放射性检测器为例，答案是“是”，因为管道隔离非常常见；对于只有在非常特殊的情况下才会出现的设备异常，答案是“否”，除非在培训中对特定情况给予了一些强调。在没有预先警告的情况下，不能指望操作员根据其对设备的一般知识来推理特定指标的行为，并且对他们的时间和注意力有许多其他要求。'
            },
            {
                group_name: 'pce',
                item_index: '1',
                item_name: '明显的 vs 隐藏的',
                req: '明显的VS潜在的。相关指令是一个单独的、独立编号的步骤，则选上面的分支，或者说相关指令是以某种方式隐藏起来，使人很容易忽略，，这种情况选下面的分支。例如，段落中的某个指令，是在注释或警告中，还是或在一页的背面？'
            },
            {
                group_name: 'pce',
                item_index: '2',
                item_name: '单一的 vs 多样的',
                req: '单个vs多个：在使用人机界面读取规程时，是使用多本规程还是仅使用一列的流程图规程？如果是这样的话，选择下面的分支。'
            },
            {
                group_name: 'pce',
                item_index: '3',
                item_name: '用图表表示清楚额',
                req: '清晰明了的图形化显示：操作人机界面的步骤某种程度上是否比周围其他步骤是否更显眼一些？例如，在流程图规程中组成分支顶点的步骤，由注释或警告开始的步骤，以及为了强调逻辑而排版的步骤，这些步骤相比单个动作步骤更加显眼，仅仅因为它们和周围的步骤明显不同而更不可能被忽略。然而，如果是在一次看到的几个这样的步骤（例如典型的流程图），这种效果将大打折扣。因此，流程图中两个分支的节点处的步骤应该清晰明了的图形化显示。'
            },
            {
                group_name: 'pce',
                item_index: '4',
                item_name: '定位工具',
                req: '放置保持辅助工具：所有工作人员是否使用位置保持辅助工具，如检查或标记已完成的步骤和标记待完成的步骤？'
            },
            {
                group_name: 'pcf',
                item_index: '1',
                item_name: '标准明确的措辞',
                req: '标准明确用语：该步骤是否包括不熟悉的术语还是不寻常的语法结构？有关措辞是否需要说明来达到预期的解释？是否需要通过推断电厂的未来状态来对这些步骤进行合理的理解？如果这些都不适用，请选择向上（是）分支。'
            },
            {
                group_name: 'pcf',
                item_index: '2',
                item_name: '所有需要的信息',
                req: '所有必须的信息：该步骤是否提供了识别所指示的动作及其对象所需的所有信息？'
            },
            {
                group_name: 'pcf',
                item_index: '3',
                item_name: '正在培训',
                req: '步骤训练：班组成员是否接受了与该人机界面类似情况下的培训，从而能够对这些步骤做出正确的理解？'
            },

            {
                group_name: 'pcg',
                item_index: '1',
                item_name: '“不”子',
                req: '“NOT”语句：步骤中是否包含“not”字样？'
            },
            {
                group_name: 'pcg',
                item_index: '2',
                item_name: '“和/或”',
                req: 'AND或OR语句：规程步骤是否存在诊断逻辑，需要结合多个条件来确定结果？'
            },
            {
                group_name: 'pcg',
                item_index: '3',
                item_name: '“和” “或”都有',
                req: 'AND和OR：该步骤是否包含涉及ANDed和ORed术语组合的复杂逻辑？'
            },
            {
                group_name: 'pcg',
                item_index: '4',
                item_name: '演习方案',
                req: '熟练的情景：班组成员是否在模拟机培训中练习过与此场景类似的内容？'
            },

            {
                group_name: 'pch',
                item_index: '1',
                item_name: '相信指令适当',
                req: '对指导/说明有充分的信心：班组成员是否相信所提供的说明适用于当前这种情况（即使存在潜在的不良后果）？他们对规程能够有效处理当前情景是否充满信心？实际上，这句话具体的意思是：他们是否在模拟机中使用过并发现它起作用?'
            },
            {
                group_name: 'pch',
                item_index: '2',
                item_name: '如果遵守得到相反结果',
                req: '释放、核电厂损坏（例如，对容器的热冲击），所需系统的不可用或反常？在当前的规定下，班组成员人员必须有强烈的动机违背规程要求，做出正确的决策。'
            },
            {
                group_name: 'pch',
                item_index: '3',
                item_name: '合理选择',
                req: '合理的选择。是否有其他较明显的替代方法，例如部分遵守规程或使用不同的系统，来完成该步骤的某些或全部目标，而不会产生该步骤所产生的不利后果？ 如果响应动作最终执行成功，则仅仅延迟实施所有或部分响应目标可能将不被视为违规操作。 '
            },
            {
                group_name: 'pch',
                item_index: '4',
                item_name: '“逐字合规”的政策',
                req: '遵从“一字不差”政策：电厂是否有并推动一字不差的执行EOP和其他规程的政策？'
            }
        ]
        return items;
    }
}
const service = new Service(config)
export default service;