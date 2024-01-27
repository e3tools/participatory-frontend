<template>
    <div class="flex items-center">
      <!-- file input -->
      <input type="file" ref="file_picker" @change="handleFileSelection($event)" :accept="fileTypes"
        style="display: inline" />
      <div class="flex items-center" v-show="file">
        <div class="q-mx-xs">{{ file?.name }}</div>
        <q-btn flat class="q-pa-none" color="red" icon="clear" no-caps @click="clearSelectedFile" />
      </div>
      <span class="q-mx-sm" v-show="!file">{{ uploaded_file_name }}</span>
      <q-btn flat icon="cloud_upload" color="grey" @click="getFiles" no-caps v-show="!file">
        <slot></slot>
      </q-btn>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      field_name: [String], // field name to upload
      is_locked: Boolean, //
      uploaded_file_name: String, // link to the uploaded file
      file_types: [Array, String],
    },
    data() {
      return {
        file: null,// holds the file picked
      }
    },
    computed: {
      fileTypes() {
        if (this.file_types?.length) return this.file_types;
        return 'image/jpeg, image/png, image/jpg,application/pdf'
      },
    },
    methods: {
      // pick file from device
      async getFiles() {
        this.$refs['file_picker'].click();
      },
      // handle file selection
      handleFileSelection(e) {
        let files = e.target.files;
        if (!files) return;
        [...files].forEach((file) => {
          file.upload_name = this.field_name;
          this.file = {
            file,
            name: file.name,
            size: ${(file.size / 1000000).toFixed(2)}MB,
            type: files[0]?.type.split("/")[1],
            url: URL.createObjectURL(files[0]),
          };
        });
        this.$emit('selected_file_emitted_event', this.file)
      },
      //clear selected file
      clearSelectedFile() {
        this.file = null;
        this.$refs['file_picker'].value = null
        this.$emit('selected_file_emitted_event', this.file)
      },
    },
  }
  </script>
  
  <style lang="scss" scoped></style>