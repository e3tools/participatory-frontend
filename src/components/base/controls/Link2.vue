    <!-- @update:model-value="setModel" -->
    <template>
      <q-select 
        v-model="model"
        clearable
        use-input
        hide-selected
        fill-input
        input-debounce="0"
        @filter="filterList"
        @input-value2="setModel"
        @update:model-value2="setModel"
        style="padding-bottom: 32px;" 
        :options="list_values"
        :option-label="option_label"    
        option-value="name"
        @clear="clearSelection"
      >
  <template v-slot:option="scope">
      <q-item v-bind="scope.itemProps">
          <q-item-section>
              <q-item-label class="text-capitalize">{{ scope.opt.name }}</q-item-label>
          </q-item-section>
      </q-item>
  </template>
  </q-select>
</template>

<script lang="ts">
import { defineComponent, ref, reactive} from 'vue'
import { QSelect } from 'quasar';
import { DocTypeService } from 'src/services/DocTypeService';
import { IDBReadParam } from 'src/interfaces'; 

export default defineComponent({
  name: 'WbLink',
  emits: ['input'],  
  props: ['doctype', 'value', 'filters', 'options'/*, 'option_label'*/],
  components: { QSelect },
  async setup(props, ctx) {
    // const fieldRef = ref(null);
    const ref_doctype = props.options //options is the doctype for which to load values
    const db = new DocTypeService(ref_doctype) 
    const list_values = ref([])
    const model = ref(null)
    const option_label = ref('name') 
    const handleChange = (newVal: string) => { 
      ctx.emit('input', newVal);
    };

    const getList = async (val = '') => {
      let cfg = {} as IDBReadParam      
      cfg.doctype = ref_doctype
      cfg.fields = ['name']
      cfg.limit_page_length = 20
      cfg.filters = val === '' ? [] : [['name', 'like', val]]
      return await db.get_list(cfg)
    }
    //let all_list_values = []// await getList(val) 

    const setModel = (val) => {
      debugger;
      model.value = val
    }
    return {
      model: ref(null),
      handleChange,
      setModel,
      option_label,
      list_values,
      clearSelection: (val) => {
        model.value = null
      },
      filterList: (val, update, abort) => {
        // call abort() at any time if you can't retrieve data somehow
        // if (!val){
        //   return update()
        // }
        update(async () => {
          const needle = val ? val.toLocaleLowerCase() : ''          
          list_values.value = await getList(needle)
          // if(val === ''){
          //   list_values.value = all_list_values
          // } else {            
          //   const needle = val ? val.toLocaleLowerCase() : ''
          //   all_list_values = await getList(needle)  
          //   //list_values.value = all_list_values.filter(v => v.name.toLocaleLowerCase().indexOf(needle) > -1)
          // }
        })
      }
    };
  },

})
</script>
