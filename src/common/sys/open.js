/*
* @author 友人a丶
* @date 
* 
* */

import load from "@/common/util/load";

export default function (tempPath = null) {

    /* 文件是否存在 */
    if (!tempPath) {
        load.error('文件加载失败！')
        return;
    }

    /* 尝试作为文档打开 */
    uni.openDocument({
        filePath: tempPath,
        showMenu: true,
        fail: function () {
            uni.previewImage({
                urls: [tempPath],
                fail(e) {
                    load.error(e)
                }
            })
        }
    });

}
