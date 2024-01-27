import { boot } from 'quasar/wrappers'
import { AppUtil } from '../utils/app'

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ app, router/*, ...*/ }) => {
  // something to do  
  router.beforeEach((to, from, next) => {     
    if (to.meta.requiresAuth) {
      //const token = localStorage.getItem('token');
      const token = AppUtil.getCurrentUser()
      if (token) {
        // User is authenticated, proceed to the route
        next();
      } else {
        // User is not authenticated, redirect to login
        next('/login');
      }
    } else {
      // Non-protected route, allow access
      next();
    }
  })
})
