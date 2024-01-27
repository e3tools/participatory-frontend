<template>
  <div>My component</div>
  <q-table
    :rows="rows"
    :columns="columns"
    row-key="id"
  >
  <!--Target all col headers -->
  <template #header-cell="props">
    <q-th
      style="font-size: 1.4em;"
      class="text-primary"
      :props="props"
    >
      {{ props.col.label }}
    </q-th>
  </template>

  <!--Target specific header slot-->
  <template #header-cell-email="props">
    <q-th :props="props">
      <q-icon
        size="sm"
        name="email"
        class="q-mr-sm"
        col="grey-7"
      />
      {{ props.col.label }}
    </q-th>
  </template>

  <!--Make all header cells editable -->
  <template #header="props">
    <q-tr>
      <q-th
        key="name"
        :props="props"
      >
        <q-input
          v-model="columns[0].label"
          dense
          borderless
          input-class="text-bold"
        />
      </q-th>

      <q-th
        key="email"
        :props="props"
      >
        <q-input
          v-model="columns[1].label"
          dense
          borderless
          input-class="text-bold"
        />
      </q-th>

      <q-th
        key="age"
        :props="props"
      >
        <q-input
          v-model="columns[2].label"
          dense
          borderless
          input-class="text-bold text-center"
        />
      </q-th>

    </q-tr>
  </template>

  <!--Aggregations  -->
  <template #top-row>
    <q-tr class="bg-blue-1">
      <q-td class="text-bold">
        Average: 
      </q-td>
      <q-td />
      <q-td class="text-center">
        {{ meanBy(rows, 'age') }}
      </q-td>
    </q-tr>
  </template>

  <template #bottom-row>
    <q-tr class="bg-green-1">
      <q-td class="text-bold">
        Total:
      </q-td>
      <q-td />
      <q-td class="text-center">
        {{ sumBy(rows, 'age') }}
      </q-td>
    </q-tr>
  </template>

  <!-- Top slot (above the actual table) -->
  <!-- <template #top>
    <div
      class="text-bold" 
      style="font-size: 1.3em;"
    >
      Cute pups
    </div>

    <q-input
      class="q-ml-md"
      dense
      outlined
      placeholder="Search"
    >
      <template #prepend>
        <q-icon name="search"/>
      </template>
    </q-input>
  </template> -->

  <!--Bottom slot-->
  <!-- <template #bottom>
    <span>Dogs from <a href="https://poochypooochypooch.com">poochypooochypooch.com</a></span>
  </template> -->

  <!--Top left and top-right-->
  <template #top-left>
    <div
      class="text-bold"
      style="font-size: 1.3em;"
    >
    Cute pups
    </div>
  </template>

  <template #top-right>
    <q-input
      class="q-ml-md"
      dense
      outlined
      placeholder="Search"
    >
      <template #prepend>
        <q-icon name="search"/>
      </template>
    </q-input>
  </template>

  <!--No data slot -->
  <template #no-data>
    <div>I can't find any data</div>
  </template>

  <!--Targe all the cells-->
    <!-- <template #body-cell="props">
      <q-td
        :props="props"
      >
        <q-btn
          flat
          color="primary"
          :label="props.value"
          @click="copyToClipboard(props.value)"
        >           
        </q-btn>
      </q-td>
    </template> -->

  <!--Target specific cells-->
    <!-- <template #body-cell-name="props">
      <q-td
        class="bg-blue-1"
        :props="props"
      >
        {{ props.value }}
      </q-td> 
    </template>

    <template #body-cell-email="props">
      <q-td
        class="bg-blue-2"
        :props="props"     
      >
        {{ props.value }}
      </q-td>
    </template>

    <template #body-cell-age="props">
      <q-td
        class="bg-blue-1"
        :props="props"
      >
        {{ props.value }}
      </q-td>
    </template> -->

  <!--Make cells editable -->
  <template #body="props">
    <q-tr
      :props="props"
    >
      <q-td
        key="name"
        :props="props"
      >
        <q-input
          v-model="props.row.name"
          borderless
          dense
        /> 
      </q-td>

      <q-td
        key="email"
        :props="props"
      >
        <q-input
          v-model="props.row.email"
          borderless
          dense
        />
      </q-td>

      <q-td
        key="age"
        :props="props"
      >
        <q-input 
          v-model="props.row.age"
          borderless
          dense
          input-class="text-center"
        />
      </q-td>
    </q-tr>
  </template>
    
  </q-table>
</template>

<script lang="ts">

//See https://dev.to/quasar/quasar-s-qtable-the-ultimate-component-4-6-all-the-slots-40g2

import { defineComponent, ref } from 'vue'
import { copyToClipboard } from 'quasar';
import { sumBy, meanBy } from 'lodash-es';

export default defineComponent({
  name: 'ChildTableExample',
  setup() {
    const rows = ref([
      {
        id: 1,
        name: 'Panda',
        email: 'panda@chihuahua.com',
        age: 6
      },
      {
        id: 2,
        name: 'Lily',
        email: 'lily@chihuahua.com',
        age: 5
      }
    ])

    const columns = ref([
      { label: 'name', field: 'name', name: 'name', align: 'left' },
      { label: 'email', field: 'email', name: 'email', align: 'left' },
      { label: 'age', field: 'age', name: 'age', align: 'center' }
    ])

    return {
      copyToClipboard,
      rows,
      columns,
      sumBy,
      meanBy
    }
  }
})
</script>
