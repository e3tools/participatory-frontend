import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Headline, Paragraph, Subheading } from 'react-native-paper'

const SLMHelp = () => {
  return (
    <ScrollView>
        <Headline>
            Sustainable Land Management (SLM)
        </Headline>
      <Paragraph style={styles.paragraph}>
      SLM as the use of land resources, including soils, water, animals and plants, for the production of goods to meet changing human needs, while simultaneously ensuring the long-term productive potential of these resources and the maintenance of their environmental functions.
      </Paragraph>

    <Subheading style={styles.subheading}>
        Attribution
    </Subheading>
    
      <Paragraph style={styles.paragraph}>
        The lookup of interventions is done from the WOCAT database.
         {/* The recommended interventions related to SLM are shortlisted via an algorithm developed by https://whe.acaciadata.com/# */}
      </Paragraph>

    <Subheading style={styles.subheading}>
        SLM Objectives
    </Subheading>

      <Paragraph style={styles.paragraph}>   
        SLM provides flexible, adaptable solutions in a world of fast-changing natural conditions (e.g. climate change and variability, extreme weather events), social conditions (e.g. migration, feminization of agriculture), and economic conditions (e.g. changing markets).Global and local development challenges demand that land users innovate and find ways of managing their land sustainably, staying resilient in the face of change and maintaining or improving their livelihoods and living conditions.
      </Paragraph>

      <Paragraph style={styles.paragraph}>  
        SLM provides flexible, adaptable solutions in a world of fast-changing natural conditions (e.g. climate change and variability, extreme weather events), social conditions (e.g. migration, feminization of agriculture), and economic conditions (e.g. changing markets).Global and local development challenges demand that land users innovate and find ways of managing their land sustainably, staying resilient in the face of change and maintaining or improving their livelihoods and living conditions.
      </Paragraph>

      <Subheading style={styles.subheading}>
        How to use SLM
      </Subheading>

      <Paragraph style={styles.paragraph}>
      You must turn on the Switch next to the search box. After that you can zoom and click anywhere on the map, and after selecting the “hammer” it will give the range of options for that particular pixel, and provide a through-link to the WOCAT database with all its detailed guidance for this specific proposed intervention.  
      </Paragraph>

      <Paragraph style={styles.paragraph}>
   It is thus a smart lookup table for the extensive WOCAT Database on catchment/rainwater harvesting/landscape solutions, and supports planners and field agents select suitable interventions for their respective areas, based on an algorithm that combines land use, precipitation, slope. It does help do a first selection of appropriate interventions to enhance climate resilience.
      </Paragraph>
    </ScrollView>
  )
}

export default SLMHelp

const styles = StyleSheet.create({
    subheading: {
        fontWeight: 'bold',
        textAlign: 'justify'
    },
    paragraph: {
        textAlign: 'justify'
    }
})