<template>
    <v-card 
        class="pa-2" 
        outlined 
        tile
        max-width="800"
        max-height="400"
    >
        <v-card-title>{{ exerciseName }}</v-card-title>
        <v-progress-circular v-if="loading"
            indeterminate
            color="primary"
        ></v-progress-circular>
        <Chart
            :exerciseCode="exerciseCode"
            :exerciseName="exerciseName"
            :timeSeriesMetadata="timeSeriesMetadata"
            v-on:loaded="chartLoadedHandler"
        />
    </v-card>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from 'vue';
import Chart from './Chart.vue';
import { TimeSeriesMetadata } from '../declarations/weightlifting';


@Component({
    components: {
        Chart
    }
})
class ChartTile extends Vue {
    @Prop()
    exerciseCode!: string;
    @Prop()
    exerciseName!: string;
    @Prop()
    timeSeriesMetadata!: TimeSeriesMetadata[];
    loading: boolean = true;

    constructor() {
        super();
    }

    private chartLoadedHandler() {
        this.loading = false;
    }
}

export default ChartTile;

</script>