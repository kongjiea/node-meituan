const pkg = require('./package')

module.exports = {
    mode: 'universal',

    /*
  ** Headers of the page
  */
    head: {
        title: pkg.name,
        meta: [
            { charset: 'utf-8' },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1'
            },
            {
                hid: 'description',
                name: 'description',
                content: pkg.description
            }
        ],
        link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
    },

    /*
  ** Customize the progress-bar color
  */
    loading: { color: '#fff' },

    /*
  ** Global CSS
  */
    css: [
        'element-ui/lib/theme-chalk/reset.css',
        'element-ui/lib/theme-chalk/index.css',
        '@/assets/css/main.css' // 自己的css
    ],

    /*
  ** Plugins to load before mounting the App
  */
    plugins: [
        '@/plugins/element-ui'
    ],

    /*
  ** Nuxt.js modules
  */
    modules: [
        // Doc: https://axios.nuxtjs.org/usage
        '@nuxtjs/axios'
    ],
    /*
  ** Axios module configuration
  */
    axios: {
        // See https://github.com/nuxt-community/axios-module#options
    },

    /*
  ** Build configuration
  */
    build: {
        transpile: [/^element-ui/],
        cache: false,

        // babel: {
        //     presets: ['es2015', 'stage-2']
        //
        //     // 配置按需加载
        //     // plugins: [
        //     //     "component",
        //     //     {
        //     //         "libraryName":"element-ui",
        //     //         "styleLibraryName":"theme-chalk"
        //     //     }
        //     // ]
        // },

        /*
    ** You can extend webpack config here
    */
        extend(config, ctx) {
            // Run ESLint on save
            if (ctx.isDev && ctx.isClient) {
                config.module.rules.push({
                    enforce: 'pre',
                    test: /\.(js|vue)$/,
                    loader: 'eslint-loader',
                    exclude: /(node_modules)/
                })
            }
        }
    }
}
