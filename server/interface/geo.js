import Router from 'koa-router'
import axios from './utils/axios'

const router = new Router({
    prefix: '/geo'
})

const sign = 'abcd'

// 获取当前地址, 根据第三方接口获取地理位置, 因为这里的sign有问题 所以获取不到真实的位置
router.get('/getPosition', async ctx => {
    const {
        status,
        data: { province, city }
    } = await axios.get(`http://cp-tools.cn/geo/getPosition?sign=${sign}`)
    if (status === 200) {
        ctx.body = {
            province: '默认省',
            city: '默认市'
        }
    } else {
        ctx.body = {
            province: '',
            city: ''
        }
    }
})

export default router
