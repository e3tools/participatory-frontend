import { 
    set_value, 
    get_value, 
    delete_value 
} from "@/app/utils/storage"; 

const KEY = 'frappeUser';

const UserStore = class UserStore {
    static set_user = async (user: object) => {
        let obj = {'name': user.name, 'username': user.username, 'email': user.email, 'full_name': user.full_name, 'token': user.token }; 
        return await set_value(KEY, obj);
    }

    static get_user = async () => { 
        return await get_value(KEY);
    }

    static remove_user = async () => {
        const res = await delete_value(KEY);
        const usr = await this.get_user();
        console.log("Removing user: ", res, usr)
        return res;
    }

    static get_auth_token = async () => {
        const usr = await this.get_user();  
        return usr != null ? usr.token : '';
    }
}
export { UserStore }