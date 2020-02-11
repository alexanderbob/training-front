<template>
  <canvas v-if="isLoaded" ref="canvas" width="400" height="200"></canvas>
</template>

<script lang="ts">
import { Component, Prop, Watch } from "vue-property-decorator";
import ChartJs from "chart.js";
import Vue from "vue";
import ApiClient from "../api/client";
import Utils from "../utils";
import {
  ExerciseHistoricalItem,
  TimeSeriesMetadata,
  MinMaxAvgHistoricalItem
} from "../declarations/weightlifting";
import { VuetifyParsedThemeItem } from "vuetify/types/services/theme";
import colors from "vuetify/lib/util/colors";
import vuetify from "../plugins/vuetify";

@Component
class Chart extends Vue {
  @Prop()
  exerciseCode!: string;
  @Prop()
  exerciseName!: string;
  @Prop()
  timeSeriesMetadata!: TimeSeriesMetadata[];
  isLoaded: boolean = false;

  client: ApiClient;
  options: ChartJs.ChartConfiguration;

  chart!: ChartJs;
  themeItem = this.$vuetify.theme.currentTheme
    .primary as VuetifyParsedThemeItem;
  constructor() {
    super();
    if (this.timeSeriesMetadata.length > 2) {
      throw new Error("Up to 2 series are supported only");
    }
    this.client = new ApiClient(Utils.BackendUrl);
    this.options = {
      type: this.timeSeriesMetadata[0].displayType,
      options: {
        responsive: true,
        tooltips: {
          mode: "index",
          intersect: false
        },
        hover: {
          mode: "nearest",
          intersect: true
        },
        aspectRatio: 2,
        maintainAspectRatio: true,
        legend: {
          labels: {
            fontColor: colors.grey.base
          },
          position: "bottom"
        },
        scales: {
          yAxes: [{
							type: 'linear',
							display: true,
							position: 'left',
							id: 'y-axis-0',
						}, {
							type: 'linear',
							display: true,
							position: 'right',
              id: 'y-axis-1',
              gridLines: {
								drawOnChartArea: false
							},
						}]
        }
      }
    };
  }

  private mounted() {
    this.doGetHistory(this.exerciseCode);
  }

  @Watch("exerciseCode")
  private watch(value: string, oldValue: string) {
    if (value === oldValue) {
      return;
    }
    this.doGetHistory(value);
  }

  private doGetHistory(exerciseCode: string) {
    this.isLoaded = false;
    this.client.getHistory(this.exerciseCode).then(v => {
      this.isLoaded = true;
      this.$nextTick(function() {
        this.initializeChartJs(v);
      });
      this.$set(this.options, "options.title.text", this.exerciseName);
      this.$emit("loaded");
    });
  }

  private initializeChartJs(v: ExerciseHistoricalItem[]) {
    if (this.chart === undefined) {
      let canvasElement = this.$refs["canvas"] as HTMLCanvasElement;
      this.chart = new ChartJs(canvasElement, this.options);
    }
    this.chart.data.labels = v.map(x => {
      return Utils.readableDate(x.date, true);
    });
    let dataSets: ChartJs.ChartDataSets[] = [];
    this.timeSeriesMetadata.forEach((metadata, idx) => {
      const color = idx == 0 ? colors.grey.lighten1 : colors.blueGrey.darken3;
      const borderColor = idx == 0 ? colors.grey.lighten1 : colors.blueGrey.darken3;
      const backgroundColor = idx == 0 ? undefined : colors.blueGrey.darken3;
      dataSets.push({
        label: metadata.measureName,
        data: this.extractData(metadata, v),
        borderColor: color,
        pointBorderColor: borderColor,
        backgroundColor: backgroundColor,
        yAxisID: `y-axis-${idx}`,
        type: metadata.displayType
      });
    });
    this.chart.data.datasets = dataSets;
    this.chart.update();
  }

  private extractData(
    metadata: TimeSeriesMetadata,
    data: ExerciseHistoricalItem[]
  ) {
    let dotIndex = metadata.measureCode.indexOf(".");
    let subMeasure = metadata.measureCode.substr(dotIndex + 1);
    switch (metadata.measureCode) {
      case "tonnage":
        return data.map(v => {
          return Math.round(v.tonnage * 100) / 100;
        });
      default:
        if (dotIndex == -1) {
          throw new Error(
            `Provided measure code ${metadata.measureCode} is not supported`
          );
        }
        switch (metadata.measureCode.substr(0, dotIndex)) {
          case "weight":
              switch (subMeasure) {
                  case "min": return data.map(v => { return Math.round(v.weight.min * 100) / 100 });
                  case "max": return data.map(v => { return Math.round(v.weight.max * 100) / 100 });
                  case "average": return data.map(v => { return Math.round(v.weight.average * 100) / 100 });
              }
            break;
          case "repetitions":
              switch (subMeasure) {
                  case "min": return data.map(v => { return Math.round(v.repetitions.min * 100) / 100 });
                  case "max": return data.map(v => { return Math.round(v.repetitions.max * 100) / 100 });
                  case "average": return data.map(v => { return Math.round(v.repetitions.average * 100) / 100 });
              }
            break;
          default:
            throw new Error(`Provided measure code ${metadata.measureCode} is not supported`);
        }
        break;
    }
  }
}

export default Chart;
</script>