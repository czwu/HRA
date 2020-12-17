import constants from '../../common/constants'
import util from '../../common/util'
import BaseService from '../base'
import fileService from './file'


let config = {
    tableName: "TCatalog",
    columns: [
        { name: "guid", type: "VARCHAR(50)", ext: "PRIMARY KEY" },
        { name: "parent_id", type: "VARCHAR(50)", ext: "" },
        { name: "code", type: "VARCHAR(50)", ext: "" },
        { name: "name", type: "VARCHAR(50)", ext: "NOT NULL" },
        { name: "leaf", type: "INT", ext: "DEFAULT 0" },
        { name: "type", type: "VARCHAR(100)", ext: "" }, // 
        { name: "file_path", type: "VARCHAR(500)", ext: "" },
        { name: "remark", type: "VARCHAR(255)", ext: "" },
        { name: "project_id", type: "VARCHAR(50)", ext: "" },
        { name: "created_at", type: "INT", ext: "" },
        { name: "created_by", type: "VARCHAR(50)", ext: "" },
        { name: "updated_at", type: "INT", ext: "" },
        { name: "updated_by", type: "VARCHAR(50)", ext: "" },
        { name: "delete_flag", type: "INT", ext: " DEFAULT 0 " }
    ],
    datas: [],
    feature: {
        orderby: ' order by leaf asc',
        fileSuggest: true, //文件关联设置,  设置该参数后,通过guid删除,将会同时删除File表的文件关联信息
    }
}

function copyCatalogChildren(catalog, parentCatalog, newCatalogs) {
    let time = parseInt(Date.now() / 1000),
        userName = util.getUserName();
    catalog.children.forEach((catalog) => {
        let newCatalog = {
            guid: catalogService.genGuid(),
            parent_id: parentCatalog.guid,
            code: catalog.code || '',
            name: catalog.name,
            leaf: catalog.leaf,
            type: catalog.type || '',
            remark: catalog.remark || '',
            project_id: catalog.project_id,
            created_at: time,
            created_by: userName,
            updated_at: time,
            updated_by: userName,
            delete_flag: 0,
            _old_guid: catalog.guid
        }
        newCatalogs.push(newCatalog)
        if (catalog.children && catalog.children.length) {
            copyCatalogChildren(catalog, newCatalog, newCatalogs)
        }
    })
}

class CatalogService extends BaseService {

    getFormItems() {
        return [
            { name: "文件名称", field: "name", type: 'text', },
            { name: "文件编码", field: "code", type: 'text' },
            { name: "类别", field: "type", type: 'text' },
            { name: "相关文件", field: "file_path", type: 'select-file', css: 'long-col', conf: {} },
            { name: "备注", field: "remark", type: 'text', css: 'long-col' }
        ]
    }

    autoInput(data) {
        let num = (Math.random() + '').replace('.', '').substr(0, 4);
        Object.assign(data, {
            name: 'File_' + num,
            code: 'GHLS_' + num,
            type: '维修',
            file_path: "",
            remark: '我是文件备注...'
        })
    }

    move(guid, parent_id) {
        return this.update({ guid, parent_id })
    }
    copies(catalog) {
        let time = parseInt(Date.now() / 1000),
            userName = util.getUserName();
        //第一步 拷贝数据本身
        var newCatalogs = []
        var newCatalog = {
            guid: this.genGuid(),
            parent_id: catalog.parent_id,
            code: catalog.code || '',
            name: catalog.name + '_copy',
            leaf: catalog.leaf,
            type: catalog.type || '',
            remark: catalog.remark || '',
            project_id: catalog.project_id,
            created_at: time,
            created_by: userName,
            updated_at: time,
            updated_by: userName,
            delete_flag: 0,
            _old_guid: catalog.guid
        }
        newCatalogs.push(newCatalog);
        if (catalog.children && catalog.children.length) {
            copyCatalogChildren(catalog, newCatalog, newCatalogs)
        }
        var changeMap = {}
        newCatalogs.forEach(data => {
            changeMap[data._old_guid] = data.guid
            delete data._old_guid
        })
        let newFiles = []
        fileService.queryAll().then(datas => {
            datas.forEach(file => {
                if (changeMap[file.foreign_id]) {
                    newFiles.push({
                        guid: fileService.genGuid(),
                        foreign_id: changeMap[file.foreign_id],
                        type: file.type,
                        path: file.path,
                        module: file.module,
                        time: file.time,
                        project_id: file.project_id,
                        delete_flag: 0
                    })
                }
            });
            fileService.insertList(newFiles).then(() => {

            })
        })
        return this.insertList(newCatalogs)
    }

    renderPathById(guid) {
        if (!guid) {
            return ''
        }
        if (!this.fileIndexMap) {
            return guid
        } else {
            let file = this.fileIndexMap[guid]
            let names = [];
            while (file) {
                names.push(file.name);

                file = this.fileIndexMap[file.parent_id]
            }
            names.reverse();
            return names.join(' / ')
        }
    }

    loadAll() {
        setTimeout(() => {
            var fileIndexMap = {}
            this.queryAll().then(datas => {
                this.files = datas;
                this.files.forEach(file => {
                    fileIndexMap[file.guid] = file;
                });
                this.fileIndexMap = fileIndexMap;
            })
        }, 1000)

    }
}
const catalogService = new CatalogService(config);
catalogService.loadAll();
export default catalogService