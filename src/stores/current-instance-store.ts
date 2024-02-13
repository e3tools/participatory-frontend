import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCurrentInstanceStore = defineStore('component', () => {
  const current_instance = ref({})

  const set_current_instance = (proxy: object) => {
    current_instance.value = proxy
  }

  const get_current_instance = () => {
    return current_instance.value
  }

  return {
    current_instance,
    set_current_instance,
    get_current_instance
  }
});
