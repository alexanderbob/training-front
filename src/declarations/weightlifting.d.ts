export interface EntryWithTitle {
    title: string;
}

export interface HistoryEntry extends EntryWithTitle {
    date: string;
    subTitle: string;
}

export interface ExerciseSetData {
    id: string;
    repetitions: number;
    weight: number;
}

export interface ExerciseEntry {
    id: string;
    metadata: ExerciseMetadata;
    sets: ExerciseSetData[];
}

export interface ExerciseMetadata {
    code: string;
    description: string;
}

export interface MinMaxAvgHistoricalItem {
    min: number;
    max: number;
    average: number;
}

export interface ExerciseHistoricalItem {
    date: string;
    tonnage: number;
    weight: MinMaxAvgHistoricalItem,
    repetitions: MinMaxAvgHistoricalItem
}

export interface TimeSeriesMetadata {
    measureCode: string;
    measureName: string;
    displayType: string;
}