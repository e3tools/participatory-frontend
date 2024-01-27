<!--https://v0-17.quasar-framework.org/components/datatable.html-->
<template> 
    <!-- <div class="scroll overflow-auto"> -->
    <div style="max-width: 90vw;" class="scroll">      
      <!-- v-model:pagination="pagination" -->
      <q-table class="q-pa-sm"
        :dense="$q.screen.lt.md"
        flat
        bordered
        ref="tableRef"
        :title="label"
        :rows="rows"
        :columns="cols"
        row-key="name"      
        :loading="loading"
        :filter="filter"
        binary-state-sort
        @request="onRequest"
        hide-pagination 
      >
        <template v-slot:body-cell-name="props">
            <q-td :props="props">
              <!-- <div>
                <q-badge color="purple" :label="props.value" />
              </div> -->
              <router-link
                :to="nav(props.row)">
                {{ props.row.idx }}
              </router-link> 
            </q-td>
        </template>

        <template #body-cell-idx="props">
          <q-td :props="props">
            <q-btn
              flat
              dense
              @click="editItem(props.row)"
            >
              {{ props.value }}
            </q-btn>
          </q-td>
        </template>

        <template #body-cell-edit="props">
          <q-td 
            :props="props" 
            class="text-center">
            <q-btn
              no-caps
              flat
              size="sm"
              @click="editItem(props.row)"
            >
              <q-icon size="xs" name="edit" />
              {{  t('BUTTON.EDIT') }}
            </q-btn>
          </q-td>
        </template>

        <template #bottom>
          <q-btn 
            flat 
            dense 
            no-caps
            outline 
            color="primary" 
            :label="t('BUTTON.ADD_ROW')"
            @click="showDialog=true"
            >
          </q-btn>
        </template>

        <template #no-data>         
            <div class="col-xs-12 q-pa-sm text-center">
              <q-icon left size="3em" name="report" />
            </div>
            <div class="col-xs-12 text-center">
              {{ t('CHILD_TABLE.NO_DATA') }}
            </div>
          <br/>
          <div class="row">            
            <q-btn 
              flat 
              dense 
              no-caps
              outline 
              color="primary" 
              :label="t('BUTTON.ADD_ROW')"
              @click="showDialog=true"
              >
            </q-btn>
          </div>
        </template>

      </q-table>

      <doc-dialog 
        v-model="showDialog"
        :docname="selectedItem?.name"
        :doc="selectedItem"
        :doctype="$props.doctype"
        :parent="$props.parentdoc"
        :showSaveButton="true"
        ref="dialogRef"
        :addRowHandler="addRow"
        :title="t('CHILD_TABLE.EDITING_ROW') + ' #' + (selectedIndex < 0 ? (rows.length + 1) : selectedIndex + 1)"
        @hide="closeDlg"
        @escape-key="closeDlg"
      />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n';
import { DocTypeService } from 'src/services/DocTypeService';
import { IDBReadParam } from 'src/interfaces'; 
import { AppUtil } from 'src/utils/app';
import { useRoute } from 'vue-router';
import { DOCTYPES } from 'src/enums';
import { defineAsyncComponent } from 'vue';
import apputil from 'src/boot/apputil';

