import Koa from 'koa'

import mongoose from 'mongoose'
import bodyParser from 'koa-bodyparser'
import session from 'koa-generic-session'
import Redis from 'koa-redis'
// 对response输出进行美化
import json from 'koa-json'

import dbConfig from './dbs/config'

import passport from './interface/utils/passport'
import usersRouter from './interface/users'
import geoRouter from './interface/geo'

const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')

const app = new Koa()

// 配置和session有关的
app.keys = ['mt', 'keyskeys']
app.proxy = true
app.use(session({ key: 'mt', prefix: 'mt:uid', store: new Redis() }))

// 配置请求参数的处理
app.use(
    bodyParser({
        extendTypes: ['json', 'form', 'text']
    })
)
// 配置response美化
app.use(json())

// 连接数据库
mongoose.connect(
    dbConfig.dbs,
    {
        useNewUrlParser: true
    }
)

// 处理登录相关的 passport
app.use(passport.initialize())
app.use(passport.session())

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = !(app.env === 'production')

async function start() {
    // Instantiate nuxt.js
    const nuxt = new Nuxt(config)

    const {
        host = process.env.HOST || '127.0.0.1',
        port = process.env.PORT || 3000
    } = nuxt.options.server

    // Build in development
    if (config.dev) {
        const builder = new Builder(nuxt)
        await builder.build()
    }

    // 路由
    app.use(usersRouter.routes()).use(usersRouter.allowedMethods());
    app.use(geoRouter.routes()).use(geoRouter.allowedMethods());

    app.use(ctx => {
        ctx.status = 200
        ctx.respond = false // Bypass Koa's built-in response handling
        ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
        nuxt.render(ctx.req, ctx.res)
    })

    app.listen(port, host)
    consola.ready({
        message: `Server listening on http://${host}:${port}`,
        badge: true
    })
}

start()
