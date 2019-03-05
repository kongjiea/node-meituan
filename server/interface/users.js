import Router from 'koa-router'
import Reids from 'koa-redis'
import NodeMailer from 'nodemailer'
// 模型
import User from '../dbs/models/users'
// 权限
import Email from '../dbs/config'
import Passport from './utils/passport'
// 邮箱配置
import axios from './utils/axios'

const router = new Router({
    prefix: '/users'
})

const Store = new Reids().client

// 注册接口
router.post('/signup', async ctx => {
    const { username, password, email, code } = ctx.request.body

    // 验证验证码   //  这里获取的code 和 expire是在 发送邮件的时候存储了 redis
    if (code) {
        const saveCode = await Store.hget(`nodemail:${username}`, 'code')
        console.log('saveCode', saveCode)
        const saveExpire = await Store.hget(`nodemail:${username}`, 'expire')

        // eslint-disable-next-line
        if (code === saveCode) {
            if (new Date().getTime() - saveExpire > 0) {
                console.log(111)
                ctx.body = {
                    code: -1,
                    msg: '验证码已过期，请重新尝试'
                }
                return false
            }
        } else {
            console.log(222)
            ctx.body = {
                code: -1,
                msg: '请填写正确的验证码'
            }
            return false
        }
    } else {
        console.log(333)
        ctx.body = {
            code: -1,
            msg: '请填写验证码'
        }
    }

    // 验证用户名
    const user = await User.find({ username })
    if (user.length) {
        ctx.body = {
            code: -1,
            msg: '已被注册'
        }
        return
    }

    const nuser = await User.create({ username, password, email })
    // 如果注册成功，自动登录
    if (nuser) {
        const res = await axios.post('/users/signin', { username, password })
        if (res.data && res.data.code === 0) {
            ctx.body = {
                code: 0,
                msg: '注册成功',
                user: res.data.user
            }
        } else {
            ctx.body = {
                code: -1,
                msg: 'error'
            }
        }
    } else {
        ctx.body = {
            code: -1,
            msg: '注册失败'
        }
    }
})

// 登录接口
router.post('/signin', (ctx, next) => {
    // 这里的local 对应 passport 里面的passport-local 的local
    return Passport.authenticate('local', function(err, user, info, status) {
        if (err) {
            ctx.body = {
                code: -1,
                msg: err
            }
        } else if (user) {
            ctx.body = {
                code: 0,
                msg: '登录成功',
                user
            }
            return ctx.login(user)
        } else {
            ctx.body = {
                code: 1,
                msg: info
            }
        }
    })(ctx, next)
})

// 验证邮箱验证码
router.post('/verify', async (ctx, next) => {
    const username = ctx.request.body.username
    const saveExpire = await Store.hget(`nodemail:${username}`, 'expire')
    if (saveExpire && new Date().getTime() - saveExpire < 0) {
        ctx.body = {
            code: -1,
            msg: '验证请求过于频繁，1分钟内1次'
        }
        return false
    }

    // smtp 服务
    const transporter = NodeMailer.createTransport({
        service: 'qq',
        auth: {
            user: Email.smtp.user,
            pass: Email.smtp.pass
        }
    })

    // 定义邮箱需要发送的内容
    const ko = {
        code: Email.smtp.code(),
        expire: Email.smtp.expire(),
        email: ctx.request.body.email,
        user: ctx.request.body.username
    }
    const mailOptions = {
        from: `"认证邮件" <${Email.smtp.user}>`,
        to: ko.email,
        subject: '《慕课网高仿美团网全栈实战》注册码',
        html: `您在《慕课网高仿美团网全栈实战》课程中注册，您的邀请码是${
            ko.code
        }`
    }

    // 发送邮件
    await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error)
        } else {
            Store.hmset(
                `nodemail:${ko.user}`,
                'code',
                ko.code,
                'expire',
                ko.expire,
                'email',
                ko.email
            )
        }
    })
    ctx.body = {
        code: 0,
        msg: '验证码已发送，可能会有延时，有效期1分钟'
    }
})

// 退出登录
router.get('/exit', async (ctx, next) => {
    // logout 和 isAuthenticated 这2个是koa-passport的方法
    await ctx.logout()
    if (!ctx.isAuthenticated()) {
        ctx.body = {
            code: 0
        }
    } else {
        ctx.body = {
            code: -1
        }
    }
})

// 获取用户信息
router.get('/getUser', ctx => {
    // isAuthenticated 这个是passport的方法
    if (ctx.isAuthenticated()) {
        // console.log('ctx.session', ctx.session)
        // console.log('ctx.session.passport', ctx.session.passport)
        const { username, email } = ctx.session.passport.user
        ctx.body = {
            user: username,
            email
        }
    } else {
        ctx.body = {
            user: '',
            email: ''
        }
    }
})

export default router
