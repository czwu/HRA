import util from '../common/util.js'
import constants from '../common/constants.js'
export default class BaseService {
    constructor({ tableName, columns, datas, guidPrefix, feature = {}, form = {} } = {}) {
        if (!tableName) {
            console.error('表名称不能为空!')
        }
        if (!columns || columns.length < 1) {
            console.error('列配置不能为空!')
        }

        this.tableName = tableName;
        this.columns = columns;
        this.datas = datas;
        this.guidPrefix = guidPrefix || 'ID_'
        this.feature = feature;
        this.form = form;
        this.isTableExists(tableName, bool => {
            if (!bool) {
                this.createTable().then(e => {
                    try {
                        this.initTable()
                    } catch (e) {
                        console.error("initTable ERROR:", e)
                    }
                })
            }
        })
    }

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
    }

    openDataBase(fn = function() {}) {
        if (!this.isOpen()) {
            plus.sqlite.openDatabase({
                name: constants.db_name, //数据库名称
                path: constants.db_path,
                success(e) {
                    console.info('openDatabase success!')
                    fn()
                },
                fail(e) {
                    console.error('openDatabase failed!')
                }
            })
        } else {
            fn()
        }
    }


    isTableExists(tableName, callback) {
        if (this.isOpen()) {
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
        } else {
            setTimeout(() => {
                this.isTableExists(tableName, callback)
            }, 500)
        }

    }

    //如表不存在,则建表
    createTable() {
        let tempSql = [];
        this.columns.forEach(col => {
            tempSql.push(`${col.name} ${col.type} ${col.ext}`)
        })
        let sql = `
        create table if not exists ${this.tableName}(
            ${tempSql.join(',')}
         ); 
        `
        console.log(`createTable -> `, sql)
        let tableName = this.tableName
        return new Promise((resolve, reject) => {
            plus.sqlite.executeSql({
                name: constants.db_name,
                sql: sql,
                success(e) {
                    console.info("Create table Successful!", tableName, e)
                    resolve(e);
                },
                fail(e) {
                    console.error("Create table Failed!", tableName, e)
                    reject(e);
                }
            })
        })
    }

    /**
     * 初始化表数据, 通过列配置与 初始化静态数据生成 如下方的sql插入语句
     * NSERT INTO 'tableName'
        SELECT 'data1' AS 'column1', 'data2' AS 'column2'
        UNION SELECT 'data3', 'data4'
        UNION SELECT 'data5', 'data6'
        UNION SELECT 'data7', 'data8'
     */

    initTable() {
        //根据初始化数据格式 与 列配置 初始化生成插入SQL
        let columns = this.columns;
        let initData = this.datas;
        let tableName = this.tableName;
        let sqlPartNames = [];

        let insertSql = `INSERT INTO ${this.tableName}  `

        if (initData && initData.length) {
            for (let i = 0; i < initData[0].length; i++) {
                console.log(columns[i].name)
                sqlPartNames.push(columns[i].name)
            }
            insertSql += ` (${sqlPartNames.join(",")}) `
            initData.forEach((data, i) => {
                //解析待插入的数据 如果是数组格式 比如 [值1,值2,值3,值4], 这种格式的数据,必须与列明配置顺序一致
                if (Array.isArray(data)) {
                    if (i == 0) {
                        insertSql += " SELECT "
                        let valSql = []
                        data.forEach((val, j) => {
                            valSql.push(` '${val}' as '${columns[j].name}' `)
                        })
                        insertSql += valSql.join(",")
                    } else {
                        let valSql = []
                        data.forEach((val, j) => {
                            valSql.push(` '${val}' `)
                        })
                        insertSql += ' UNION SELECT ' + valSql.join(",")
                    }
                }
            })
        } else {
            return;
        }
        console.log('initTable ->', insertSql)
        return new Promise((resolve, reject) => {
            plus.sqlite.executeSql({
                name: constants.db_name,
                sql: insertSql,
                success(e) {
                    console.info("initTable Successful!", tableName, e)
                    resolve(e);
                },
                fail(e) {
                    console.error("initTable Failed!", tableName, e)
                    reject(e);
                }
            })
        })
    }

    /**
     * 查询所有数据
     */
    queryAll() {
        try {
            var sql = `SELECT * FROM ${ this.tableName } WHERE 1=1`;
            //如果数据表有删除标记列,则需要过滤掉已删除(软删除)的数据
            if (this.columns.filter(col => col.name == 'delete_flag').length > 0) {
                sql += ' and delete_flag = 0'
            }
            //如果数据表区分项目,则需要添加项目id条件
            if (this.columns.filter(col => col.name == 'project_id').length > 0) {
                sql += ` and  project_id = '${util.getProjectId()}'  `
            }
            //如果有设置排序方式,则按设定拼写sql,否则默认按照created_at升序排列
            if (this.feature.orderby) {
                sql += this.feature.orderby;
            } else if (this.columns.filter(col => col.name == 'created_at').length > 0) {
                //默认按照created_at升序排列
                sql += ' order by created_at asc'
            }
            console.log('queryAll ->  Sql:', sql)
            return new Promise((resolve, reject) => {
                plus.sqlite.selectSql({
                    name: constants.db_name,
                    sql: sql,
                    success(e) {
                        resolve(e);
                    },
                    fail(e) {
                        console.error("queryAll Failed!", e)
                        reject(e);
                    }
                })
            })
        } catch (e) {
            console.log(e)
        }

    }


    /**
     * 带有绝对值的条件查询 
     * @param {} conditions  具体查询条件 {name:"zhangan", dept:"dept1"}
     */
    query(conditions) {
        try {
            var projectId = util.getProjectId()
            var sql = `SELECT * FROM ${ this.tableName } WHERE `;
            var condSql = []
            for (let cond in conditions) {
                condSql.push(` ${cond} = '${conditions[cond]}'`)
            }
            //如果数据表有删除标记列,则需要过滤掉已删除(软删除)的数据
            if (this.columns.filter(col => col.name == 'delete_flag').length > 0) {
                condSql.push(' delete_flag = 0 ')
            }
            //如果数据表区分项目,则需要添加项目id条件
            if (this.columns.filter(col => col.name == 'project_id').length > 0) {
                condSql.push(` project_id = '${projectId}'  `)
            }
            sql += condSql.join(' AND ')
            console.log('query ->  Sql:', sql)
            return new Promise((resolve, reject) => {
                plus.sqlite.selectSql({
                    name: constants.db_name,
                    sql: sql,
                    success(e) {
                        resolve(e);
                    },
                    fail(e) {
                        console.error("query Failed!", e)
                        reject(e);
                    }
                })
            })
        } catch (e) {
            console.error(e)
        }

    }

    /**
     * 带有绝对值的条件查询 
     * @param {} conditions  具体查询条件 {name:"zhangan", dept:"dept1"}
     */
    queryOne(guid) {
        var sql = `SELECT * FROM ${ this.tableName } WHERE guid = '${guid}'`;
        console.log('queryOne ->  Sql:', sql)
        return new Promise((resolve, reject) => {
            plus.sqlite.selectSql({
                name: constants.db_name,
                sql: sql,
                success(e) {
                    resolve(e);
                },
                fail(e) {
                    console.error("queryOne Failed!", e)
                    reject(e);
                }
            })
        })
    }

    genInsertSql(data) {
        let time = parseInt(Date.now() / 1000),
            userName = util.getUserName();
        let sqlPartNames = [],
            sqlPartValues = [];
        for (let name in data) {
            sqlPartNames.push(name)
            sqlPartValues.push(`'${data[name]}'`)
        }
        if (this.columns.filter(col => col.name == 'created_at').length > 0) {
            sqlPartNames.push('created_at', 'created_by', 'updated_at', 'updated_by')
            sqlPartValues.push(time, `'${userName}'`, time, `'${userName}'`)
        }
        //如果数据表区分项目,则需要插入项目id
        if (this.columns.filter(col => col.name == 'project_id').length > 0) {
            sqlPartNames.push('project_id')
            sqlPartValues.push(`'${util.getProjectId()}'`)
        }
        sqlPartNames = sqlPartNames.join(",")
        sqlPartValues = sqlPartValues.join(",")

        let sql = `INSERT INTO  ${this.tableName} (${sqlPartNames}) VALUES(${sqlPartValues})`;
        console.log(sql)
        return sql
    }

    insert(data) {
        let sql = this.genInsertSql(data)
        console.log('insertsql:', sql)
        return new Promise((resolve, reject) => {
            plus.sqlite.executeSql({
                name: constants.db_name,
                sql: sql,
                success(e) {
                    resolve(e);
                },
                fail(e) {
                    console.error("Insert Failed!", e)
                    reject(e);
                }
            })
        })
    }

    /**
     * 一次型插入多条数据
     * NSERT INTO 'tableName'
        SELECT 'data1' AS 'column1', 'data2' AS 'column2'
        UNION SELECT 'data3', 'data4'
        UNION SELECT 'data5', 'data6'
        UNION SELECT 'data7', 'data8'
     */
    insertList(datas) {
        //根据初始化数据格式 与 列配置 初始化生成插入SQL
        let colNames = [];
        let insertSql = `INSERT INTO ${this.tableName}  `

        for (let colName in datas[0]) {
            colNames.push(colName)
        }
        datas.forEach((data, i) => {
            if (i == 0) {
                insertSql += " SELECT "
                let valSql = [];
                colNames.forEach(colName => {
                    valSql.push(` '${data[colName]}' as '${colName}' `)
                })
                insertSql += valSql.join(",")
            } else {
                let valSql = []
                colNames.forEach(colName => {
                    valSql.push(` '${data[colName]}' `)
                })
                insertSql += ' UNION SELECT ' + valSql.join(",")
            }
        })
        console.log('insertList ->', insertSql)
        return new Promise((resolve, reject) => {
            plus.sqlite.executeSql({
                name: constants.db_name,
                sql: insertSql,
                success(e) {
                    resolve(e);
                },
                fail(e) {
                    console.error("insertList Failed!", e)
                    reject(e);
                }
            })
        })
    }
    update(data) {
        let time = parseInt(Date.now() / 1000),
            userName = util.getUserName();
        let sqlPart = [];
        for (let name in data) {
            if (name != 'guid') {
                sqlPart.push(` ${name} = '${data[name]}'`)
            }
        }
        sqlPart = sqlPart.join(",")
        let sql = `UPDATE ${this.tableName} SET ${sqlPart}, updated_at = ${time}, updated_by = '${userName}' WHERE GUID = '${data.guid}'`;
        console.log('update ->  Sql:', sql)
        return new Promise((resolve, reject) => {
            plus.sqlite.executeSql({
                name: constants.db_name,
                sql: sql,
                success(e) {
                    resolve(e);
                },
                fail(e) {
                    console.error("update Failed!", e)
                    reject(e);
                }
            })
        })

    }

    remove(guid) {
        let time = Date.now(),
            delFileSql,
            delSql, guidSqlPart = "('" + guid + "')",
            userName = util.getUserName();
        if (Array.isArray(guid)) {
            guidSqlPart = []
            guid.forEach(id => {
                guidSqlPart.push(`'${id}'`)
            })
            guidSqlPart = guidSqlPart.join(",")
            delSql = `UPDATE ${this.tableName} SET delete_flag = 1, updated_at = ${time}, updated_by = '${userName}' WHERE GUID in (${guidSqlPart})`;
        } else {
            delSql = `UPDATE ${this.tableName} SET delete_flag = 1, updated_at = ${time}, updated_by = '${userName}' WHERE GUID = '${guid}'`;
        }
        //如果该表关联了文件信息,则删除数据的同时需要删除文件
        if (this.feature.fileSuggest) {
            delFileSql = `UPDATE TFile SET delete_flag = 1  where foreign_id in (${guidSqlPart})`
        }
        console.log('delete ->  Sql:', delSql, delFileSql)
        return new Promise((resolve, reject) => {
            plus.sqlite.executeSql({
                name: constants.db_name,
                sql: delFileSql ? [delSql, delFileSql] : delSql,
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


    genGuid() {
        return this.guidPrefix + util.uuid(16);
    }

    copy(copydata, field = 'name', guid) {
        let data = this.cloneDataProcess4Copy(copydata)
        data.guid = guid || this.genGuid();
        data[field] = data[field].split('_copy_')[0] + '_copy_' + util.uuid(4)
        return this.insert(data)
    }

    //通过传入查询条件,拷贝数据集合
    copyByQuery(cond, dataHandler) {
        return new Promise((resolve, reject) => {
            this.query(cond).then(datas => {
                console.log("copyByQuery", datas)
                let insertSqls = []
                datas.forEach(data => {
                    let item = this.cloneDataProcess4Copy(data)
                    item.guid = this.genGuid()
                    dataHandler && dataHandler(item)
                    insertSqls.push(this.genInsertSql(item))
                })
                this.executeSql(insertSqls, resolve, reject)
            })
        })

    }

    cloneDataProcess4Copy(data) {
        let commonAttrs = ["created_at", "created_by", "updated_at", "updated_by", "delete_flag", 'project_id'];
        let newData = {};
        for (let name in data) {
            if (commonAttrs.indexOf(name) == -1) {
                newData[name] = data[name]
            }
        }
        return newData
    }

    executeSql(sql, resolve, reject) {
        console.log('executeSql:', sql)
        plus.sqlite.executeSql({
            name: constants.db_name,
            sql: sql,
            success(e) {
                resolve(e);
            },
            fail(e) {
                reject(e);
            }
        })
    }



    /**
     * 同步远端数据
     */
    SyncRemoteData() {
        //TODO
    }
}