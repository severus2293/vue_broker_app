import Vuex from 'vuex'
import socket from "@/store/modules/socket";
import user from "@/store/modules/user"
export default new Vuex.Store({

    modules: {
        socket,user
    }
})
