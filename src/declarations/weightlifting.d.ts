export interface EntryWithTitle {
    title: string;
}

export interface HistoryEntry extends EntryWithTitle {
    date: string;
    subtitle: string;
}

export interface ExerciseSetData {
    id: string;
    repetitions: number | number[];
    weight: number | number[];
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

