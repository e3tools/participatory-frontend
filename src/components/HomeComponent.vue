<template>
  <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
    <q-card class="my-card no-shadow" bordered>
      <!-- <q-img
        src="https://cdn.quasar.dev/img/parallax1.jpg"
        basic
      >     
        <div class="absolute-bottom-left bg-transparent q-ml-md">
          <div class="text-h1">
            28 <sup>o</sup>
          </div>
          <div class="text-h5">
            India
          </div>
        </div>
      </q-img> -->

      <q-img
        src="../assets/images/flloca.jpeg"
        basic
      >
      </q-img>
    </q-card>

    <q-card class="fit no-shadow" bordered>
      <q-card-section class="text-h6 q-pb-none">
        <q-item>
          <q-item-section avatar class="">
            <q-icon color="blue" name="access_time" style="font-size: 2em;"/>
          </q-item-section>

          <q-item-section>
            <div class="text-h6">Citizen Engagement</div>
          </q-item-section>
        </q-item>
      </q-card-section>
      <q-card-section class="">
        <q-timeline :layout="layout" :side="side" color="secondary">

          <q-timeline-entry
            v-for="(timeline, index) in timeline_list"
            :key="index"
            :title="timeline.title"
            :subtitle="timeline.subtitle" :color="timeline.color" :icon="timeline.icon"
            :side="timeline.side"
          >
            <div>
              {{ timeline.desc }}
            </div>
          </q-timeline-entry>
        </q-timeline>
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import HomeImage from '../assets/images/home_image.jpeg'
export default defineComponent({
  name: 'HomeComponent',
  setup() {
    return {
      timeline_list: [
        {
          title: 'Inform',
          side: 'left',
          desc: 'Handout fact sheets or call meetings clearly described as informational',
          color: 'red',
          icon: 'thumb_up'
        },
        {
          title: 'Consult',
          side: 'left',
          desc: 'Give the public chances to comment, convene focus groups design public meetings that aim for dialogue',
          color: 'orange',
          icon: 'record_voice_over'
        }, 
        {
          title: 'Involve',
          side: 'left',
          desc: 'Conduct workshops; place interested or affected members on decision-making boards or groups',
          color: 'blue',
          icon: 'settings'
        }, 
        {
          title: 'Collaborate',
          side: 'left',
          desc: 'Create committees with members who have decision making authority',
          color: 'blue',
          icon: 'thumb_up'
        }, 
        {
          title: 'Empower',
          side: 'left',
          desc: 'Create citizen juries; hand over decision making to commissions',
          color: 'blue',
          icon: 'done_all'
        }
      ]
    }
  }
})
</script>
