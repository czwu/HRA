import projectService from '../service/project'
import userService from '../service/user'
import util from './util'
import constants from './constants'
import regulationLoader from '../datasync/loader/regulation'
const Datasync = {
    initProject(projectGuid) {
        return new Promise((resolve, reject) => {
            uni.showLoading({ title: '正在初始化...' });
            this.readProj((jsontext) => {
                let proj = JSON.parse(jsontext);
                this.dataProcess(proj);
                setTimeout(() => {
                    uni.hideLoading();
                    resolve();
                }, 3000)

            })
        });
    },

    initApp() {
        //获取到global.json中的数据,
        this.readGlobalJson((jsontext) => {
            let appData = JSON.parse(jsontext);
            let projects = appData.projects;
            let users = appData.users;
            // 该处需要跟PC端对接, 从appData中获取数据,并插入到相关表中
            projectService.insertList(projects, 'multi');
            userService.insertList(users, 'multi');
            // 还需要将其他基础数据插入到数据字典表 tdict中, 需要调用dict.js去实现
        })
    },

    readProj(callback) {
        var path = util.getProjectPath() + 'proj.json';
        var File = plus.android.importClass("java.io.File");
        var projFile = new File(path);
        var exists = projFile.exists()
        if (!exists) {
            uni.showToast({
                title: "未找到该项目的初始化文件(" + path + "),初始化失败",
                duration: 4000,
                icon: "none",
            });
            uni.hideLoading();
            return
        }
        var reader = null;
        plus.io.resolveLocalFileSystemURL(path, (entry) => {
            entry.file(function(file) {
                reader = new plus.io.FileReader();
                reader.onloadend = function(e) {
                    callback && callback(e.target.result)
                };
                reader.readAsText(file);
            }, function(e) {
                console.log("Read faild");
            });
        });
    },

    readGlobalJson(callback) {
        var path = constants.DOC_BASE + 'global.json'
        var File = plus.android.importClass("java.io.File");
        var projFile = new File(path);
        var exists = projFile.exists()
        if (!exists) {
            uni.showToast({
                title: "获取项目列表失败,未找到初始化文件(" + path + ")!",
                duration: 4000,
                icon: "none",
            });
            return
        }
        var reader = null;
        plus.io.resolveLocalFileSystemURL(path, (entry) => {
            entry.file(function(file) {
                reader = new plus.io.FileReader();
                reader.onloadend = function(e) {
                    callback && callback(e.target.result)
                };
                reader.readAsText(file);
            }, function(e) {});
        });
    },

    getProjects() {
        return projectService.queryAll()
    },

    dataProcess(data) {
        //规程数据
        regulationLoader.load(data);
        uni.hideLoading();
    },


}

export default Datasync;