<template>
  <q-page padding>
    <!-- content -->
    <q-card>
      <q-card-section>
        <div class="text-h6 text-justify">
        Core Concepts of Topic Modeling
        </div>
        </q-card-section>
      <q-card-section class="text-justify">

          We’ve established topic modeling enables data professionals to rapidly analyze and identify clusters or groups of similar words within a body of text at scale.

          But what are topics, and how does topic modeling work?
          What are topics, and how do topic models work?

          Topics are the latent descriptions of a corpus (large group) of text. Intuitively, documents regarding a specific topic are more likely to produce certain words more frequently.

          For example, the words “dog” and “bone” are more likely to appear in documents concerning dogs, whereas “cat” and “meow” are more likely to be found in documents regarding cats. Consequently, the topic model would scan the documents and produce clusters of similar words.

          Essentially, topic models work by deducing words and grouping similar ones into topics to create topic clusters.
      </q-card-section>

      <q-card-section>
        <q-img
          src="src/assets/images/topic-model-summary.png"
        />
        <div class="q-pa-sm text-center text-muted text-subtitle2 text-italic">
          A visualization of how topic modeling works
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
   name: 'TopicModelPage'
})
</script>
