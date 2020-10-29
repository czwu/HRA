import constants from '../../common/constants'
import BaseService from '../base'


let config = {
    tableName: "TFile",
    columns: [
        { name: "guid", type: "VARCHAR(50)", ext: "PRIMARY KEY" },
        { name: "foreign_id", type: "VARCHAR(50)", ext: "NOT NULL" },
        { name: "type", type: "INT", ext: "DEFAULT 0" }, // 0:相关文件 1:图片 2:视频 3:音频,  9:其他
        { name: "path", type: "VARCHAR(255)", ext: "" },
        { name: "module", type: "VARCHAR(255)", ext: "" },
        { name: "time", type: "INT", ext: "" },
        { name: "project_id", type: "INT", ext: "" },
        { name: "delete_flag", type: "INT", ext: " DEFAULT 0 " }
    ],
    datas: [],
    guidPrefix: "file_"
}

class FileService extends BaseService {

}
const fileService = new FileService(config)
export default fileService