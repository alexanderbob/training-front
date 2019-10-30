<template>
  <v-list two-line>
    <v-list-item v-on:click="addNewExerciseClickHandler">
      <v-list-item-action>
        <v-icon>mdi-plus</v-icon>
      </v-list-item-action>
      <v-list-item-content>
        <v-list-item-title>Add new</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-subheader>Exercises for {{ historyEntry.title }}</v-subheader>
    <v-list-item
      v-for="(item, key) in exercises"
      :key="item.id"
      v-on:click="editExerciseClickHandler(key)"
    >
      <v-list-item-content>
        <v-list-item-title v-html="item.metadata.description"></v-list-item-title>
        <v-list-item-subtitle v-html="toSubtitle(item.sets)"></v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { ExerciseSetData, HistoryEntry } from "../declarations/weightlifting";
import { Dictionary } from "vue-router/types/router";

@Component
class ExercisesColumn extends Vue {
  @Prop()
  private historyEntry!: HistoryEntry;
  @Prop()
  private addNewExerciseClickHandler!: () => void;
  @Prop()
  private exercises!: Dictionary<HistoryEntry>;

  private editExerciseClickHandler(key: string) {
    this.$emit("input", key);
  }

  private toSubtitle(data: ExerciseSetData[]) {
    return data
      .map((v, i, arr) => {
        return v.weight + " &times; " + v.repetitions;
      })
      .join(", ");
  }
}

export default ExercisesColumn;
</script>
