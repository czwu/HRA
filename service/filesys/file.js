import constants from '../../common/constants'
import BaseService from '../base'

let files = []
let config = {
    tableName: "TFile",
    columns: [
        { name: "guid", type: "VARCHAR(50)", ext: "PRIMARY KEY" },
        { name: "foreign_id", type: "VARCHAR(50)", ext: "NOT NULL" },
        { name: "type", type: "INT", ext: "DEFAULT 0" }, // 0:相关文件 1:图片 2:视频 3:音频,  9:其他
        { name: "path", type: "VARCHAR(255)", ext: "" },
        { name: "field", type: "VARCHAR(50)", ext: " DEFAULT ''" }, //如果一条记录中,多个字段需要 图片 视频 音频功能,则需要设定 field,指定字段来做区分
        { name: "name", type: "VARCHAR(50)", ext: "" },
        { name: "time", type: "INT", ext: "" },
        { name: "project_id", type: "VARCHAR(50)", ext: "" },
        { name: "delete_flag", type: "INT", ext: " DEFAULT 0 " }
    ],
    datas: [],
    guidPrefix: "file_"
}

class FileService extends BaseService {

    remove(guid) {
        let delSql, guidSqlPart = "('" + guid + "')";
        if (Array.isArray(guid)) {
            guidSqlPart = []
            guid.forEach(id => {
                guidSqlPart.push(`'${id}'`)
            })
            guidSqlPart = guidSqlPart.join(",")
            delSql = `UPDATE ${this.tableName} SET delete_flag = 1 WHERE GUID in ${guidSqlPart}`;
        } else {
            delSql = `UPDATE ${this.tableName} SET delete_flag = 1 WHERE GUID = '${guid}'`;
        }
        console.log('delete ->  Sql:', delSql, )
        return new Promise((resolve, reject) => {
            plus.sqlite.executeSql({
                name: constants.db_name,
                sql: delSql,
                success(e) {
                    resolve(e);
                },
                fail(e) {
                    console.error(e)
                    reject(e);
                }
            })
        })
    }


}
const fileService = new FileService(config)
export default fileService