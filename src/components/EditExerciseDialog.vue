<template>
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
                  :value="exerciseEntry.metadata.description"
                  :items="[exerciseEntry.metadata.description]"
                  disabled
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row v-for="item in exerciseEntry.sets" :key="item.id">
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
        <v-btn
          color="primary"
          @click="saveClickHandler"
          :disabled="!isEditExerciseFormValid"
        >Save</v-btn>
        <v-btn @click="cancelClickHandler">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { ExerciseMetadata, ExerciseEntry } from '../declarations/weightlifting';
import Vue from "vue";
import Component from "vue-class-component";
import {Prop} from "vue-property-decorator";

@Component
class EditExerciseDialog extends Vue {
    @Prop({ required: true })
    private isEditExerciseDialogVisible!:boolean;    
    @Prop({ required: true })
    private exerciseEntry!: ExerciseEntry;
    private isEditExerciseFormValid: boolean = true;

    constructor() {
        super();
    }

    private saveClickHandler() {
      this.$emit('input', this.exerciseEntry);
    }

    private cancelClickHandler() {
      this.$emit('hide');
    }
}

export default EditExerciseDialog;
</script>