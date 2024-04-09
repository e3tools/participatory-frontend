const InstanceStore = class InstanceStore {
    static set_current_instance = (proxy: object) => {
        console.log(proxy);
    }

    static get_current_instance = () => {
        console.log("Getting...");
    } 
}
export { InstanceStore }
 