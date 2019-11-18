<template>
  <v-row justify="space-around">
    <v-date-picker
      v-bind:value="value"
      v-on:change="dateChangedHandler"
      v-on:update:picker-date="pickerDateHandler"
      :landscape="!$vuetify.breakpoint.xsOnly"
      reactive
      type="date"
      min="2016-01-01"
      :first-day-of-week="1"
      :allowed-dates="isDateAllowedHandler"
      :events="functionEvents"
      :disabled="isDisabled"
    ></v-date-picker>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component
class DatePicker extends Vue {
  @Prop()
  isDisabled!: boolean;
  @Prop()
  value!: string;
  //ISO-formatted array of strings YYYY-MM-DD
  @Prop({required: true})
  trainingDates!: string[];
  private lastPickerMonth!: string;
  constructor() {
    super();
  }

  //date in YYYY-MM-DD format
  isDateAllowedHandler(isoDate: string) {
    return !this.trainingDates.includes(isoDate);
  }

  functionEvents(date: string) {
    return this.trainingDates.includes(date);
  }

  dateChangedHandler(newDate: string) {
    this.$emit('input', newDate);
  }

  pickerDateHandler(val: string) {
    if (!this.lastPickerMonth) {
      this.lastPickerMonth = val;
      return;
    }
    if (this.lastPickerMonth === val) {
      return;
    }
    this.$emit('view-change', val);
    this.lastPickerMonth = val;
  }
}

export default DatePicker;
</script>