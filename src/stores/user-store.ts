import { defineStore } from 'pinia';
import { LocalStorage, extend } from 'quasar';
import { readonly, ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  
  const currentUser = ref(LocalStorage.getItem('frappeUser') || {})

  const setUser = (userData: object) => {
    const copyOfData = extend(true, {}, userData)
    LocalStorage.set('frappeUser', copyOfData)
    currentUser.value = copyOfData;
    return true
  }

  return {
    currentUser: readonly(currentUser), //only setUser method can modify it
    getUser: () => {
      return currentUser.value
    },
    setUser,
    setPhotoURL(url: string | null) {
      currentUser.value.avatar = url
    },
    removeUser(){
      return setUser({})
    }
  }
})