import Vue from 'vue'
import Vuex from 'vuex'
import geo from './modules/geo'

Vue.use(Vuex)

const store = () =>
    new Vuex.Store({
        modules: {
            geo
        },
        actions: {
            // nuxtServerInit nuxt的生命周期
            async nuxtServerInit({ commit }, { req, app }) {
                console.log('app', app)
                const {
                    status,
                    data: { province, city }
                } = await app.$axios.get('/geo/getPosition')
                const position =
                    status === 200
                        ? { province, city }
                        : { province: '', city: '' }
                commit('geo/setPosition', position)
            }
        }
    })

export default store
