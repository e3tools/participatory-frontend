<template>
  <div class="q-pa-md">
    <div>
      <q-select
        filled
        options-dense
        use-input         
        fill-input       
        hide-selected
        input-debounce="0" 
        :options="options"
        label="Admin"
        @filter="filter_admins"
        @input-value="set_model_admin" 
        option-label="admin_name"
        option-value="name"
        @update:model-value="select_admin"
      >
        <template v-slot:option="scope">
          <q-expansion-item
            dense
            expand-separator
            clickable
            group="admins"
            :default-opened="hasChild(scope)"
            header-class="text-weight-bold"
            :label="scope.opt.admin_name"
            @click="selected_admin = scope.opt"
          >
            <template v-for="admin1 in scope.opt.children" :key="admin1.name">
              <q-item
                dense               
                clickable
                v-ripple
                v-close-popup
                @click="selected_admin = scope.opt" 
              >
                <q-item-section>
                  <q-item-label class="q-ml-md">{{ admin1.admin_name }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-expansion-item>
        </template>
      </q-select>
    </div> 
  </div>
</template>
<!-- <template>
    <q-header>
      <q-toolbar>
        <q-toolbar-title>
          Diagnostics
        </q-toolbar-title>

        <div class="q-qutter-sm row items-center no-wrap">
          <q-select    
              filled
              v-model="adminOne"
              use-input         
              fill-input       
              hide-selected
              input-debounce="0"                 
              :options="adminOneOptions"
              @filter="filterAdminOne"
              @input-value="setModelAdminOne" 
              behavior="menu"
              option-label="shapeName"
              option-value="shapeID"
              placeholder="County"
              style="max-width:116px"
              @update:model-value="selectShape"
            />

            <q-select    
              filled
              v-model="adminTwo"
              use-input         
              fill-input       
              hide-selected
              input-debounce="0"                 
              :options="adminTwoOptions"
              @filter="filterAdminTwo"
              @input-value="setModelAdminTwo" 
              behavior="menu"
              option-label="shapeName"
              option-value="shapeID"
              placeholder="Sub-county"
              style="max-width:117px"   
              @update:model-value="selectShape"
            />

            <q-select    
                filled
                v-model="adminThree"
                use-input         
                fill-input       
                hide-selected
                input-debounce="0"                 
                :options="adminThreeOptions"
                @filter="filterAdminThree"
                @input-value="setModelAdminThree" 
                behavior="menu"
                option-label="shapeName"
                option-value="shapeID"
                placeholder="Ward"
                style="max-width:120px"    
                @update:model-value="selectShape"
            />
        </div>
      </q-toolbar>
    </q-header>
</template> -->

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { VectorService } from '../../services/VectorService';
import lodash from 'lodash-es';
import deepdash from 'deepdash-es';

const _ = deepdash(lodash);

export default defineComponent({
  name: 'VectorSelect',
  props: ['onChange'],
  setup(props, ctx) {

    let badChildren = [
      {
        name: '1',
        bad: false,
        children: [
          { name: '1.1', bad: false },
          { name: '1.2' },
          { name: '1.3', bad: true },
        ],
      },
      {
        name: '2',
        children: [
          { name: '2.1', bad: false },
          { name: '2.2' },
          { name: '2.3', bad: true },
        ],
      },
      {
        name: '3',
        bad: true,
        children: [
          { name: '3.1', bad: false },
          { name: '3.2' },
          { name: '3.3', bad: true },
        ],
      },
      ];

    let reallyBad = _.filterDeep(badChildren, 'bad', { tree: true });
    console.log('Rally bad', reallyBad);

    let things = {
    things: [
      { name: 'something', good: false, level: 0 },
      {
        name: 'another thing', good: true, level: 0,
        children: [
          { name: 'child thing 1', good: false, level: 0 },
          { name: 'child thing 2', good: true, level: 0 },
          { name: 'child thing 3', good: false, level: 0 },
        ],
      },
      {
        name: 'something else', good: true, level: 0,
        subItem: { name: 'sub-item', good: false, level: 0 },
        subItem2: { name: 'sub-item-2', good: true, level: 0 },
      },
    ],
  };
  let filtrate = _.filterDeep(
    things,
    (value, key, parent) => {
      if (key == 'name' && parent.good) return true;
      if (key == 'good' && value == true) return true;
    }
  );
  console.log('Filtrate', filtrate);
 

    const options = ref([])
    const all_admins = ref([])
    const selected_admin = ref(null);
    const filter_admins = (val, update) => {
      if (val === '') {
        update(() => { 
          options.value = [...all_admins.value]           
        })
        return
      } else {
        update(() => {
          const needle = val.toLowerCase();
          let reee = _.filterDeep(
            all_admins.value, 
            (value, key, parent, context) => {               
              if (key == 'name' && value.toLowerCase().indexOf(needle) > -1) return true;
              if (key == 'admin_name' && parent.name.toLowerCase().indexOf(needle) > -1) return true;
              if (key == 'level' && parent.name.toLowerCase().indexOf(needle) > -1) return true;
              //if (key == 'children' && parent.name.toLowerCase().indexOf(needle) > -1) return true;
              
              //if (key == 'name' && parent.parent) return true;
            //   if (key == 'children') {
            //     console.log(value)
            //   }
            //   const indx = parent.admin_name?.toLowerCase().indexOf(needle);
            //   if(indx != -1){
            //     console.log(parent.admin_name, " found")
            //   } else {
            //     // console.log(obj.admin_name, " not found")
            //   }
            // return indx != -1;
          }, { tree: true, rootIsChildren: true, leavesOnly:false });
          options.value = reee
          //options.value = all_admins.value.filter(v => v.admin_name.toLowerCase().indexOf(needle) > -1);
        })
      }
    }
    
    VectorService.get_admin_tree().then((res) => {
      options.value = res;
      all_admins.value = [...res];
    })

    const set_model_admin = (val) => {  
      selected_admin.value = val
    }
    
    const select_admin = () => {
        ctx.emit('select-admin', selected_admin.value);
    }

    return {
      selected_admin,
      options,
      filter_admins,
      set_model_admin,
      // options: [
      //   {
      //     label: 'American cars',
      //     children: [
      //       {
      //         label: 'Ford'
      //       },
      //       {
      //         label: 'General Motors'
      //       },
      //       {
      //         label: 'Tesla'
      //       }
      //     ]
      //   },
      //   {
      //     label: 'German cars',
      //     children: [
      //       {
      //         label: 'Audi'
      //       },
      //       {
      //         label: 'BMW'
      //       },
      //       {
      //         label: 'Porsche'
      //       }
      //     ]
      //   },
      //   {
      //     label: 'Italian cars',
      //     children: [
      //       {
      //         label: 'Ferrari'
      //       },
      //       {
      //         label: 'Lamborghini'
      //       },
      //       {
      //         label: 'Maserati'
      //       }
      //     ]
      //   },
      //   {
      //     label: 'Japanese cars',
      //     children: [
      //       {
      //         label: 'Honda'
      //       },
      //       {
      //         label: 'Nissan'
      //       },
      //       {
      //         label: 'Toyota'
      //       }
      //     ]
      //   },
      //   {
      //     label: 'Option without children',
      //     children: [
      //     ]
      //   }
      // ],
      hasChild (scope) { 
        return scope.opt.children.some(c => c.admin_name === selected_admin.value)
      },
      get_selected_admin: () => {
        const admin = {
          'name': 'Nyeri',
          'admin_name': 'Nyeri',
          'level': 1
        }
        selected_admin.value = admin;
        select_admin();
        return admin;
      },
      select_admin
    }
  }
})
</script>
