<template>
  <q-dialog class="q-gutter-sm" ref="uploaderdlg"
      @dragover.prevent="dragover"
      @dragleave.prevent="dragleave"
      @drop.prevent="dropfiles"
  >
    <q-card>
      <q-card-section>
        {{ __('FILE_UPLOADER.TITLE')}}
      </q-card-section>
      <q-card-section> 
        <div class="q-pa-md q-gutter-sm text-center">
          <q-btn no-caps align="around" class="btn-fixed-width" size="sm"  @click="browse_files">
            <q-list class="text-center">
              <q-item-list>
                <q-item-section align="center">
                  <q-icon size="xs" name="add" />
                  <q-item-label size="xs">My Device</q-item-label>
                  <!-- <q-btn flat icon="add" color="white" label="My Device" glossy stack color2="primary" /> -->
                </q-item-section> 
              </q-item-list>              
            </q-list> 
          </q-btn>
          <!-- <q-btn align="right" class="btn-fixed-width" color="secondary" label="Align to right" />
          <q-btn align="between" class="btn-fixed-width" color="accent" label="Align between" icon="flight_takeoff" />
          <q-btn align="around" class="btn-fixed-width" color="brown-5" label="Align around" icon="lightbulb_outline" /> -->
        </div> 
      </q-card-section>
      <q-card-section>
        <div v-if="!is_dragging">
          <div>
            {{ __('Drag and drop files, ') }}
            <label style="margin: 0">
              <a href="#" class="text-primary" @click.prevent>{{ __('browse,') }}</a>
              <input
                type="file"
                class="hidden"
                ref="file_input"
                @change="on_file_input"
                :multiple="allow_multiple"
                :accept="restrictions.allowed_file_types.join(', ')"
              >
            </label>
            {{ __('choose an') }}
            <a href="#" class="text-primary bold"
              @click.stop.prevent="show_file_browser = true"
            >
              {{ __('uploaded file') }}
            </a>
            {{ __('or attach a') }}
            <a class="text-primary bold" href
              @click.stop.prevent="show_web_link = true"
            >
              {{ __('web link') }}
            </a>
          </div>
          <div class="text-muted text-medium">
            {{ upload_notes }}
          </div>
        </div>
        <div v-else>
          {{ __('Drop files here') }}
        </div>
      </q-card-section> 
       
      <q-card-section>
        <div
          class="file-preview-area"
          v-show="files.length && !show_file_browser && !show_web_link"
        >
          <div class="file-preview-container" v-if="!show_image_cropper">
            <FilePreview
              v-for="(file, i) in files"
              :key="file.name"
              :file="file"
              @remove="remove_file(file)"
              @toggle_private="file.private = !file.private"
              @toggle_optimize="file.optimize = !file.optimize"
              @toggle_image_cropper="toggle_image_cropper(i)"
            />
          </div>
          <!-- <div class="flex align-center" v-if="show_upload_button && currently_uploading === -1">
            <button class="btn btn-primary btn-sm margin-right" @click="upload_files">
              <span v-if="files.length === 1">
                {{ __("Upload file") }}
              </span>
              <span v-else>
                {{ __("Upload {0} files", [files.length]) }}
              </span>
            </button>
            <div class="text-muted text-medium">
              {{ __("Click on the lock icon to toggle public/private") }}
            </div>
          </div> -->
        </div>
      </q-card-section>

      <q-card-section>
        <div v-if="currently_uploading !== -1 && !upload_complete && !show_file_browser && !show_web_link">
          <span
            :v-html2="String(currently_uploading + 1).bold() + ' of ' + String(files.length).bold()"
            v-html="1 + ' of ' + 3"
          ></span>
          <div
            v-for="(file, i) in files"
            :key="i"
            v-show="currently_uploading===1"
          >
          <q-linear-progress :value2="(file.progress * 100 / file.total)" :buffer="0.01" />    
          <q-linear-progress :value="0.5" :buffer="0.01" />    
          </div> 
        </div>
      </q-card-section>

      <q-card-actions align="right">        
        <q-btn 
            v-if2="show_upload_button && currently_uploading === -1"
            flat 
            no-caps
            icon="save" 
            color="white"
            class="bg-primary"
            v-close-popup
            @click="upload_files"
        >
          <span v-if="files.length === 1">
            {{ __('FILE_UPLOADER.UPLOAD_SINGLE_FILE') }}
          </span>
          <span v-else>
            {{ __('FILE_UPLOADER.UPLOAD_MULTIPLE_FILES') }}
          </span>
        </q-btn> 
        <!-- <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" /> -->
      </q-card-actions>
    </q-card>
  </q-dialog>
  <!-- <q-dialog v-model="show_dialog">
    <div class="file-uploader"
      @dragover.prevent="dragover"
      @dragleave.prevent="dragleave"
      @drop.prevent="dropfiles"
    >
      <div
        class="file-upload-area padding border rounded text-center cursor-pointer flex align-center justify-center"
        @click="browse_files"
        v-show="files.length === 0 && !show_file_browser && !show_web_link"
      >
        <div v-if="!is_dragging">
          <div>
            {{ __('Drag and drop files, ') }}
            <label style="margin: 0">
              <a href="#" class="text-primary" @click.prevent>{{ __('browse,') }}</a>
              <input
                type="file"
                class="hidden"
                ref="file_input"
                @change="on_file_input"
                :multiple="allow_multiple"
                :accept="restrictions.allowed_file_types.join(', ')"
              >
            </label>
            {{ __('choose an') }}
            <a href="#" class="text-primary bold"
              @click.stop.prevent="show_file_browser = true"
            >
              {{ __('uploaded file') }}
            </a>
            {{ __('or attach a') }}
            <a class="text-primary bold" href
              @click.stop.prevent="show_web_link = true"
            >
              {{ __('web link') }}
            </a>
          </div>
          <div class="text-muted text-medium">
            {{ upload_notes }}
          </div>
        </div>
        <div v-else>
          {{ __('Drop files here') }}
        </div>
      </div>
      <div class="file-preview-area" v-show="files.length && !show_file_browser && !show_web_link">
        <div class="margin-bottom" v-if="!upload_complete">
          <label>
            <input type="checkbox" class="input-with-feedback" @change="e => toggle_all_private(e.target.checked)">
            <span class="text-medium" style="font-weight: normal;">
              {{ __('Make all attachments private') }}
            </span>
          </label>
        </div>
        <div class="flex flex-wrap">
          <FilePreview
            v-for="(file, i) in files"
            :key="file.name"
            :file="file"
            @remove="remove_file(i)"
            @toggle_private="toggle_private(i)"
          />
        </div>
        <div class="flex align-center" v-if="show_upload_button && currently_uploading === -1">
          <button
            class="btn btn-primary btn-sm margin-right"
            @click="upload_files"
          >
            <span v-if="files.length === 1">
              {{ __('Upload file') }}
            </span>
            <span v-else>
              {{ __('Upload {0} files', [files.length]) }}
            </span>
          </button>
          <div class="text-muted text-medium">
            {{ __('Click on the lock icon to toggle public/private') }}
          </div>
        </div>
      </div>
      <div class="upload-progress" v-if="currently_uploading !== -1 && !upload_complete && !show_file_browser && !show_web_link">
        <span
          class="text-medium"
          v-html="__('Uploading {0} of {1}', [String(currently_uploading + 1).bold(), String(files.length).bold()])"
        >
        </span>
        <div
          class="progress"
          :key="i"
          v-for="(file, i) in files"
          v-show="currently_uploading===i"
        >
          <div
            class="progress-bar"
            :class="[file.total - file.progress < 20 ? 'progress-bar-success' : 'progress-bar-warning']"
            role="progressbar"
            :aria-valuenow="(file.progress * 100 / file.total)"
            aria-valuemin="0"
            aria-valuemax="100"
            :style="{'width': (file.progress * 100 / file.total) + '%' }"
          >
          </div>
        </div>
      </div>
      <FileBrowser
        ref="file_browser"
        v-if="show_file_browser"
        @hide-browser="show_file_browser = false"
      />
      <WebLink
        ref="web_link"
        v-if="show_web_link"
        @hide-web-link="show_web_link = false"
      />
    </div>
  </q-dialog> -->
