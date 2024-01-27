import { getCurrentInstance, onMounted } from 'vue';
import { useCurrentInstanceStore } from 'src/stores/current-instance-store';

export const useGlobalVariables = () => {
    onMounted(() => { 
        const currentInstance = getCurrentInstance()

        const store = useCurrentInstanceStore()

        store.setCurrentInstance(currentInstance)
    })
}