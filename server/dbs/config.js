export default {
    dbs: 'mongodb://127.0.0.1:27017/student',
    redis: {
        get host() {
            return '127.0.0.1'
        },
        get port() {
            return 6379
        }
    },
    smtp: {
        // 邮箱配置
        get host() {
            return 'smtp.qq.com'
        },
        get user() {
            return '378397572@qq.com'
        },
        get pass() {
            return 'wmrkqeglcnzjcahi'
        },
        // 邮箱验证码
        get code() {
            return () => {
                return Math.random()
                    .toString(16)
                    .slice(2, 6)
                    .toUpperCase()
            }
        },
        // 过期时间 1小时
        get expire() {
            return () => {
                return new Date().getTime() + 60 * 60 * 1000
            }
        }
    }
}
