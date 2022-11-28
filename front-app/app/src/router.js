import { createRouter, createWebHistory } from "vue-router"
import Authorization from "@/views/Authorization";
import User from "@/views/User";
import Bargaing from "@/views/Bargaing";
import Admin from "@/views/Admin";
import Brokers from "@/views/Brokers";
import Settings from "@/views/Settings";
import Stocks from "@/views/Stocks";
const routeInfos = [
    {
        path : "/",
        component : Authorization
    },
    {
        path : "/user/:num",
        name: 'user',
        params: true,
        component : User
    },
    {   path : "/user/:num/bargaing",
        component : Bargaing
    },
    {   path : "/user/:num/admin",
        component : Admin
    },
    {   path : "/user/:num/admin/brokers",
        component : Brokers
    },
    {   path : "/user/:num/admin/settings",
        component : Settings
    },
    {   path : "/user/:num/admin/stocks",
        component : Stocks
    }
]

const router = createRouter({
    history : createWebHistory(),
    routes : routeInfos
})

export default router;
