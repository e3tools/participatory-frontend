<template>
  <q-input 
    outlined
    :model-value="value"
    :type="isPassword ? 'password' : 'text'"
    :label="label"
    :hint="tooltip"
  >
  <template v-slot:append v-if="allowToggle">
    <q-icon
      :name="isPassword ? 'visibility_off': 'visibility'"
      class="cursor-pointer"
      @click="isPassword = !isPassword"
    >

    </q-icon>
  </template>
  </q-input>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
export default defineComponent({
  name: 'WbPassword',
  props: ['label', 'tooltip', 'value', 'allowToggle'],
  setup(props) { 
    return {
      isPassword: ref(true)
    }
  }
})
</script>
