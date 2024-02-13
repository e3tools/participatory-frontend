import { getCurrentInstance, onMounted } from 'vue';
import { useCurrentInstanceStore } from 'src/stores/current-instance-store';

export const useGlobalVariables = () => {
    onMounted(() => { 
        const current_instance = getCurrentInstance()

        const store = useCurrentInstanceStore()

        store.set_current_instance(current_instance)
    })
}