export default defineComponent({
  name: 'ChildTableListView',
  components: {
    'doc-dialog': defineAsyncComponent(()=> import('components/base/views/DocDialogView.vue'))
  },
  props: ['doctype', 'parentdoc', 'label', 'parenttype', 'parent', 'parentfield'],  
  async setup(props) { 
    // const { t } = useI18n()
    const route = useRoute()
    const db = new DocTypeService(props.doctype)
    const tableRef = ref()
    const rows = ref([])
    const filter = ref('')
    const loading = ref(false)
    const sort_field = ref('name')
    const sort_ascending = ref(true)
    const rowsPerPage = ref(20)
    const selectedIndex = ref(-1)
    const dialogRef = ref(null)

    const pagination = ref({
        sortBy: sort_field.value,
        descending: sort_ascending.value,
        page: 1,
        rowsPerPage: rowsPerPage.value,
        rowsNumber: 306
    }) 
    const cols = ref([
    {
      name: 'idx',
      label: '#',
      field: 'idx'
    },  
    // {
    //   'name': 'name',
    //   'label': t('ID'),
    //   align: 'left',
    //   field: 'name',
    //   sortable: true,
    //   hidden: true,
    //   // format: (val, row) => {
    //   //   return `<b>${val} </b>`;// '<a href=#>`${val}`</a>'
    //   // }
    // }
  ])
    const fields = ref(['name'])
    const onRequest = async (options) => {
      const { page, rowsPerPage, sortBy, descending } = options.pagination
      const filter = options.filter

      loading.value = true

      let config = {} as IDBReadParam
      config.doctype = props.doctype
      config.fields = fields.value
      let query = route.query 
      if(props.parenttype && props.parentfield){
        query['parenttype'] = props.parenttype
        query['parent'] = props.parent
        query['parentfield'] = props.parentfield
      }
      config.filters = AppUtil.makeFilters(query)
      config.order_by='name ASC'    
     
      // update total rows count. Get the count from backend
      //pagination.value.rowsNumber = 306

      //If "All" (0) is selected, get all rows
      if(rowsPerPage === 0){
        config.limit_start = 0
        config.limit_page_length = 0
      }
      else {        
        config.limit_start = (page - 1) * rowsPerPage
        config.limit_page_length = rowsPerPage
      }

      // if(!props.ischildtable){
      //   // get data from server
      //   rows.value = await db.get_list(config)
      // }
      // else {  
      rows.value = props.parentdoc?.__islocal ? [] : props.parentdoc?.[props.parentfield]
      //}
      // update pagination object
      pagination.value.page = page
      pagination.value.rowsPerPage = rowsPerPage
      pagination.value.sortBy = sortBy
      pagination.value.descending = descending

      // turn off loading indicator
      loading.value = false
    }   

    onMounted(()=> {
      //get initial data from server (1st page)
      tableRef.value.requestServerInteraction()
    })
 
    // get columns to display 
    const docDefinition = await db.get_doctype()
    if (docDefinition) {
      let visibleColumns = docDefinition.fields.filter((item) => item.in_list_view === 1)
      // Show max of 5 columns
      for(let i=0; i<(Math.min(5, visibleColumns.length)); i++){
        let col = visibleColumns[i]
        cols.value.push({
          'name': col.fieldname,
          'label': AppUtil.translate(col.label),
          align: 'left',
          field: col.fieldname,
          sortable: true,
        })

        fields.value.push(col.fieldname)
      }

      cols.value.push({
        'name': 'edit',   
        sortable: true,
      })
    }

    // const closeDlg = () => {
    //   showDialog.value = false
    //   setTimeout(() => {
    //     selectedItem.value = null
    //     selectedIndex.value = -1
    //   }, 300);

    // }
    const selectedItem = ref(null)
    const showDialog = ref(false) 

    const cols2 = [{ name: 'calories', align: 'center', label: 'Calories', field: 'calories', sortable: true },
  { name: 'fat', label: 'Fat (g)', field: 'fat', sortable: true },
  { name: 'carbs', label: 'Carbs (g)', field: 'carbs' }]
    
    // await loadInitialData()
    return {
      t: (text) => AppUtil.translate(text),
      nav: (row) => {
        if(props.doctype != DOCTYPES.ENGAGEMENT_ENTRY){
          return `/form/${props.doctype}/${row.name}`
        }
        return `/engage/${row.engagement}/${row.name}`
      },
      dialogRef,
      tableRef,
      tableRef2: ref(null),
      filter,
      loading,
      pagination,
      cols,
      cols2,
      rows,
      onRequest,
      selectedIndex,
      selectedItem,
      showDialog,
      editItem: (row: object) => { 
        selectedIndex.value = rows.value.indexOf(row)
        selectedItem.value = Object.assign({}, row)
        showDialog.value = true
      },
      addRow: () => {
        const vals = dialogRef.value.getValues()
        if(selectedIndex.value > -1) {
          Object.assign(rows.value[selectedIndex.value], vals)
        } else {
          vals.idx = rows.value.length + 1
          rows.value.push(vals)
        }
      },
      deleteRow: (row: object) => {
        const index = rows.value.indexOf(row)
        confirm("Are you sure you want to delete this item?") && rows.value.splice(index, 1)
      },
      closeDlg: () => {
        showDialog.value = false
        setTimeout(() => {
          selectedItem.value = null
          selectedIndex.value = -1
        }, 300)
      },
      getRows: () => {
        return rows.value
      }
    }
  }
})
</script>
