<template>
  <router-view />
</template>

<script setup lang="ts">
import { useGlobalVariables } from './composables/GlobarVariables';

const globalVars = useGlobalVariables()

</script>
