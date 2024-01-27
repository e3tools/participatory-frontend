<template>
  <q-page padding>
    <!-- content -->
    <div>
      <q-card class="no-border no-shadow bg-transparent">
        <q-card-section class="q-pa-sm">
          <q-input rounded v-model="search" outlined :placeholder="t('DOCLISTVIEW_PAGE.SEARCH')">
            <template v-slot:append>
              <q-icon v-if="search ===''" name="search"/>
              <q-icon v-else name="clear" class="cursor-pointer" @click="search = ''" />
            </template>
          </q-input>
        </q-card-section>
      </q-card>
    </div>
    <div class="row q-col-gutter-sm">
      <div class="col-md-4 col-lg-4 col-sm-12 col-xs-12" v-for="(item, idx) in matchingResources" :key="idx">
        <card-help :doc="item" style="height: 530px;object-fit: contain;">
        </card-help>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent, ref } from 'vue'
import { DocTypeService } from 'src/services/DocTypeService'
import { AppUtil } from 'src/utils/app'
import { IDBReadParam } from 'src/interfaces'
import { computed } from 'vue'

export default defineComponent({
  name: 'HelpResourcesPage',
  components: {
    'card-help': defineAsyncComponent(()=> import('components/engage/HelpResourceCard.vue'))
  },
  setup() {
    const db = new DocTypeService("Help Resource")
    let data = ref([]) 
    let cfg = {} as IDBReadParam
    cfg.fields = ["*"]
    cfg.filters = [["is_published", "=", "1"]]
    db.get_list(cfg).then((res) => {
      data.value = res
    })
    const search = ref('')
    const data2 = [
      {
        title: 'Our Changing Planet',
        caption: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        rating: 2,
        amount: '$30',
        img: new URL("../assets/products/c-d-x-PDX_a_82obo-unsplash.jpg", import.meta.url),
        chip: 'Discount 90%',
        chip_color: 'grey-4',
        chip_class: 'text-blue absolute-top-right'
      },
      {
        title: 'Our Changing Planet',
        caption: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        rating: 4,
        amount: '$15',
        img: new URL('../assets/products/frankie-valentine-VghbBAYqUJ0-unsplash.jpg', import.meta.url),
      },
      {
        title: 'Our Changing Planet',
        caption: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        rating: 1,
        amount: '$50',
        img: new URL('../assets/products/giorgio-trovato-K62u25Jk6vo-unsplash.jpg', import.meta.url),
        chip: 'Sold Out',
        chip_color: 'grey-8',
        chip_class: 'text-white absolute-top-right'
      },
      {
        title: 'Our Changing Planet',
        caption: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        rating: 5,
        amount: '$70',
        img: new URL('../assets/products/jeroen-den-otter-iKmm0okt6Q4-unsplash.jpg', import.meta.url),
        chip: 'Discount 50%',
        chip_color: 'grey-4',
        chip_class: 'text-blue absolute-top-right'
      },
      {
        title: 'Our Changing Planet',
        caption: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        rating: 2,
        amount: '$50',
        img: new URL('../assets/products/john-fornander-m2WpKnlLcEc-unsplash .jpg', import.meta.url),
      },
      {
        title: 'Our Changing Planet',
        caption: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        rating: 4,
        amount: '$30',
        img: new URL('../assets/products/marek-szturc-0iIV1goIodE-unsplash.jpg', import.meta.url),
      },
    ];

    const matchingResources = computed(() => { 
      if(search.value === '') {
        return data.value
      }
      return data.value.filter((el) => el.title.toLocaleLowerCase().indexOf(search.value.toLocaleLowerCase()) > -1)
    })

    return {
      t: (text) => AppUtil.translate(text),
      data,
      search,
      matchingResources
    }
  }
})
</script>
