import projectService from '../service/project'
import util from './util'
import constants from './constants'
import regulationLoader from '../datasync/loader/regulation'

const Datasync = {
    initProject(projectGuid) {
        console.log('项目数据初始化开始:' + projectGuid);
        var File = plus.android.importClass("java.io.File");
        var String = plus.android.importClass("java.lang.String");
        var BufferedReader = plus.android.importClass("java.io.BufferedReader");
        var BufferedInputStream = plus.android.importClass("java.io.BufferedInputStream");
        var FileInputStream = plus.android.importClass("java.io.FileInputStream");
        var InputStreamReader = plus.android.importClass("java.io.InputStreamReader");
        try {
            var directory = new File(`${constants.DOC_BASE}/${projectGuid}`);
            if (!directory.exists()) {
                console.log('项目数据文件夹不存在,正在创建...:');
                directory.mkdirs(); //创建目录
            }
            var file = new File(`${constants.DOC_BASE}/${projectGuid}/proj.json`);

            if (!file.exists()) {
                console.log('未找到 proj.json 文件,数据初始化失败!');
                return;
            }
            uni.showLoading({ title: '已找到proj.json文件,准备读取...' });
            var builder = '';

            // uni.hideLoading();
            try {
                var fis = new BufferedInputStream(new FileInputStream(file));
                var reader = new BufferedReader(new InputStreamReader(fis, "utf-8"), 5 * 1024 * 1024);
                var line = new String();
                var i = 0;
                while ((line = reader.readLine()) != null) { //读取文件
                    if (i % 1000 === 0) {
                        uni.showLoading({ title: '数据文件读取中...' });
                    }
                    builder += (line);
                    i++;
                }
                uni.showLoading({ title: '数据文件加载完成' });
                fis.close();
                reader.close();
            } catch (e) {
                console.log(e);
                return '';
            }
            let proj = JSON.parse(builder);
            this.dataProcess(proj)
        } catch (e) {
            console.log(e);
            return false;
        }
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