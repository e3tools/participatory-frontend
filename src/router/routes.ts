import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    meta: { requiresAuth: true }, 
    component: () => import('layouts/MainLayout.vue'),
    children: [{ 
      name: 'index',
      path: '', 
      component: () => import('pages/IndexPage.vue') 
    }],    
    
  },
  {
    path: '/login',
    name: 'login',
    force: true,
    component: () => import('pages/LoginPage.vue')    
  },
  {
    path: '/user-profile',
    meta: { requiresAuth: true }, 
    component: () => import('layouts/MainLayout.vue'),
    children: [{ 
        name: 'user-profile', 
        path: '', 
        component: () => import('pages/UserProfilePage.vue') 
      }], 
  },
  {
    path: '/dashboard/:dashboard',
    meta: { requiresAuth: true }, 
    component: () => import('layouts/MainLayout.vue'),
    children: [{ 
        name: 'dashboard', 
        path: '', 
        component: () => import('pages/DashboardPage.vue'),  
        props: true
      }],   
  },
  {
    path: '/resources',
    meta: { requiresAuth: true }, 
    component: () => import('layouts/MainLayout.vue'),
    children: [{ 
      name: 'resources',
      path: '', 
      component: () => import('pages/HelpResourcesPage.vue'),
      props: true
    }], 
  }, 
  {
    path: '/resources/:docname',
    meta: { requiresAuth: true }, 
    component: () => import('layouts/MainLayout.vue'),
    children: [{ 
      name: 'resource-detail',
      path: '', 
      component: () => import('pages/HelpResourceDetailPage.vue'),
      props: true
    }],    
  },
  {
    path: '/form/:doctype/:docname',
    meta: { requiresAuth: true }, 
    component: () => import('layouts/MainLayout.vue'),
    children: [{
        name: 'form',
        path: '',
        component: () => import('pages/DocFormPage.vue'),
        props: true,
      }], 
  },
  {
    path: '/list/:doctype',
    meta: { requiresAuth: true }, 
    component: () => import('layouts/MainLayout.vue'),
    children: [{
        name: 'list',
        path: '',
        component: () => import('pages/DocListPage.vue'),
        props: true,
      }],
    
    // props: (route) => { 
    //   return { doctype: route.query.doctype };
    // },
    // props: true,
    // props: {
    //   default: true,
    //   doctype: (route) => ({ doctype: route.query.doctype }),
    // },
  },
  {
    path: '/report/:doctype',
    meta: { requiresAuth: true }, 
    component: () => import('layouts/MainLayout.vue'),
    children: [{
        name: 'report',
        path: '',
        component: () => import('pages/DocReportPage.vue'),
        props: true,
      }], 
  },
  {
    path: '/engage/:engagement/:entry',
    component: () => import('layouts/MainLayout.vue'),
    children: [{
        name: 'wizard',
        path: '',
        component: () => import('pages/MultiStepFormViewPage.vue'),
        props: true,
      }],    
  },
  {
    path: '/map',
    component: () => import('layouts/MainLayout.vue'),
    children: [{
        name: 'map',
        path: '',
        component: () => import('pages/MapPage.vue'),
        props: true,
      }],    
  }, 
  {
    path: '/action-task',
    meta: { requiresAuth: true }, 
    component: () => import('layouts/MainLayout.vue'),
    children: [{ 
      name: 'qa',
      path: '', 
      component: () => import('pages/engage/QAPage.vue')
    }], 
  },
  {
    path: '/action-task-update',
    meta: { requiresAuth: true }, 
    component: () => import('layouts/MainLayout.vue'),
    children: [{ 
      name: 'action-task-update',
      path: '', 
      component: () => import('pages/UpdateActionTaskPage.vue')
    }], 
  },
  {
    path: '/qa',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ 
      name: 'qa',
      path: '', 
      component: () => import('pages/engage/QAPage.vue')
    }], 
  },
  {
    path: '/ai',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ 
      name: 'ai-models',
      path: '', 
      component: () => import('pages/TopicModelPage.vue')
    }], 
  },  
  {
    path: '/table',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ 
      name: 'table',
      path: '', 
      component: () => import('pages/TableExamplePage.vue')
    }], 
  },  
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]; 

export default routes;
