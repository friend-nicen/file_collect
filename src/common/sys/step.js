/*
* @author 友人a丶
* @date 
* 全局变量
* */

/* 静态变量 */
const upload = {
    files: []
}

/* 操作静态数据 */
export default {
    setFiles(files) {
        upload.files = files;
    },
    getFiles() {
        return upload.files;
    }
}