<template>
  <div>
    <q-item style="max-width: 420px;" v-for="msg in notifications" :key="msg.id" clickable v-ripple>
      <q-item-section avatar>
        <q-avatar rounded color="red" text-color="white" icon="directions" />
        <!-- <q-avatar>
          <img :src="msg.avatar" />
        </q-avatar> -->
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ msg.title }}</q-item-label>
        <q-item-label caption lines="1">{{ msg.message }}</q-item-label>
      </q-item-section>

      <q-item-section side top>
        {{ msg.time }}
      </q-item-section>
    </q-item>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue' 
import { AppUtil } from 'src/utils/app'; 
import { onMounted } from 'vue';
import { IDBReadParam } from 'src/interfaces';

export default defineComponent({
  name: 'NotificationList',
  setup() {
    const messages = ref([])

    const getNotifications = async () => {
      const currentUser = AppUtil.getCurrentUser()
      const param = {}
      const data = await AppUtil.getDB().get_list({
            doctype:'Activity Log', 
            filters:[['status', '=', 'Success'], ['user', '=', currentUser.name]],
            or_filters:[],
            fields:['name', 'subject', 'user', 'communication_date'],
            order_by:'communication_date DESC',
            limit_start:5 //pull last 5
          }) 
          messages.value.push.apply(messages.value, data)
    } 
    
    const notifications = computed(() => {      
      return AppUtil.transform(messages.value, {
          'name': 'id',
          'subject': 'title',
          'user': 'message',
          'communication_date': 'time',
        })
    })

    onMounted(() => { 
      const res = getNotifications()
    })
     
    return {
        notifications,
        getNotifications
      }
  } 
})
</script>
