import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCurrentInstanceStore = defineStore('component', () => {
  const currentInstance = ref({})

  const setCurrentInstance = (proxy: object) => {
    currentInstance.value = proxy
  }

  const getCurrentInstance = () => {
    return currentInstance.value
  }

  return {
    currentInstance,
    setCurrentInstance,
    getCurrentInstance
  }
});
