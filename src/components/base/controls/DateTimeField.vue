<!-- :stack-label="label" -->
<template> 
  <q-input 
      outlined
      :value="value"
      :label="label"
     
      :hint="tooltip"
      type="fulltime"
      color="primary"
    />
  <!-- <div class="q-pa-md" style="max-width: 300px">
      <q-input filled :value="value" mask="value" :rules="['value']">
        <template v-slot:prepend>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy>
              <q-date :value="value" @update:model-value ="$q.notify('date clicked')" ></q-date>
            </q-popup-proxy>
          </q-icon>
        </template>

        <template v-slot:append>
          <q-icon name="access_time" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-time :value="value" mask="YYYY-MM-DD HH:mm" format24h>
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-time>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div> -->

  <!-- <q-input 
    filled 
    v-model="date" 
    mask="date"
    :rules="['date']">
    <template v-slot:append>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <q-date v-model="date">
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Close" color="primary" flat />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>  -->
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useQuasar } from 'quasar';

export default defineComponent({
  name: 'WbDateTime',
  props: ['label', 'tooltip', 'value', 'v-model'],
  setup(props) {      
    return {
      fieldVal: ref(null), 
     // date: ref(props.value)// '2019/02/01'//props.value
    };
  },
});
</script>
