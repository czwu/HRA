import constants from '../common/constants'
import BaseService from './base'

let config = {
    tableName: "TUser",
    columns: [
        { name: "userId", type: "INT", ext: "PRIMARY KEY" },
        { name: "userName", type: "VARCHAR(50)", ext: "NOT NULL" },
        { name: "password", type: "VARCHAR(50)", ext: "NOT NULL" },
        { name: "name", type: "VARCHAR(50)", ext: "" }
    ]
}

class UserService extends BaseService {
    login(userName, password) {
        if (userName && password) {
            return this.query({ userName, password })
        } else {
            return new Promise((resolve, reject) => {
                reject("SQL:用戶名与密码不能为空")
            })
        }
    }
}

const userService = new UserService(config)
export default userService