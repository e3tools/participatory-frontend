import { defineStore } from 'pinia';
import { LocalStorage, extend } from 'quasar';
import { readonly, ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  
  const current_user = ref(LocalStorage.getItem('frappeUser') || {})

  const set_user = (userData: object) => {
    const copyOfData = extend(true, {}, userData)
    LocalStorage.set('frappeUser', copyOfData)
    current_user.value = copyOfData;
    return true
  }

  return {
    current_user: readonly(current_user), //only set_user method can modify it
    getUser: () => {
      return current_user.value
    },
    set_user,
    setPhotoURL(url: string | null) {
      current_user.value.avatar = url
    },
    removeUser(){
      return set_user({})
    }
  }
})