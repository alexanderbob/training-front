<template>
  <div>
    <!-- Create Training Day dialog -->
    <TrainingDayDialog
      :isDialogVisible="isTrainDayDialogVisible"
      v-on:input="createNewTrainingDayHandler"
      v-on:hide="toggleCreateNewDayDialog"
      :trainingDates="getTrainingDates"
      :isCalendarDisabled="!isDataLoaded"
    ></TrainingDayDialog>
    <!-- Edit Exercise dialog -->
    <EditExerciseDialog
      :isEditExerciseDialogVisible="isEditExerciseDialogVisible"
      :exerciseEntry="currentExercise"
      v-on:input="addNewSetToExercise"
      v-on:save="applyExerciseChanges"
      v-on:remove="removeExerciseSet"
      v-on:hide="toggleEditExerciseDialog"
    ></EditExerciseDialog>
    <v-row align="stretch" justify="center">
      <v-col cols="4">
        <v-btn color="primary" disabled>
          <v-icon>mdi-calendar-search</v-icon>Search
        </v-btn>
      </v-col>
      <v-col></v-col>
    </v-row>
    <v-row align="stretch" justify="center">
      <v-col cols="4">
        <TrainingDaysColumn
          :addNewButtonHandler="toggleCreateNewDayDialog"
          :history="history"
          :value="selectedTrainingDate"
          v-on:input="updateTrainDateItem"
        ></TrainingDaysColumn>
      </v-col>
      <v-col>
        <ExercisesColumn
          v-if="selectedTrainingDate !== ''"
          :historyEntry="history[selectedTrainingDate]"
          :exercises="exercises[selectedTrainingDate]"
          v-on:input="editExerciseInput"
          v-on:create="addExerciseHandler"
        ></ExercisesColumn>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import {
  HistoryEntry,
  ExerciseEntry,
  ExerciseMetadata,
  ExerciseSetData
} from "../declarations/weightlifting";
import Vue from "vue";
import Component from "vue-class-component";
import TrainingDayDialog from "../components/TrainingDayDialog.vue";
import EditExerciseDialog from "../components/EditExerciseDialog.vue";
import TrainingDaysColumn from "../components/TrainingDaysColumn.vue";
import ExercisesColumn from "../components/ExercisesColumn.vue";
import { Dictionary } from "vue-router/types/router";
import { Prop } from "vue-property-decorator";
import Utils from "../utils";

@Component({
  components: {
    TrainingDayDialog,
    TrainingDaysColumn,
    EditExerciseDialog,
    ExercisesColumn
  }
})
class Weightlifting extends Vue {
  private isTrainDayDialogVisible: boolean = false;
  private isEditExerciseDialogVisible: boolean = false;
  private selectedTrainingDate: string = "";
  private selectedExerciseCode: string = "";
  private history: Dictionary<HistoryEntry> = {};
  private exercises: Dictionary<Dictionary<ExerciseEntry>> = {};
  private isDataLoaded: boolean = false;
  constructor() {
    super();
  }

  private get currentExercise(): ExerciseEntry {
    var code = this.selectedExerciseCode;
    if (this.selectedTrainingDate === "" || code == "") {
      return {
        id: "",
        metadata: {
          code: "",
          description: ""
        },
        sets: []
      };
    }
    return this.exercises[this.selectedTrainingDate][code];
  }

  private get availableExercises() {
    return Utils.exerciseNames.filter((v, i, arr) => {
      !Object.keys(this.exercises[this.selectedTrainingDate]).includes(v.code);
    });
  }

  private get getTrainingDates() {
    return Object.keys(this.history);
  }

  private updateTrainDateItem(key: string) {
    this.selectedTrainingDate = key;
  }

  private test(data: any) {
    var hui = data;
  }

  private addExerciseHandler(metadata: ExerciseMetadata) {
    if (metadata.code in this.exercises[this.selectedTrainingDate]) {
      throw new Error(
        "Provided exercise '" + metadata.code + "' is already in collection!"
      );
    }
    Vue.set<ExerciseEntry>(
      this.exercises[this.selectedTrainingDate],
      metadata.code,
      {
        id: Utils.generateUUID(),
        metadata: metadata,
        sets: []
      }
    );
    //TODO: send API request to create new entry
  }

  private editExerciseInput(exerciseCode: string) {
    this.selectedExerciseCode = exerciseCode;
    this.toggleEditExerciseDialog();
  }

  private toggleCreateNewDayDialog() {
    this.isTrainDayDialogVisible = !this.isTrainDayDialogVisible;
  }

  private toggleEditExerciseDialog() {
    this.isEditExerciseDialogVisible = !this.isEditExerciseDialogVisible;
  }

  private addNewSetToExercise(exerciseEntry: ExerciseEntry) {
    exerciseEntry.sets.push({
      id: Utils.generateUUID(),
      repetitions: 0,
      weight: 0
    });
  }

  private removeExerciseSet(exerciseEntry: ExerciseEntry, itemId: string) {
    let removeIndex = exerciseEntry.sets.findIndex(x => {
      return x.id === itemId;
    });
    if (removeIndex === -1) {
      throw new Error("Could not find exercise for removal!");
    }
    exerciseEntry.sets.splice(removeIndex, 1);
  }

  private applyExerciseChanges(exerciseEntry: ExerciseEntry) {
    //TODO: apply changes here
    this.toggleEditExerciseDialog();
  }

  private createNewTrainingDayHandler(trainingDate: string) {
    var date = new Date(trainingDate);
    if (this.history[trainingDate]) {
      throw new Error(
        "Attempted to create duplicate training day for " + trainingDate
      );
    }
    Vue.set<HistoryEntry>(this.history, trainingDate, {
      date: Utils.isoDate(date),
      title: Utils.readableDate(date),
      subtitle: ""
    });
    Vue.set<Dictionary<ExerciseEntry>>(this.exercises, trainingDate, {});
  }

  private created() {
    this.isDataLoaded = true;
    for (let i = 0; i < 15; i++) {
      let date = new Date();
      date.setDate(date.getDate() - i);
      var fancyDate = Utils.readableDate(date);
      var isoDate = Utils.isoDate(date);
      Vue.set<HistoryEntry>(this.history, isoDate, {
        date: isoDate,
        title: fancyDate,
        subtitle:
          "Exercise on " +
          fancyDate +
          " " +
          Utils.exerciseNames.map(v => v.description).join(", ")
      });
      Vue.set<Dictionary<ExerciseEntry>>(this.exercises, isoDate, {});

      let shuffledKeys = this.shuffle(
        Array.from(Array(Utils.exerciseNames.length).keys())
      );

      for (let k = 0; k < shuffledKeys.length - 3; k++) {
        let setsData: ExerciseSetData[] = [];
        let sets = Math.round(1 + 5 * Math.random());
        for (let j = 0; j < sets; j++) {
          setsData.push({
            repetitions: Math.round(1 + 20 * Math.random()),
            weight: Math.round(1 + 100 * Math.random()),
            id: Utils.generateUUID()
          });
        }
        Vue.set<ExerciseEntry>(
          this.exercises[isoDate],
          Utils.exerciseNames[k].code,
          {
            metadata: Utils.exerciseNames[k],
            sets: setsData,
            id: Utils.generateUUID()
          }
        );
      }
    }
  }

  private shuffle(array: number[]) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }
}

export default Weightlifting;
</script>