import Vue from 'vue'
import Vuex from 'vuex'
import userService from '../service/user'
import groupService from '../service/person/group'
import deptService from '../service/person/dept'
import jobService from '../service/person/job'
import personService from '../service/person/person'
import catalogService from '../service/filesys/catalog'
import taskService from '../service/hra/task'
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        hasLogin: false,
        user: null,
        screenOrientation: "portrait", //屏幕方向,
        personGroups: [], //个人配置 类别信息
        personJobs: [], //岗位列表数据
        persons: [],
        crumbs: [], //面包屑数据
        catalogs: [],
        fileLevel: 0,
        catalogIndexMap: {},
        currCatalog: null,
        tasks: []
    },
    mutations: {
        login(state, user) {
            state.hasLogin = true;
            state.user = user;
        },
        logout(state) {
            state.hasLogin = false
            state.user = null
        },
        setUser(state, user) {
            state.user = user
        },
        setScreenOrientation(state, type) {
            state.screenOrientation = type
        },
        setPersonGroups(state, groups) {
            state.personGroups = groups
        },
        setPersonJobs(state, jobs) {
            state.personJobs = jobs;
        },
        setPersons(state, persons) {
            state.persons = persons;
        },
        setCrumbs(state, crumbs) {
            state.crumbs = crumbs;
        },
        setCatalogs(state, catalogs) {
            state.catalogs = catalogs;
        },
        setFileLevel(state, level) {
            state.fileLevel = level;
        },
        setCatalogIndexMap(state, catalogMap) {
            state.catalogIndexMap = catalogMap;
        },
        setCurrCatalog(state, catalog) {
            state.currCatalog = catalog
        },
        setTasks(state, tasks) {
            state.tasks = tasks
        }
    },
    getters: {
        isLogin(state) {
            return state.hasLogin
        },
        loginUser(state) {
            return state.user
        },
        screenOrientation(state) {
            return state.screenOrientation
        },
        personGroups(state) {
            return state.personGroups
        },
        personJobs(state) {
            return state.personJobs
        },
        persons(state) {
            return state.persons
        },
        crumbs(state) {
            return state.crumbs;
        },
        catalogIndexMap(state) {
            return state.catalogIndexMap
        },
        catalogs(state) {
            return state.catalogs;
        },
        currCatalog(state) {
            return state.currCatalog;
        },
        tasks(state) {
            return state.tasks;
        }

    },
    actions: {
        //登录操作
        login: function({ commit, state }, user) {
            return new Promise((resolve, reject) => {
                userService.login(user.userId, user.password).then(e => {
                    if (e.length > 0) {
                        commit("login", e[0]);
                        resolve(e)
                    } else {
                        uni.showModal({
                            title: "提示",
                            content: "登录失败,用户名或密码不正确!"
                        })
                        reject('登录失败,用户名或密码不正确')
                    }
                }, e => {
                    uni.showModal({
                        title: "异常",
                        content: e
                    })
                    reject(e)
                })
            });
        },
        //载入分组信息
        loadPersonGroups({ commit, state }) {
            return new Promise((resolve, reject) => {
                groupService.queryAll().then((groups) => {
                    deptService.queryAll().then((depts) => {
                        groups.forEach((group) => {
                            group.depts = depts.filter((dept) => dept.groupGuid == group.guid);
                        });
                        commit("setPersonGroups", groups);
                        resolve(groups)
                    }, e => reject(e));
                }, e => reject(e));
            });
        },
        loadPersonJobs({ commit, state }, deptGuid) {
            return jobService.query({ deptGuid }).then(datas => {
                commit("setPersonJobs", datas);
            })
        },
        loadPersons({ commit, state }, jobGuid) {
            return personService.query({ jobGuid }).then(datas => {
                commit("setPersons", datas);
            })
        },

        loadCatalogs({ commit, state }) {
            return catalogService.queryAll().then(datas => {
                let catalogIndexMap = {};
                datas.forEach(catalog => {
                    catalogIndexMap[catalog.guid] = catalog;
                    if (catalog.leaf == 0) {
                        catalog.children = []
                    }
                })
                datas.forEach(catalog => {
                    if (catalog.parentGuid && catalogIndexMap[catalog.parentGuid]) {
                        catalogIndexMap[catalog.parentGuid].children.push(catalog)
                    }
                })
                catalogIndexMap.roots = datas.filter(c => !c.parentGuid)
                commit("setCatalogIndexMap", catalogIndexMap);
                //返回根文件夹或文件
                commit("setCatalogs", state.currCatalog ? catalogIndexMap[state.currCatalog.guid].children : catalogIndexMap.roots);
            })
        },

        loadTasks({ commit, state }) {
            return taskService.queryAll().then(datas => {
                commit("setTasks", datas);
            })
        },

    }
})

export default store