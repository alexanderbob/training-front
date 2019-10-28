<template>
  <div>
    <!-- Create Training Day dialog -->
    <v-dialog v-model="isTrainDayDialogVisible" persistent>
      <v-card>
        <v-card-title class="headline">Please choose a date</v-card-title>
        <v-card-text>
          <DatePicker
            v-model="newTrainingDayPicker"
            :trainingDates="getTrainingDates"
            :isDisabled="!isDataLoaded"
          ></DatePicker>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            @click="createNewTrainingDayHandler"
            :disabled="isTrainingDayCreationDisabled"
          >Create</v-btn>
          <v-btn @click="isTrainDayDialogVisible = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Edit Exercise dialog -->
    <v-dialog v-model="isEditExerciseDialogVisible" persistent>
      <v-card>
        <v-card-title class="headline">Edit Exercise</v-card-title>
        <v-card-text>
          <v-form v-model="isEditExerciseFormValid">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-autocomplete 
                    label="Exercise Name" 
                    :items="exerciseNames.map((v) => v.description)" 
                    :value="exerciseNames[selectedExerciseCode]" 
                    required
                  ></v-autocomplete>
                </v-col>
              </v-row>
              <v-row v-for="item in setsForPickedExercise" :key="item.id">
                <v-col cols="6">
                  <v-text-field label="Weight" required v-model="item.weight"></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field label="Reps" required v-model="item.repetitions"></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="applyExerciseChanges" :disabled="!isEditExerciseFormValid">Save</v-btn>
          <v-btn @click="isEditExerciseDialogVisible = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
        <v-list>
          <v-list-item v-on:click.stop="showCreateNewDayDialog">
            <v-list-item-action>
              <v-icon>mdi-plus</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Add new</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-list two-line>
          <v-subheader>HISTORY</v-subheader>
          <v-list-item-group v-model="selectedTrainDateItem" color="primary">
            <v-list-item v-for="(item) in history" :key="item.date">
              <v-list-item-content>
                <v-list-item-title v-html="item.title"></v-list-item-title>
                <v-list-item-subtitle v-html="item.subtitle"></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-col>
      <v-col>
        <v-list two-line>
          <v-list-item v-on:click="addNewExerciseClick">
            <v-list-item-action>
              <v-icon>mdi-plus</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Add new</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-subheader>Exercises for {{ orderedHistory[selectedTrainDateItem].title }}</v-subheader>
          <v-list-item
            v-for="(item, key) in exercises[orderedHistory[selectedTrainDateItem].date]"
            :key="item.id"
            v-on:click="editExerciseClick(key)"
          >
            <v-list-item-content>
              <v-list-item-title v-html="item.title"></v-list-item-title>
              <v-list-item-subtitle v-html="toSubtitle(item.sets)"></v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import DatePicker from "../components/DatePicker.vue";
import { Dictionary } from "vue-router/types/router";
import { Prop } from "vue-property-decorator";

interface EntryWithTitle {
  title: string;
}

interface HistoryEntry extends EntryWithTitle {
  date: string;
  subtitle: string;
}

interface ExerciseSetData {
  id: string;
  repetitions: number | number[];
  weight: number | number[];
}

interface ExerciseEntry extends EntryWithTitle {
  id: string;
  sets: ExerciseSetData[];
}

interface ExerciseMetadata {
  code: string;
  description: string;
}

@Component({
  components: {
    DatePicker
  }
})
class Weightlifting extends Vue {
  private newTrainingDayPicker: string;
  private isTrainDayDialogVisible: boolean;
  private selectedTrainDateItem: number;
  private selectedExerciseCode: string;
  private history: Dictionary<HistoryEntry>;
  private exercises: Dictionary<Dictionary<ExerciseEntry>>;
  private isDataLoaded: boolean;
  private exerciseNames: ExerciseMetadata[];
  private isEditExerciseFormValid: boolean;
  private isEditExerciseDialogVisible: boolean;
  constructor() {
    super();
    this.newTrainingDayPicker = new Date().toISOString().substr(0, 10);
    this.selectedTrainDateItem = 0;
    this.selectedExerciseCode = "";
    this.history = {};
    this.exercises = {};
    this.exerciseNames = [];
    this.isTrainDayDialogVisible = false;
    this.isDataLoaded = false;
    this.isEditExerciseFormValid = false;
    this.isEditExerciseDialogVisible = false;
  }

  private get setsForPickedExercise() {
    var code = this.selectedExerciseCode;
    return this.exercises[this.orderedHistory[this.selectedTrainDateItem].date][code];
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

  private toSubtitle(data: ExerciseSetData[]) {
    return data
      .map((v, i, arr) => {
        return v.weight + " &times; " + v.repetitions;
      })
      .join(", ");
  }

  private test(data: any) {
    var hui = data;
  }

  private addNewExerciseClick() {
    //TODO: show exercise creation dialog
  }

  private editExerciseClick(exerciseCode: string) {
    this.selectedExerciseCode = exerciseCode;
    this.isEditExerciseDialogVisible = true;
  }

  private showCreateNewDayDialog() {
    this.isTrainDayDialogVisible = true;
  }

  private isTrainingDayCreationDisabled() {
    return this.newTrainingDayPicker in this.history;
  }

  private applyExerciseChanges() {
    
  }

  private createNewTrainingDayHandler() {
    var date = new Date(this.newTrainingDayPicker);
    if (this.history[this.newTrainingDayPicker]) {
      throw new Error(
        "Attempted to create duplicate training day for " +
          this.newTrainingDayPicker
      );
    }
    this.history[this.newTrainingDayPicker] = {
      date: this.isoDate(date),
      title: this.readableDate(date),
      subtitle: ""
    };
    this.exercises[this.newTrainingDayPicker] = {};
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
      this.history[isoDate] = {
        date: isoDate,
        title: fancyDate,
        subtitle:
          "Exercise on " + fancyDate + " " + this.exerciseNames.map((v) => v.description).join(", ")
      };
      this.exercises[isoDate] = {};
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
        this.exercises[isoDate][element.code] = {
          title: element.description,
          sets: setsData,
          id: this.generateUUID()
        };
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
    return date.toISOString().substr(0, 10);
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