<template>
  <div class="q-pa-md">
    <wb-form> </wb-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useQuasar } from 'quasar';
import WbForm from '../Form.vue';

export default defineComponent({
  name: 'SurveyContainer',
  components: { WbForm },
  setup() { 
    const name = ref(null);

    return {
      name,
    };
  },
});
</script>
