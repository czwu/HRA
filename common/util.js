import constants from './constants'
let userName = 'tuwei';
let projectId = 'JIE49483KFJD223'

export default {
    /**
     * 生成指定长度的随机字符串UUID
     * @param {*} len  UUID 长度
     */
    uuid(len = 12) {
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        var uuid = [],
            i;
        var radix = chars.length;
        if (len) {
            for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
        } else {
            var r;
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }
        return uuid.join('');
    },
    //生成人员分组ID 15位  示例: "GR_UF53JD2KJG2T"
    genGroupId() {
        return ('GR_' + this.uuid(16))
    },
    //生成科室id
    genDeptId() {
        return ('DEPT_' + this.uuid(16))
    },
    //生成岗位ID
    genJobId() {
        return ('JOB_' + this.uuid(16))
    },
    //生成人员ID
    genPersonId() {
        return ('USER_' + this.uuid(16))
    },

    setUserName(name) {
        userName = name
    },

    getUserName() {
        return userName
    },
    setProjectId(id) {
        projectId = id
    },
    getProjectId() {
        return projectId
    },
    dateFormat(fmt, date) { //author: meizz 
        var o = {
            "M+": date.getMonth() + 1, //月份 
            "d+": date.getDate(), //日 
            "h+": date.getHours(), //小时 
            "m+": date.getMinutes(), //分 
            "s+": date.getSeconds(), //秒 
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
            "S": date.getMilliseconds() //毫秒 
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    },
    nodeEach(node, fn) {
        var nodes = Array.isArray(node) ? node : [node];
        nodes.forEach((node) => {
            fn(node);
            if (node.children && node.children.length) {
                this.nodeEach(node.children, fn)
            }
        })
    },

    getElSize(selector) { //得到元素的size
        return new Promise((resolve, rej) => {
            uni.createSelectorQuery().select(selector).fields({
                size: true,
                scrollOffset: true
            }, (data) => {
                resolve(data);
            }).exec();
        });
    },

    getScrollHeight(selector) {
        return new Promise((resolve, rej) => {
            uni.getSystemInfo({
                success(res) {
                    let wHeight = res.windowHeight;
                    let titleH = uni.createSelectorQuery().select(selector);
                    titleH
                        .boundingClientRect((data) => {
                            resolve(wHeight - data.top - 30)
                        })
                        .exec();
                },
            });
        });
    },

    getProjectPath() {
        return `${constants.DOC_BASE}${projectId}/`
    },

    getMediaPath() {
        return `${constants.DOC_BASE}${projectId}/media/`
    }

}