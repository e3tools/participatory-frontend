<template>
  <div onclick="">
    <router-link
      :to="$props.to"
      :tag2="$props.tag"
    >
      {{ slots.default }}
    </router-link>
  </div>
</template>

<script lang="ts">
import router from 'src/router';
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router';
import { useSlots } from 'vue';

export default defineComponent({
  name: 'BaseRouterLink',
  props: {
    to: { type: String, required: true },
    tag: { type: String, required: false, default: 'a'}
  },
  setup(props) {
    const router = useRouter()
    const slots = useSlots()
    return {
      slots,
      navigate: () => {
        //router.push({})
      }
    }
  }
})
</script>
