<template>
  <v-container fluid class="fill-height">
    <v-progress-linear
        :active="isLoading"
        :indeterminate="isLoading"
        absolute
        top
        color="deep-purple accent-4"
      ></v-progress-linear>
    <!-- Create Training Day dialog -->
    <TrainingDayDialog
      :isDialogVisible="isTrainDayDialogVisible"
      v-on:input="createNewTrainingDayHandler"
      v-on:hide="toggleCreateNewDayDialog"
      v-on:view-change="trainingCalendarChangeHandler"
      :trainingDates="getTrainingDates"
      :isCalendarDisabled="isLoading"
    ></TrainingDayDialog>
    <!-- Edit Exercise dialog -->
    <EditExerciseDialog
      :isEditExerciseDialogVisible="isEditExerciseDialogVisible"
      :exerciseEntry="currentExercise"
      :isLoading="isLoading"
      v-on:input="addNewSetToExercise"
      v-on:save="applyExerciseChanges"
      v-on:remove="removeExerciseSet"
      v-on:hide="cancelEditExerciseChanges"
    ></EditExerciseDialog>
    <v-row align="stretch" justify="start">
      <v-col sm="4">
        <v-btn color="primary" disabled>
          <v-icon>mdi-calendar-search</v-icon>Search
        </v-btn>
      </v-col>
      <v-col></v-col>
    </v-row>
    <v-row align="stretch" justify="center">
      <TrainingDaysColumn
        :addNewButtonHandler="toggleCreateNewDayDialog"
        :history="history"
        :value="selectedTrainingDate"
        v-on:input="updateTrainDateItem"
      ></TrainingDaysColumn>

      <ExercisesColumn
        v-if="selectedTrainingDate != ''"
        :historyEntry="history[selectedTrainingDate]"
        :exercises="bufferedExercises"
        :exerciseNames="exerciseRegistry"
        v-on:input="editExerciseInput"
        v-on:create="addExerciseHandler"
      ></ExercisesColumn>
    </v-row>
  </v-container>
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
import ApiClient from "../api/client";

@Component({
  components: {
    TrainingDayDialog,
    TrainingDaysColumn,
    EditExerciseDialog,
    ExercisesColumn
  }
})
class Weightlifting extends Vue {
  private exerciseRegistry: ExerciseMetadata[] = [];
  private isTrainDayDialogVisible: boolean = false;
  private isEditExerciseDialogVisible: boolean = false;
  private selectedTrainingDate: string = "";
  private selectedExerciseCode: string = "";
  private apiClient: ApiClient;
  private history: Dictionary<HistoryEntry> = {};
  private exercises: Dictionary<Dictionary<ExerciseEntry>> = {};
  private isLoading: boolean = false;
  private bufferedExercises: Dictionary<ExerciseEntry> = {};
  constructor() {
    super();
    this.apiClient = new ApiClient(Utils.BackendUrl);
  }

  private get currentExercise(): ExerciseEntry {
    var code = this.selectedExerciseCode;
    if (code == "" || this.bufferedExercises === null) {
      return {
        id: "",
        metadata: {
          code: "",
          description: ""
        },
        sets: []
      };
    }
    return this.bufferedExercises[code];
  }

  private get availableExercises() {
    return this.exerciseRegistry.filter((v, i, arr) => {
      !Object.keys(this.exercises[this.selectedTrainingDate]).includes(v.code);
    });
  }

  private get getTrainingDates() {
    return Object.keys(this.history);
  }

  private updateTrainDateItem(key: string) {
    this.selectedTrainingDate = key;
    if (this.exercises[this.selectedTrainingDate]) {
      this.setBufferedExercise(this.exercises[this.selectedTrainingDate]);
      return;
    }

    this.isLoading = true;
    this.apiClient.getExercises(this.selectedTrainingDate).then(v => {
      this.isLoading = false;
      Object.keys(v).forEach(key => {
        v[key].id = Utils.generateUUID();
        v[key].sets.forEach(setEntry => {
          setEntry.id = Utils.generateUUID();
        });
      });
      this.exercises[this.selectedTrainingDate] = v;
      this.setBufferedExercise(this.exercises[this.selectedTrainingDate]);
    });
  }

