const state = () => ({
    position: {}
})

const actions = {
    setPosition: ({ commit }, position) => {
        commit('setPosition', position)
    }
}

const mutations = {
    setPosition(state, val) {
        state.position = val
    }
}

export default { namespaced: true, state, mutations, actions }
