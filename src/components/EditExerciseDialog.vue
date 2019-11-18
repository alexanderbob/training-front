<template>
  <v-dialog v-model="isEditExerciseDialogVisible" persistent :fullscreen="$vuetify.breakpoint.xsOnly">
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
                  :loading="isLoading"
                  disabled
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row align="center" v-for="item in exerciseEntry.sets" :key="item.id">
              <v-col cols="6">
                <v-text-field label="Weight" required v-model.number="item.weight" type="number" step="0.5" :disabled="isLoading"></v-text-field>
              </v-col>
              <v-col cols="5">
                <v-text-field label="Reps" required v-model.number="item.repetitions" type="number" step="0.5" :disabled="isLoading"></v-text-field>
              </v-col>
              <v-col cols="1">
                <v-btn text icon small color="red lighten-2" @click="removeItemHandler(item.id)" tabindex="-1" :disabled="isLoading">
                  <v-icon>mdi-table-row-remove</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="addNewClickHandler" :loading="isLoading" :disabled="isLoading">Add</v-btn>
        <v-btn color="primary" @click="saveClickHandler" :loading="isLoading" :disabled="!isEditExerciseFormValid && !isLoading">Save</v-btn>
        <v-btn color="secondary" @click="cancelClickHandler" :loading="isLoading" :disabled="isLoading">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { ExerciseMetadata, ExerciseEntry } from "../declarations/weightlifting";
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

@Component
class EditExerciseDialog extends Vue {
  @Prop({ required: true })
  private isEditExerciseDialogVisible!: boolean;
  @Prop({ required: true })
  private exerciseEntry!: ExerciseEntry;
  @Prop({ required: true })
  private isLoading!: boolean;
  private isEditExerciseFormValid: boolean = true;

  constructor() {
    super();
  }

  private addNewClickHandler() {
    this.$emit("input", this.exerciseEntry);
  }

  private saveClickHandler() {
    this.$emit("save", this.exerciseEntry);
  }

  private removeItemHandler(itemId: string) {
    this.$emit('remove', this.exerciseEntry, itemId);
  }

  private cancelClickHandler() {
    this.$emit("hide");
  }
}

export default EditExerciseDialog;
</script>