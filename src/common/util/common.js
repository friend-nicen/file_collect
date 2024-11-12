import {inject, provide, reactive} from "vue";

/**
 * 节流函数
 * @param cb
 * @param wait
 * @returns {(function(...[*]): void)|*}
 */
export function throttle(cb, wait = 3000) {
    let previous = 0;
    return (...args) => {
        const now = +new Date();
        if (now - previous > wait) {
            previous = now;
            cb.apply(this, args);
        }
    }
}


/**
 * 获取时间戳
 * @returns {string}
 */
export function getTime() {
    return String((new Date()).getTime())
}


/**
 * 输出欢迎语
 * @returns {string}
 */
export function welcome() {

    let hour = (new Date).getHours();

    let wel = "";

    switch (true) {
        case hour === 1:
            wel = "凌晨1点了！该休息了！";
            break;
        case hour === 2:
            wel = "工作狂，还在忙嘛？";
            break;
        case hour === 3:
            wel = "午夜3点！你决定不睡觉了嘛？？";
            break;
        case hour === 4:
            wel = "凌晨4点了，您的工作精神一定要上报党中央！";
            break;
        case hour === 5:
            wel = "5点多了，您是刚起床还是还没睡啊？";
            break;
        case hour === 6:
            wel = "早上好！新一天又开始啦！有什么打算呢？";
            break;
        case hour === 7:
            wel = "吃早饭了嘛？";
            break;
        case(hour === 8) || (hour === 9) || (hour === 10):
            wel = "祝您工作愉快！";
            break;
        case hour === 11:
            wel = "快中午啦，准备下班了嘛？";
            break;
        case hour === 12:
            wel = "中午好！你吃饭了嘛？";
            break;
        case(hour === 13) || (hour === 14):
            wel = "准备准备要上班了！";
            break;
        case(hour === 15) || (hour === 16) || (hour === 17):
            wel = "下午好！";
            break;
        case(hour === 18) || (hour === 19):
            wel = "该看新闻联播了！";
            break;
        case(hour === 20) || (hour === 21) || (hour === 22):
            wel = "休息下，找个电影看看睡觉吧？";
            break;
        case(hour === 23):
            wel = "不早了，快休息吧？";
            break;
        case(hour === 0):
            wel = "午夜时分，你可要注意身体呢！";
            break;
        default:
            wel = "生活还得继续，加油！";
            break;
    }

    return hour + '点了，' + wel;

}


/**
 * 延迟执行
 * @param callback
 * @param time
 */
export function delay(callback, time) {
    let timer = setTimeout(() => {
        clearTimeout(timer);
        callback();
    }, time);
}

/**
 * 深拷贝
 */
export function cloneDeep(obj) {
    return JSON.parse(JSON.stringify(obj));
}


/**
 * 批量inject
 */
export function injects(keys) {
    const obj = Object.create(null);
    for (let i of keys) {
        obj[i] = inject(i, null);
    }
    return obj;
}

/**
 * 批量provide
 */
export function provides(obj) {
    for (let i in obj) {
        provide(i, obj[i])
    }
}


/**
 * 字节转M
 */
export function byteToM(byte) {
    return (byte / 1024 / 1024).toFixed(2) + 'm';
}

/**
 * M转字节
 */
export function MToByte(M) {
    return (M * 1024 * 1024).toFixed(2);
}


/**
 * 数据容器，并提供重置的方法
 * @param  res
 * @returns {{data: *, reset: reset}}
 */
export function store(res) {

    const init = reactive({
        primary: cloneDeep(res),
        data: cloneDeep(res),
        /**
         * 重置回上一个快照
         * */
        reset: () => {
            init.data = Object.assign(init.data, init.primary);
            return true;
        },
        /**
         * 替换
         * */
        $set(set) {
            init.data = Object.assign(init.data, set);
            return true;
        },
        /**
         * 保存快照
         * */
        save: (snap) => {
            init.primary = cloneDeep(snap);
            return true;
        }
    })

    return init;
}