  private addExerciseHandler(metadata: ExerciseMetadata) {
    if (metadata.code in this.bufferedExercises) {
      throw new Error(
        "Provided exercise '" + metadata.code + "' is already in collection!"
      );
    }
    this.isLoading = true;
    this.apiClient
      .setExercise(this.selectedTrainingDate, metadata.code, [])
      .then(v => {
        this.isLoading = false;
        let exercise: ExerciseEntry = {
          id: Utils.generateUUID(),
          metadata: metadata,
          sets: []
        };
        Vue.set<ExerciseEntry>(
          this.exercises[this.selectedTrainingDate],
          metadata.code,
          exercise
        );
        this.setBufferedExercise(this.exercises[this.selectedTrainingDate]);
      });
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

  private cancelEditExerciseChanges() {
    this.setBufferedExercise(this.exercises[this.selectedTrainingDate]);
    this.toggleEditExerciseDialog();
  }

  private applyExerciseChanges(exerciseEntry: ExerciseEntry) {
    this.isLoading = true;
    this.apiClient
      .setExercise(
        this.selectedTrainingDate,
        exerciseEntry.metadata.code,
        exerciseEntry.sets
      )
      .then(v => {
        this.isLoading = false;
        Vue.set<ExerciseEntry>(
          this.exercises[this.selectedTrainingDate],
          exerciseEntry.metadata.code,
          JSON.parse(JSON.stringify(exerciseEntry))
        );
        this.toggleEditExerciseDialog();
      });
  }

  private addNewSetToExercise(exerciseEntry: ExerciseEntry) {
    exerciseEntry.sets.push({
      id: Utils.generateUUID(),
      repetitions: 0,
      weight: 0
    });
  }

  private setBufferedExercise(source: Dictionary<ExerciseEntry>) {
    this.bufferedExercises = JSON.parse(JSON.stringify(source));
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

  //newMonth is in yyyy-MM format
  private trainingCalendarChangeHandler(newMonth: string) {
    let from = `${newMonth}-01`;
    let td = new Date(`${newMonth}-01`);
    td.setMonth(td.getMonth() + 1);
    let to = Utils.isoDate(td);
    this.isLoading = true;
    this.apiClient.getTrainingDays({from: from, to: to}).then(v => {
      this.isLoading = false;
      let result: Dictionary<HistoryEntry> = {};
      v.forEach(element => {
        if (!(element.date in this.history)) {
          Vue.set<HistoryEntry>(
            this.history, element.date, element
          );
        }
      });
    });
  }

  private createNewTrainingDayHandler(trainingDate: string) {
    var date = new Date(trainingDate);
    if (this.history[trainingDate]) {
      throw new Error(
        "Attempted to create duplicate training day for " + trainingDate
      );
    }
    let dateToAllocate: HistoryEntry = {
      date: Utils.isoDate(date),
      title: Utils.readableDate(date),
      subTitle: ""
    };
    this.isLoading = true;
    this.apiClient.allocateTrainingDate(dateToAllocate).then(v => {
      this.isLoading = false;
      Vue.set<HistoryEntry>(this.history, trainingDate, dateToAllocate);
    });
  }

  private created() {
    this.isLoading = true;
    let p1 = this.apiClient.getTrainingDays();
    let p2 = this.apiClient.availableExercises();
    Promise.all([p1, p2]).then(v => {
      this.isLoading = false;
      let result: Dictionary<HistoryEntry> = {};
      v[0].forEach(element => {
        result[element.date] = element;
      });
      this.history = result;

      this.exerciseRegistry = v[1];
    })
  }
}

export default Weightlifting;
</script>