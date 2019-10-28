<template>
    <v-row>
      <v-col>
        <v-card class="pa-2" outlined tile>
          <v-card-title>Bench Press</v-card-title>
          <DatePicker/>
        </v-card>
      </v-col>
      <v-col>
        <v-card class="pa-2" outlined tile>
          <v-card-title>Squats</v-card-title>
          <DatePicker/>
        </v-card>
      </v-col>
      <v-col>
        <v-card class="pa-2" outlined tile>
          <v-card-title>Dead Lift</v-card-title>
          <DatePicker/>
        </v-card>
      </v-col>
    </v-row>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component'
import DatePicker from '../components/DatePicker.vue'

@Component({
  components: {
    DatePicker
  }
})
class Home extends Vue {
  
}

export default Home;
</script>