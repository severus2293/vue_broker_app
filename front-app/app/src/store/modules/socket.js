import {io} from "socket.io-client";

export default {
    actions: {
        async CreateSocket(ctx){
            const socket = io('http://localhost:3000/usersocket')
            ctx.commit('UpdateSocket',socket)
        }
    },
    mutations: {
        UpdateSocket(state,socket){
            state.socket = socket
        }
    },
    state: {socket: io('http://localhost:3000/usersocket')},
    getters: {
        GetSocket(state){
            return state.socket
        }
    }
}
