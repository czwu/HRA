import constants from './constants';
import util from './util'
class FileManage {

    //plus是5+Runtime的内部对象。
    //就像chrome浏览器里有chrome.开头的一些对象方法，5+runtime内部内置了plus对象。
    constructor() {
        this._plus = plus;
    };

    saveMediaFile(tempPath, callback) {
        var File = plus.android.importClass("java.io.File");
        let folderPath = util.getMediaPath();
        this.checkMediaExists(folderPath);
        let extName = this.getFileExt(tempPath);
        let newName = Date.now() + extName;
        this._plus.io.resolveLocalFileSystemURL(folderPath, (folderEntry) => {
            this._plus.io.resolveLocalFileSystemURL(tempPath, (entry) => {
                entry.moveTo(folderEntry, newName, (entry1) => {
                    callback && callback(entry1.fullPath.split(constants.DOC_BASE)[1])
                });
            });
        });
    };

    backupDB() {
        var File = plus.android.importClass("java.io.File");
        let folderPath = util.getProjectPath();
        this.deleteFile(folderPath + 'hra.db');
        this._plus.io.resolveLocalFileSystemURL('_doc/hra.db', (dbEntry) => {
            this._plus.io.resolveLocalFileSystemURL(folderPath, (folderEntry) => {
                dbEntry.copyTo(folderEntry, '', () => {
                    this.zip()
                        // uni.showToast({
                        //     title: "数据打包成功",
                        //     duration: 3000,
                        //     icon: "none",
                        // });
                });
            });
        });
    }

    zip() {
        let targetPath = util.getProjectPath();
        var zipfile = constants.DOC_BASE + util.getProjectCode() + '.zip';
        this.deleteFile(zipfile);
        uni.showLoading({ title: '正在打包...' });
        plus.zip.compress(targetPath, zipfile,
            function() {
                uni.showToast({
                    title: "数据打包成功",
                    duration: 3000,
                    icon: "none",
                });
            },
            function(error) {
                uni.showToast({
                    title: "数据打失败",
                    duration: 3000,
                    icon: "none",
                });
            });
    }

    getFileExt(filename) {
        var index = filename.lastIndexOf(".");
        return filename.substr(index);
    };


    deleteFile(deleteFilePath) {
        var File = this._plus.android.importClass("java.io.File");
        var file = new File(deleteFilePath);
        if (file.exists() && file.isFile()) {
            return file.delete();
        } else {
            console.error('未找到文件,文件删除失败!', deleteFilePath)
            return false;
        }
    }

    deleteMediaFile(path) {
        var File = plus.android.importClass("java.io.File");
        var file = new File(constants.DOC_BASE + path);
        if (file.exists() && file.isFile()) {
            return file.delete();
        } else {
            console.error('未找到文件,文件删除失败!', path)
            return false;
        }
    }

    checkMediaExists() {
        var File = this._plus.android.importClass("java.io.File");
        var directory = new File(util.getMediaPath());
        var exists = directory.exists()
        if (!exists) {
            directory.mkdirs();
        }
        return exists
    };


    /**
     * 遍历目录下面的所有文件，返回所有文件名
     * @param 需要遍历的目录
     */
    listFiles(directoryPath) {
        //引入需要的类
        var File = this._plus.android.importClass("java.io.File");

        var directory = new File("/sdcard" + directoryPath);

        if (!directory.exists()) {
            directory.mkdirs();
        }

        var files = directory.listFiles();
        //对文件进行排序
        for (var i = 0; i < files.length; i++) {
            for (var j = 0; j < files.length; j++) {
                if (files[i].lastModified() > files[j].lastModified()) {
                    var temp = files[j];
                    files[j] = files[i];
                    files[i] = temp;
                }
            }
        }

        var resultArr = [];

        for (var i in files) {
            resultArr.push({
                'fileName': files[i].getName().split('.')[0],
                'lastModified': DateFormatUtil.format(new Date(files[i].lastModified()), 'yyyy-MM-dd hh:mm:ss')
            });
        }
        return resultArr;
    };
}

export default new FileManage();