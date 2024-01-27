<!--https://v0-17.quasar-framework.org/components/datatable.html-->
<template>
   <!-- <q-table
      flat
      bordered
      ref="tableRef"
      title="Treats"
      :rows="rows"
      :columns="cols"
      row-key="name"
      v-model:pagination="pagination"
      :loading="loading"
    :filter="filter"
    binary-state-sort
    @request="onRequest" 
    ></q-table> -->

  <q-table
    flat
    bordered
    ref="tableRef"
    :title2="doctype"
    :rows="rows"
    :columns="cols"
    row-key="name"
    v-model:pagination="pagination"
    :loading="loading"
    :filter="filter"
    binary-state-sort
    @request="onRequest"
  >
    <template v-slot:body-cell-name="props">
        <q-td :props="props">
          <!-- <div>
            <q-badge color="purple" :label="props.value" />
          </div> -->
          <!-- <base-router-link
            :force="true"
            :to="navListView(props.row)">
            {{ props.row.name }}
          >        
          </base-router-link> -->
          <router-link
           :force="true"
           :to="navListView(props.row)">
            {{ props.row.name }}
          </router-link>
        </q-td>
    </template>

    <template v-slot:top-right>
      <q-btn 
        no-caps
        push
        icon="add"
        :label="t('BUTTON.ADD') + ' ' + doctype"
        rounded
        color="primary"
        :to="navBtnAdd()"
      />      
    </template>

    <template v-slot:top-left v-if="0==1">
      <q-input 
        bordered
        dense
        debounce="300"
        v-model="filter"
        :placeholder="t('DOCLISTVIEW_PAGE.SEARCH')"
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>
  </q-table>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted } from 'vue'
import { DocTypeService } from 'src/services/DocTypeService';
import { IDBReadParam } from 'src/interfaces';
import { route } from 'quasar/wrappers';
import { AppUtil } from 'src/utils/app';
import { useRoute } from 'vue-router';
import { useEngagementStore } from 'src/stores/engagement-store';
import { DOCTYPES } from '../../../enums';
import { defineAsyncComponent } from 'vue';

export default defineComponent({
  name: 'DocListViewPage',
  props: ['doctype', 'parentdoc', 'ischildtable', 'parenttype', 'parent', 'parentfield'],
  components: {
    'base-router-link': defineAsyncComponent(()=> import('components/base/BaseRouterLink.vue'))
  },
  async setup(props) {     
    const route = useRoute()
    const db = new DocTypeService(props.doctype)
    const tableRef = ref()
    const rows = ref([])
    const filter = ref('')
    const loading = ref(false)
    const sort_field = ref('name')
    const sort_ascending = ref(true)
    const rowsPerPage = ref(20)
    const pagination = ref({
        sortBy: sort_field.value,
        descending: sort_ascending.value,
        page: 1,
        rowsPerPage: rowsPerPage.value,
        rowsNumber: 306
    }) 
    const cols = ref([{
      'name': 'name',
      'label': AppUtil.translate('ID'),
      align: 'left',
      field: 'name',
      sortable: true,
      // format: (val, row) => {
      //   return `<b>${val} </b>`;// '<a href=#>`${val}`</a>'
      // }
    }])
    const fields = ref(['name'])
    const onRequest = async (options) => {
      const { page, rowsPerPage, sortBy, descending } = options.pagination
      const filter = options.filter

      loading.value = true

      let config = {} as IDBReadParam
      config.doctype = props.doctype
      config.fields = fields.value
      let query = route.query 
      if(props.ischildtable && props.parenttype && props.parentfield){
        query['parenttype'] = props.parenttype
        query['parent'] = props.parent
        query['parentfield'] = props.parentfield
      }
      config.filters = AppUtil.makeFilters(query)
      config.order_by='name ASC'    
     
      // update total rows count. Get the count from backend
      pagination.value.rowsNumber = 306

      //If "All" (0) is selected, get all rows
      if(rowsPerPage === 0){
        config.limit_start = 0
        config.limit_page_length = 0
      }
      else {        
        config.limit_start = (page - 1) * rowsPerPage
        config.limit_page_length = rowsPerPage
      }

      if(!props.ischildtable){
        // get data from server
        rows.value = await db.get_list(config)
      }
      else { 
        rows.value = props.parentdoc?.__islocal ? [] : props.parentdoc?.[props.parentfield]
      }
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
    console.log("Getting doctype doclist")
    const docDefinition = await db.get_doctype()
    console.log("Retrieved doctype doclist")
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
    }

    console.log("Columns: ", cols)

    const cols2 = [{ name: 'calories', align: 'center', label: 'Calories', field: 'calories', sortable: true },
  { name: 'fat', label: 'Fat (g)', field: 'fat', sortable: true },
  { name: 'carbs', label: 'Carbs (g)', field: 'carbs' }]
    
    const engagementStore = useEngagementStore()
    // await loadInitialData()
    return {
      t: (text) => AppUtil.translate(text),
      navBtnAdd: () => {
        if(props.doctype != DOCTYPES.ENGAGEMENT_ENTRY){
          return `/form/${props.doctype}/new`
        }
        const curr_engagement = route.query.engagement
        return `/engage/${curr_engagement}/new`
      },
      navListView: (row: object) => {
        if(props.doctype != DOCTYPES.ENGAGEMENT_ENTRY){
          return `/form/${props.doctype}/${row.name}`
        }
        return `/engage/${row.engagement}/${row.name}`
      },
      tableRef,
      filter,
      loading,
      pagination,
      cols,
      cols2,
      rows,
      onRequest
    }
  }
})
</script>
