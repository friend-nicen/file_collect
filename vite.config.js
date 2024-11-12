import {defineConfig} from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import * as path from "path";
import start_______mockServer from './vite/mock';

/* 启动mock服务 */
start_______mockServer();


// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        uni(),
    ],
    resolve: {
        alias: {
            // eslint-disable-next-line no-undef
            '@': path.join(__dirname, 'src'),
            // eslint-disable-next-line no-undef
            '#': path.join(__dirname, 'src/components'),
        }
    }
})
