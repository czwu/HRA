import constants from '../common/constants'
import userService from '../service/user'
import projectService from '../service/project'
import groupService from '../service/person/group'
import deptService from '../service/person/dept'
import jobService from '../service/person/job'
import personService from '../service/person/person'
import catalogService from '../service/filesys/catalog'
import fileService from '../service/filesys/file'

const SQLite = {

    //判断数据库是否开启
    isOpen() {
        var ss = constants.db_name;
        var qq = constants.db_path;
        //数据库打开了就返回true,否则返回false
        var open = plus.sqlite.isOpenDatabase({
            name: ss,
            path: qq
        })
        return open;
    },

    //开启数据库连接
    open() {
        //这plus.sqlite只在手机上运行
        return new Promise((resolve, reject) => {
            plus.sqlite.openDatabase({
                name: constants.db_name, //数据库名称
                path: constants.db_path,
                success(e) {
                    resolve(e); //成功回调
                },
                fail(e) {
                    reject(e); //失败回调
                }
            })
        })
    },
    //关闭数据库连接
    close() {
        return new Promise((resolve, reject) => {
            plus.sqlite.closeDatabase({
                name: 'hra',
                success(e) {
                    resolve(e);
                },
                fail(e) {
                    reject(e);
                }
            })
        })
    },

    initDataBase() {
        let initServices = [userService, groupService, deptService, jobService, personService, projectService, catalogService, fileService];
        //初始化 用户表, 检查是否存在,不存在则创建表并初始化数据
        initServices.forEach(service => {
            this.isTableExists(service.tableName, bool => {
                if (!bool) {
                    service.createTable().then(e => {
                        try {
                            service.initTable()
                        } catch (e) {
                            console.error("initTable ERROR:", e)
                        }
                    })
                }
            })
        })

    },

    isTableExists(tableName, callback) {
        console.log(`检查表->  ${tableName} 是否已存在 `)
        plus.sqlite.selectSql({
            name: constants.db_name,
            sql: `select * from sqlite_master where type = 'table' and name = '${tableName}'`,
            success(e) {
                console.log(`检查结果-> ${tableName} ${e.length ? '已存在' : '不存在'} `)
                callback(!!e.length)
            },
            fail(e) {
                console.error('执行isTableExists失败:', tableName)
            }
        })


    }

}

export default SQLite