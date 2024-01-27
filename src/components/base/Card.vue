<template>
  <q-card class="no-show" bordered>
    <q-card-section>
      <div class="text-h6 text-grey-8">
        <slot name="header"></slot>
      </div>
    </q-card-section>
    <q-separator />
    <q-card-section>
      <slot name="content"></slot>
    </q-card-section>
    <q-card-action align="left">
      <slot name="actions"></slot>
    </q-card-action>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'WbCard',
  setup() {

  }
})
</script>
