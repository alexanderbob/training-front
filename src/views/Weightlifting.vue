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
      v-on:input="applyExerciseChanges"
      v-on:hide="toggleEditExerciseDialog"
    ></EditExerciseDialog>
    <v-row align="stretch" justify="center">
      <v-col cols="4">
        <v-btn color="primary">
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
          :addNewExerciseClickHandler="addNewExerciseClick"
          v-on:input="editExerciseInput"
        ></ExercisesColumn>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { HistoryEntry, ExerciseEntry, ExerciseMetadata, ExerciseSetData } from '../declarations/weightlifting';
import Vue from "vue";
import Component from "vue-class-component";
import TrainingDayDialog from "../components/TrainingDayDialog.vue";
import EditExerciseDialog from "../components/EditExerciseDialog.vue";
import TrainingDaysColumn from "../components/TrainingDaysColumn.vue";
import ExercisesColumn from "../components/ExercisesColumn.vue";
import { Dictionary } from "vue-router/types/router";
import { Prop } from "vue-property-decorator";

@Component({
  components: {
    TrainingDayDialog, TrainingDaysColumn, EditExerciseDialog, ExercisesColumn
  }
})
class Weightlifting extends Vue {
  private isTrainDayDialogVisible: boolean = false;
  private selectedTrainingDate: string = "";
  private selectedExerciseCode: string = "";
  private history: Dictionary<HistoryEntry> = {};
  private exercises: Dictionary<Dictionary<ExerciseEntry>> = {};
  private isDataLoaded: boolean = false;
  private exerciseNames: ExerciseMetadata[] = [];
  private isEditExerciseDialogVisible: boolean = false;
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

  private get getTrainingDates() {
    return Object.keys(this.history);
  }

  private get orderedHistory() {
    let keys = Object.keys(this.history).sort((a, b) => b > a ? 1 : -1);
    var result: HistoryEntry[] = [];
    for (let k in keys) {
      result.push(this.history[keys[k]]);
    }
    return result;
  }

  private updateTrainDateItem(key: string) {
    this.selectedTrainingDate = key;
  }

  private test(data: any) {
    var hui = data;
  }

  private addNewExerciseClick() {
    //TODO: show exercise creation dialog
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

  private applyExerciseChanges() {
    //TODO: apply changes here
    this.toggleEditExerciseDialog();
  }

  private createNewTrainingDayHandler(trainingDate: string) {
    var date = new Date(trainingDate);
    if (this.history[trainingDate]) {
      throw new Error(
        "Attempted to create duplicate training day for " +
          trainingDate
      );
    }
    Vue.set(this.history, trainingDate, {
      date: this.isoDate(date),
      title: this.readableDate(date),
      subtitle: ""
    });
    Vue.set(this.exercises, trainingDate, {});
  }

  private created() {
    this.isDataLoaded = true;
    this.exerciseNames = [
      { code: "squats", description: "Squats" },
      { code: "deadlift", description: "Dead Lift" },
      { code: "benchpress", description: "Bench Press" },
      { code: "legpress", description: "Leg Press" },
      { code: "longpull", description: "Long Bull" },
      { code: "frenchpress", description: "French Press" },
      { code: "bicepsbench", description: "Biceps Bench" },
      { code: "bicepsdumbbell", description: "Biceps Dumbbell" },
      { code: "tricepsbarbell", description: "Triceps Barbell" },
      { code: "tricepspull", description: "Triceps Pull" }
    ];
    for (let i = 0; i < 15; i++) {
      let date = new Date();
      date.setDate(date.getDate() - i);
      var fancyDate = this.readableDate(date);
      var isoDate = this.isoDate(date);
      Vue.set<HistoryEntry>(this.history, isoDate, {
        date: isoDate,
        title: fancyDate,
        subtitle:
          "Exercise on " + fancyDate + " " + this.exerciseNames.map((v) => v.description).join(", ")
      });
      Vue.set<Dictionary<ExerciseEntry>>(this.exercises, isoDate, {});
      this.exerciseNames.forEach(element => {
        let setsData: ExerciseSetData[] = [];
        let sets = Math.round(1 + 5 * Math.random());
        for (let j = 0; j < sets; j++) {
          setsData.push({
            repetitions: Math.round(1 + 20 * Math.random()),
            weight: Math.round(1 + 100 * Math.random()),
            id: this.generateUUID()
          });
        }
        Vue.set<ExerciseEntry>(this.exercises[isoDate], element.code, {
          metadata: element,
          sets: setsData,
          id: this.generateUUID()
        });
      });
    }
  }

  private generateUUID(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  private isoDate(date: Date) {
    return (
      date.getDate() +
      " " +
      date.getMonth() +
      " " +
      date.getFullYear()
    );
  }

  private readableDate(date: Date) {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    return (
      date.getDate() +
      " " +
      monthNames[date.getMonth()] +
      " " +
      date.getFullYear()
    );
  }
}

export default Weightlifting;
</script>