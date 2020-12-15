const constants = {
    db_name: 'hra' //sql数据库名称
        ,
    db_path: '_doc/hra.db' //sql数据库路径
        ,
    DICT_TYPE: { // 数据字典类型常量配置
        FOLDER_TYPE: "文件类别",

        TASK_STAGE: '任务阶段',

        TASK_LEVEL: '任务级别',

        TASK_HTYPE: "人因类别",

        WORKING_CONDITION_TYPE: "工况类别",

        TASK_ANALYSIS_SCOPE: "任务分析范围",

        USER_SELECT: '人员',

    },

    MSG: {
        FORM_REQUIRED: '请将表单录入完整,再提交!'
    },
    //区分信息类型 
    INFO_TYPE: {
        DEVICE: 'device', //设备信息
        OBJECT: "object", //操作对象
        WARNING: 'warning', //报警信息
        DIRECTIVE: 'directive', //指示
        PLAIN: 'plain', //工作计划
        VERIFY: 'verify', //验证
        INSPECTION: 'inspection', //巡检
        TRAINING: 'training', //培训
        ACCESSIBILITY: 'accessibility' //可达性
    },

    TAST_TYPE: {
        A: 'A类',
        AC: 'A类相关性',
        C: 'C类',
        CC: 'C类相关性'
    },

    HEIGHT_TOOLS: ['钢平台', '梯子', '脚手架'],
    HANDLE_SPACE: ['够', '不够', '较危险'],

    DOC_BASE: '/storage/emulated/0/HRA_DOC'


}
export default constants