<template>
    <v-dialog v-model="isDialogVisible" persistent>
      <v-card>
        <v-card-title class="headline">Please choose a date</v-card-title>
        <v-card-text>
          <DatePicker
            v-model="datePickerValue"
            :trainingDates="trainingDates"
            :isDisabled="isCalendarDisabled"
          ></DatePicker>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            @click="createButtonClickHandler"
            :disabled="isTrainingDayCreationDisabled"
          >Create</v-btn>
          <v-btn @click="cancelButtonClickHandler">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {Prop} from "vue-property-decorator";
import DatePicker from "./DatePicker.vue";

@Component({
    components: {
        DatePicker
    }
})
class TrainingDayDialog extends Vue {
    private datePickerValue: string = new Date().toISOString().substr(0, 10);
    @Prop({required: true})
    private isDialogVisible!: boolean;
    @Prop({ required: true })
    private trainingDates!: string[];
    @Prop({ required: true })
    private isCalendarDisabled!: boolean;
    
    constructor() {
        super();
    }

    private created() {
        let maxTrainDate: string = "";
        for (let key in this.trainingDates) {
            if (this.trainingDates[key] > maxTrainDate) {
                maxTrainDate = this.trainingDates[key];
            }
        }
        this.datePickerValue = maxTrainDate;
    }

    private get isTrainingDayCreationDisabled() {
        return this.trainingDates.includes(this.datePickerValue);
    }

    private createButtonClickHandler() {
        this.$emit('input', this.datePickerValue);
    }

    private cancelButtonClickHandler() {
        this.$emit('hide');
    }
}

export default TrainingDayDialog;

</script>