<template>
  <v-col sm="8">
      <v-list two-line :max-width="maxWidth">
        <v-list-item>
          <v-list-item-content>
            <v-autocomplete
              label="New Exercise Name"
              v-model="newExercise"
              :items="availableExerciseItems"
            ></v-autocomplete>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-on:click="addNewExerciseClickHandler" :disabled="isAddNewDisabled">
          <v-list-item-action>
            <v-icon>mdi-plus</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Add new</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-list :max-width="maxWidth">
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
  </v-col>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import {
  ExerciseSetData,
  HistoryEntry,
  ExerciseMetadata,
  ExerciseEntry
} from "../declarations/weightlifting";
import { Dictionary } from "vue-router/types/router";
import Utils from "../utils";

@Component
class ExercisesColumn extends Vue {
  @Prop()
  private historyEntry!: HistoryEntry;
  @Prop()
  private exercises!: Dictionary<ExerciseEntry>;
  @Prop()
  private exerciseNames!: ExerciseMetadata[];
  @Prop()
  private maxWidth!: () => string;
  private newExercise: ExerciseMetadata | null = null;

  private get availableExerciseItems() {
    let result: {
      text: string;
      value: ExerciseMetadata;
    }[] = [];
    let usedKeys = Object.keys(this.exercises);
    this.exerciseNames.forEach(element => {
      if (!usedKeys.includes(element.code)) {
        result.push({
          text: element.description,
          value: element
        });
      }
    });
    return result;
  }

  private get isAddNewDisabled() {
    return (
      Object.keys(this.exercises).length === this.exerciseNames.length ||
      this.newExercise === null
    );
  }

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

  private addNewExerciseClickHandler() {
    if (this.newExercise != null) {
      this.$emit("create", this.newExercise);
      this.newExercise = null;
    }
  }
}

export default ExercisesColumn;
</script>