</template>

<script lang="ts">
import { AppUtil } from 'src/utils/app'
import { defineAsyncComponent } from 'vue'
import { defineComponent, computed, ref } from 'vue'
import { get_headers } from 'src/utils/api'
export default defineComponent({
  name: 'FileUploader',
  props: {
		show_upload_button: {
			default: true
		},
		allow_multiple: {
			default: true
		},
		as_dataurl: {
			default: false
		},
		doctype: {
			default: null
		},
		docname: {
			default: null
		},
		folder: {
			default: 'Home'
		},
		method: {
			default: null
		},
		on_success: {
			default: null
		},
		restrictions: {
			default: () => ({
				max_file_size: null, // 2048 -> 2KB
				max_number_of_files: null,
				allowed_file_types: [] // ['image/*', 'video/*', '.jpg', '.gif', '.pdf']
			})
		},
		upload_notes: {
			default: null // "Images or video, upto 2MB"
		}
	},
  components: {
		FilePreview: defineAsyncComponent(() => import('components/file_upload/FilePreview.vue')),
		FileBrowser: defineAsyncComponent(() => import('components/file_upload/FileBrowser.vue')),
		WebLink: defineAsyncComponent(() => import('components/file_upload/WebLink.vue'))
	},
  setup(props) {
    const files = ref([]) 
    const is_dragging = ref(false)
    const currently_uploading = ref(-1)
    const show_file_browser = ref(false)
    const show_web_link = ref(false)
    const file_browser = ref(null)
    const file_input = ref(null)
    const web_link = ref(null)
    const __ = (txt, params) => AppUtil.__(txt, params)
    const show_image_cropper = ref(false)

    // watch: {
    //   files(newvalue, oldvalue) => {
    //     if (!props.allow_multiple && newvalue.length > 1) {
    //       files = [newvalue[newvalue.length - 1]];
    //     }
    //   }
    // }

    const upload_complete = computed(() => {
      return files.value.length > 0
				&& files.value.every(
					file => file.total !== 0 && file.progress === file.total);
    })

    const check_restrictions = (file: object) => {
      let { max_file_size, allowed_file_types } = props.restrictions

      let mime_type = file.type
      let extension = '.' + file.name.split('.').pop()
      let is_correct_type = true
      let valid_file_size = true

      if(allowed_file_types.length) {
        is_correct_type = allowed_file_types.some((type) => {
          //is a mime type
          if(type.includes('/')) {
            if(!file.type) return false
            return file.type.match(type)
          }

          //otherwise this is likely an extension
          if(type[0] === '.') {
            return file.name.endsWith(type)
          }
          return false
        })
      }

      if(max_file_size && file.size != null) {
        valid_file_size = file.size <= max_file_size
      }
      if(!is_correct_type) {
        console.warn('File skipped because of invalid file type', file)
      }
      if(!valid_file_size) {
        console.warn('File skipped because of invalid file size', file.size)
      }

      return is_correct_type && valid_file_size
    }

    const add_files = (file_array) => {
      let fls = Array.from(file_array)
              .filter(check_restrictions)
              .map(file => {
                let is_image = file.type.startsWith('image')
                return {
                  file_obj: file,
                  name: file.name,
                  doc: null,
                  progress: 0,
                  total: 0,
                  failed: false,
                  uploading: false,
                  private: !is_image
                }
              })
      files.value = files.value.concat(fls)
    }

    const upload_via_file_browser = () => {
      let selected_file = file_browser.value.selected_node
      if(!selected_file.value) {
        AppUtil.show_message(__('FILE_UPLOADER.CLICK_A_FILE_TO_SELECT'))
        return Promise.reject()
      }
      return upload_file({
        file_url: selected_file.file_url
      })
    }

    const upload_via_web_link = () => {
      let file_url = web_link.value.url
      if(!file_url){
        AppUtil.show_message(__('FILE_UPLOADER.INVALID_URL'))
      }
      return upload_file({
        file_url
      })
    }

    const return_as_dataurl = () => {
      let promises = files.value.map(file => {
        AppUtil.file_to_base64(file.file_obj)
            .then(data_url => {
              file.dataurl = data_url
              props.on_success && props.on_success(file)
            })
      })
      return Promise.all(promises)
    }

    const upload_file = (file: object, i: number) => {
      currently_uploading.value = i

      return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.upload.addEventListener('loadstart', (e) => {
          file.uploading = true
        })
        xhr.upload.addEventListener('progress', (e) => {
          if(e.lengthComputable){
            file.progress = e.loaded
            file.total = e.total
          }
        })
        xhr.upload.addEventListener('load', (e) => {
          file.uploading = false
          resolve()
        })
        xhr.onreadystatechange = () => { 
          if(xhr.readyState == XMLHttpRequest.DONE) {
            if(xhr.status === 200) {
              let r = null
              let file_doc = null
              try {
                r = JSON.parse(xhr.responseText)
                if(r.message.doctype === 'File') {
                  file_doc = r.message
                }
              } catch (error) {
                r = xhr.responseText
              }

              file.doc = file_doc

              if(props.on_success){
                props.on_success(file_doc, r)
              }
            } else {
              file.failed = true
              let error = null
              try {
                error = JSON.parse(xhr.responseText)
              } catch(e) {     
                console.log(e)             
              }
            }
          }
        }

        xhr.open('POST', AppUtil.make_frappe_api_endpoint('upload_file', false));
        xhr.setRequestHeader('Accept', 'application/json')
        xhr.setRequestHeader('X-Frappe-CSRF-Token', AppUtil.get_csrf_token())

        const headers = get_headers({})
        for (const [key, value] of Object.entries(headers)) {
          xhr.setRequestHeader(key, value)
        }

        let form_data = new FormData()
        if(file.file_obj){
          form_data.append('file', file.file_obj, file.name)
        }

        if(props.doctype && props.docname) {
          form_data.append('doctype', props.doctype)
          form_data.append('docname', props.docname)
        }

        if(props.method) {
          form_data.append('method', props.method)
        }

        xhr.send(form_data)
      })
    }

    return {
      __, //(txt) => AppUtil.__(txt),      
      show_dialog: ref(true),
      file_input,
      files,
			is_dragging,
			currently_uploading,
			show_file_browser,
			show_web_link,
      show_image_cropper,
      upload_complete,
      file_browser,
      upload_via_file_browser,
      upload_via_web_link,
      return_as_dataurl,
      upload_file,
      add_files,
      dragover: () => {
        console.log('drag over')
        is_dragging.value = true
      },
      dragleave: () => {
        console.log('drag leave')
        is_dragging.value = false
      }, 
      dropfiles: (e) => {
        console.log('drop files')
        is_dragging.value = false
        add_files(e.dataTransfer.files)
      },
      browse_files: () => {
        file_input.value.click()
      },
      on_file_input: (e) => {
        add_files(file_input.value.files)
      },
      remove_file: (file: object) => { 
        files.value = files.value.filter((f) => f !== file);
      },
      toggle_private: (i) => {
        files.value[i].private = !files.value[i].private
      },
      toggle_all_private: (flag) => {
        files.value = files.value.map(file => {
          file.private = flag
          return file
        })
      },      
      upload_files: () => {
        if(show_file_browser.value) {
          return upload_via_file_browser()
        }
        if(show_web_link.value) {
          return upload_via_web_link()
        }
        if(props.as_dataurl) {
          return return_as_dataurl()
        }
        files.value.map((file, i) => {
          upload_file(file, i)
        })
      }, 
    }
  }
})
</script>
