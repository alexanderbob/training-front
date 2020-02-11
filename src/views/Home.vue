<template>
  <v-container fluid class="fill-height">
    <v-row>
      <v-col sm="12" lg="4">
        <ChartTile
          exerciseCode="squats"
          exerciseName="Squats"
          :timeSeriesMetadata="squatsTonnageMeta"
        />
      </v-col>
      <v-col sm="12" lg="4">
        <ChartTile
          exerciseCode="benchpress_hor"
          exerciseName="Bench Press"
          :timeSeriesMetadata="benchpressTonnageMeta"
        />
      </v-col>
      <v-col sm="12" lg="4">
        <ChartTile
          exerciseCode="deadlift"
          exerciseName="Deadlift"
          :timeSeriesMetadata="deadliftTonnageMeta"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import ChartTile from "../components/ChartTile.vue";
import { TimeSeriesMetadata } from '../declarations/weightlifting';

@Component({
  components: {
    ChartTile
  }
})
class Home extends Vue {
  squatsTonnageMeta: TimeSeriesMetadata[];
  benchpressTonnageMeta: TimeSeriesMetadata[];
  deadliftTonnageMeta: TimeSeriesMetadata[];

  constructor() {
    super();
    this.squatsTonnageMeta = [
      {
        measureCode: "tonnage",
        measureName: "Squats",
        displayType: "line"
      },
      {
        measureCode: "repetitions.average",
        measureName: "Repetitions",
        displayType: "bar"
      }
    ];
    this.benchpressTonnageMeta = [
      {
        measureCode: "tonnage",
        measureName: "Bench Press",
        displayType: "line"
      },
      {
        measureCode: "repetitions.average",
        measureName: "Repetitions",
        displayType: "bar"
      }
    ];
    this.deadliftTonnageMeta = [
      {
        measureCode: "tonnage",
        measureName: "Deadlift",
        displayType: "line"
      },
      {
        measureCode: "repetitions.average",
        measureName: "Repetitions",
        displayType: "bar"
      }
    ];
  }

  private created() {}
}

export default Home;
</script>