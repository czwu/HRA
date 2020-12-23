import constants from '../../common/constants'
import BaseService from '../base'
import investgationService from "../investigation/investgation";


let config = {
    tableName: "device",
    columns: [
        { name: "guid", type: "VARCHAR(50)", ext: "PRIMARY KEY" }, //唯一ID
        { name: "code", type: "VARCHAR(50)", ext: "NOT NULL" }, //设备编码
        { name: "descrip", type: "VARCHAR(50)", ext: "NOT NULL" }, //设备描述
        { name: "project_id", type: "VARCHAR(50)", ext: "" }, //所属项目ID
        { name: "created_at", type: "INT", ext: "" }, //任务创建时间
        { name: "created_by", type: "VARCHAR(50)", ext: "" }, //创建人
        { name: "updated_at", type: "INT", ext: "" }, //修改人
        { name: "updated_by", type: "VARCHAR(50)", ext: "" }, //修改时间
        { name: "delete_flag", type: "INT", ext: " DEFAULT 0 " }
    ],
    datas: [],
    guidPrefix: "",
}
class Service extends BaseService {
    getFormItems() {
        return [
            { name: '设备编码', field: 'code', datatype: 'string', type: 'text', required: true },
            { name: '设备描述', field: 'descrip', datatype: 'string', type: 'text-media', css: 'long-col ' }
        ]
    }
    autoInput(data) {
        let num = (Math.random() + '').replace('.', '').substr(0, 5);
        data.code = '设备-' + num;
        data.descrip = '我是设备功能描述'
    }

    remove(guid) {
        //调用基类方法删除数据后,再通过相关联的数据服务,删除相关数据
        return super.remove(guid).then(() => {
            investgationService.removeBy({ foreign_id: guid });
        });
    }

    copy(copydata, field, guid) {
        //拷贝子数据
        investgationService.query({ foreign_id: copydata.guid }).then(datas => {
            if (datas.length) {
                var copylist = []
                datas.forEach(data => {
                    data.guid = investgationService.genGuid();
                    data.foreign_id = guid;
                    copylist.push(data)
                });
                investgationService.insertList(copylist, 'multi')
            }
        })
        return super.copy(copydata, field, guid)
    }
}
const service = new Service(config)
export default service