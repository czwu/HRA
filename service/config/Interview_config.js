import BaseService from '../base'

let config = {
    tableName: "intervier_config",
    columns: [
        { name: "guid", type: "VARCHAR(50)", ext: "PRIMARY KEY" },
        { name: "type", type: "VARCHAR(50)", ext: "NOT NULL" },
        { name: "value", type: "VARCHAR(50)", ext: "NOT NULL" },
        { name: "desc", type: "VARCHAR(200)", ext: "" },
        { name: "project_id", type: "VARCHAR(50)", ext: "" },
        { name: "created_at", type: "INT", ext: "" },
        { name: "created_by", type: "VARCHAR(50)", ext: "" },
        { name: "updated_at", type: "INT", ext: "" },
        { name: "updated_by", type: "VARCHAR(50)", ext: "" },
        { name: "delete_flag", type: "INT", ext: " DEFAULT 0 " }
    ],
    datas: []
}
class Service extends BaseService {
    getFormItems({ form_mode }) {
        return [
            { name: form_mode, field: 'value', datatype: 'string', type: 'text' },
            { name: '备注', field: 'desc', datatype: 'string', type: 'text' }
        ]
    }

    autoInput(data) {
        data.desc = '我是备注信息..........'
    }
}

const service = new Service(config)
export default service