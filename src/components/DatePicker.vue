<template>
  <v-row justify="space-around">
    <v-date-picker v-model="picker" landscape reactive show-current type="date" :events="functionEvents"></v-date-picker>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component'

@Component
class DatePicker extends Vue {
  private picker: string;
  constructor() {
      super();
      this.picker = new Date().toISOString().substr(0, 10);
  }

  functionEvents (date: string) {
        const [,, day] = date.split('-')
        if ([12, 17, 28].includes(parseInt(day, 10))) return true
        if ([1, 19, 22].includes(parseInt(day, 10))) return ['red', '#00f']
        return false
    }
}

export default DatePicker;
</script>