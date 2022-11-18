export default {
    actions: {
        async CreateUser(ctx,user){
            ctx.commit('UpdateUser',user)
        }
    },
    mutations: {
        UpdateUser(state,user){
            state.user = user
        }
    },
    state: {user: {}},
    getters: {
        GetUser(state){
            return state.user
        }
    }
}
