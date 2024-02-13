import { get_current_instance, onMounted } from "vue";
import { useCurrentInstanceStore } from "src/stores/current-instance-store";

export const useNotification = () => {
    
    onMounted(() => { 
        const currentInstance = get_current_instance()

        const store = useCurrentInstanceStore()

        store.set_current_instance(currentInstance)
    })
}