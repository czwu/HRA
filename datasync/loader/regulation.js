import regulationService from '../../service/basic/regulation'
import regulationItemService from '../../service/basic/regulationItem'

// const regulationColMap=[
//     {name:'guid',endName:'GUID'},
//     {name:'code',endName:'Code'},
//     {name:'name',endName:'Name'},
//     {name:'function_type',endName:'Name'},
//     function_type
// ]
class Loader {
    load(proj, callback) {
        let regulations = [],
            regulationItems = [];
        let regulationTypes = proj.PRegulationType;
        if (regulationTypes) {
            regulationTypes.forEach(obj => {
                let type = obj.Name;
                if (obj.PRegulation) {
                    obj.PRegulation.forEach(obj => {
                        let code = obj.Code
                        regulations.push({
                            guid: obj.GUID,
                            code: obj.Code,
                            name: obj.Name,
                            type: type, //保存父类型
                            malfunction_type: obj.PMalfunctionType
                        });
                        obj.PRegulationItem.forEach(item => {
                            item.StepName && regulationItems.push({
                                guid: item.GUID,
                                regulation_code: code, //保存父code,冗余,方便pad端UI页面显示
                                step_num: item.StepNum,
                                step_name: item.StepName,
                                action_code: item.ActionCode,
                                action_title: item.ActionTitle,
                                action_time: item.ActionTime,
                                unexpected_action_code: item.UnanticipatedActionCode,
                                unexpected_action_title: item.UnanticipatedActionTitle,
                                unexpected_action_time: item.UnanticipatedActionTime,
                                action_type: item.ActionType,
                                behavior_model_stage: item.behaviorModelStage,
                                team: item.Operator
                            })
                        })

                    })
                }

            });
            //删除原有数据
            regulationService.clearData().then(() => {
                regulationService.insertList(regulations, 'multi');
            })
            regulationItemService.clearData().then(() => {
                regulationItemService.insertList(regulationItems, 'multi ')
            })
        }
    }
}
const loader = new Loader()
export default loader