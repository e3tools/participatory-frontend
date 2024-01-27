<template>
  <q-list bordered padding>
    <q-item>
      <q-item-section avatar>
        <q-img v-if="is_image" :src="src" :alt="file.name" style="object-fit: cover; height: 100%;" />
        <q-icon v-else color="primary" name="inbox" />
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ file.name }}</q-item-label>
        <q-item-label caption>{{ file_size }}</q-item-label>
      </q-item-section>
      <q-item-section side top>
        <!-- <q-item-label caption>Remove</q-item-label> -->
        <q-btn 
            v-if="!uploaded && !file.uploading && !file.failed"
            flat dense @click="$emit('remove')">
          <q-icon name="delete" color="primary" />
        </q-btn>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script lang="ts"> 
import { computed, onMounted, ref } from 'vue';
import { defineComponent } from 'vue'
import { format } from 'quasar'

export default defineComponent({
   name: 'FilePreview',
   props: {
    file: {
      type: Object,
      default: null
    }
   },
   setup(props) {
    const src = ref(null);
    const optimize = ref(props.file.optimize);

    const file_size = computed(() => {
      return format.humanStorageSize(props.file.file_obj.size)
    });

    const is_private = computed(() => {
      return props.file.doc ? props.file.doc.is_private : props.file.private
    });

    const uploaded = computed(() => {
      return props.file.request_succeeded
    });

    const is_image = computed(() => {
      return props.file.file_obj.type.startsWith("image")
    });

    const is_optimizable = computed(() => {
      const is_svg = props.file.file_obj.type == 'image/svg+xml'
      return is_image.value && !is_svg && !uploaded.value && !props.file.failed
    })

    const progress = computed(() => {
      let value = Math.round((props.file.progress * 100) / props.file.total)
      if(isNaN(value)) {
        value = 0
      }
      return value
    })

    const is_croppable = computed(() => {
      const croppable_types = ["image/jpeg", "image/png"]
      return (
        !uploaded.value &&
        !props.file.uploading &&
        !props.file.failed &&
        croppable_types.includes(props.file.file_obj.type)
      )
    })

    onMounted(() => { 
      if(is_image.value) {
        if(window.FileReader) {
          const fr = new FileReader();
          fr.onload = () => {
            src.value = fr.result
          };
          fr.readAsDataURL(props.file.file_obj);
        }
      }
    })

    return {
      src,
      file_size,
      is_private,
      uploaded,
      is_image,
      is_optimizable,
      progress,
      is_croppable
    }
   }
})
</script>
