import util from './util'
class FileManage {

    //plus是5+Runtime的内部对象。
    //就像chrome浏览器里有chrome.开头的一些对象方法，5+runtime内部内置了plus对象。
    constructor() {
        this._plus = plus;
    };
    /**
     * 导出文件到手机内存卡中
     * @param exportFilePath 导出的文件目录
     * @param fileName 文件名
     * @param fileContent 文件具体内容
     * 如完整路径：/sdcard/my-test.txt  
     * "/" 表示：exportFilePath
     * "my-test.txt" 表示：fileName
     * @return 返回true or false
     */
    saveAsPub(exportFilePath, fileName, fileContent) {
        //引入需要的类
        var File = this._plus.android.importClass("java.io.File");
        var FileOutputStream = this._plus.android.importClass("java.io.FileOutputStream");
        var String = this._plus.android.importClass("java.lang.String");
        var Exception = this._plus.android.importClass("java.lang.Exception");
        var NullPointerException = this._plus.android.importClass("java.lang.NullPointerException");

        try {
            var directory = new File(exportFilePath);
            if (!directory.exists()) {
                directory.mkdirs(); //创建目录
            }

            var file = new File("/sdcard" + exportFilePath + fileName);

            if (!file.exists()) {
                file.createNewFile(); //创建文件
            }

            var fos = new FileOutputStream(new File("/sdcard" + exportFilePath + fileName));
            fos.write(new String(fileContent).getBytes()); //写入文件流
            fos.flush();
            fos.close();

            return true;
        } catch (e) {
            console.log(e);
            return false;
            //console.log(e.getMessage());
        }
        return false;
    };

    saveMediaFile(filePath) {
        var File = plus.android.importClass("java.io.File");
        var FileInputStream = plus.android.importClass("java.io.FileInputStream");
        var FileOutputStream = plus.android.importClass("java.io.FileOutputStream");
        var DataOutputStream = plus.android.importClass("java.io.DataOutputStream");
        var DataInputStream = plus.android.importClass("java.io.DataInputStream");
        var byte = plus.android.importClass("java.io.DataInputStream");
        try {
            if (filePath.startsWith('file://')) {
                filePath = filePath.substr(7)
            } else if (filePath.startsWith('_doc')) {
                filePath = plus.io.convertLocalFileSystemURL(filePath);
            }
            var file = new File(filePath);
            if (!file.exists()) {
                console.error('文件不存在!')
                return;
            }
            let newFilePath = util.getMediaPath() + filePath.substr(filePath.lastIndexOf('/'));
            console.error('newFilePath', newFilePath);
            this.checkMediaExists()
            this.deleteFile(newFilePath);
            var outputFile = new File(newFilePath);
            if (!outputFile.exists()) {
                outputFile.createNewFile(); //创建文件 
            }
            // var size = file.length();
            uni.showLoading({ title: '正在保存...' });
            //创建输入流
            var fis = new FileInputStream(file);
            var dis = new DataInputStream(fis);

            //创建输出流
            var fos = new FileOutputStream(outputFile);
            var dos = new DataOutputStream(fos);
            //循环读取录入
            var temp = [];
            while ((temp = dis.read()) != -1) {
                dos.write(temp);
            }

            fis.close();
            fos.close();
            dis.close();
            dos.close();
            uni.hideLoading();
        } catch (e) {
            console.error(e)
            uni.hideLoading();
            return false;
        }
    };

    saveForProject(filePath, projectId) {
        //引入需要的类
        var File = this._plus.android.importClass("java.io.File");
        var FileOutputStream = this._plus.android.importClass("java.io.FileOutputStream");
        var String = this._plus.android.importClass("java.lang.String");
        var Exception = this._plus.android.importClass("java.lang.Exception");
        var NullPointerException = this._plus.android.importClass("java.lang.NullPointerException");

        try {
            var file = new File(filePath);
            if (!file.exists()) {
                console.error('文件不存在!')
                return;
            }
            if (!file.exists()) {
                file.createNewFile(); //创建文件
            }
            var fos = new FileOutputStream(new File("/sdcard" + exportFilePath + fileName));
            fos.write(new String(fileContent).getBytes()); //写入文件流
            fos.flush();
            fos.close();

            return true;
        } catch (e) {
            console.log(e);
            return false;
            //console.log(e.getMessage());
        }
        return false;
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

    /**
     * 读取文件中的数据内容
     * @param readFilePath 读取的文件所在路径
     * @param fileName 读取的文件名
     */
    readFile(readFilePath, fileName) {
        //引入需要的类
        var File = this._plus.android.importClass("java.io.File");
        var StringBuilder = this._plus.android.importClass("java.lang.StringBuilder");
        var BufferedReader = this._plus.android.importClass("java.io.BufferedReader");
        var String = this._plus.android.importClass("java.lang.String");
        var FileReader = this._plus.android.importClass("java.io.FileReader");

        var file = new File("/sdcard" + readFilePath + fileName);
        var builder = new StringBuilder();

        try {
            var reader = new BufferedReader(new FileReader(file));
            var line = new String();
            while ((line = reader.readLine()) != null) { //读取文件
                builder.append(line);
            }
            reader.close();
        } catch (e) {
            console.log(e);
            return '';
        }
        return builder.toString();
    };

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