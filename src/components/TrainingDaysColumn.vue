<template>
  <v-col sm="4">
      <v-list :max-width="maxWidth">
        <v-list-item v-on:click.stop="addNewButtonHandler">
          <v-list-item-action>
            <v-icon>mdi-plus</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Add new</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-list two-line :max-width="maxWidth">
        <v-subheader>HISTORY</v-subheader>
        <v-list-item-group :value="value" v-on:change="inputHandler" color="primary" mandatory>
          <v-list-item v-for="(item) in orderedHistory" :key="item.date" :value="item.date">
            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
              <v-list-item-subtitle v-text="item.subTitle"></v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
  </v-col>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { Dictionary } from "vue-router/types/router";
import { HistoryEntry } from "../declarations/weightlifting";

@Component
class TrainingDaysColumn extends Vue {
  private value: number = 0;
  @Prop()
  private addNewButtonHandler!: () => void;
  @Prop()
  private history!: Dictionary<HistoryEntry>;
  @Prop()
  private maxWidth!: () => string;
  constructor() {
    super();
  }

  private get orderedHistory() {
    let keys = Object.keys(this.history).sort((a, b) => (b > a ? 1 : -1));
    var result: HistoryEntry[] = [];
    for (let k in keys) {
      result.push(this.history[keys[k]]);
    }
    return result;
  }

  private inputHandler(val: number) {
    this.value = val;
    this.$emit("input", val);
  }
}

export default TrainingDaysColumn;
</script>