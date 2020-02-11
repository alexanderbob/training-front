import { HistoryEntry, ExerciseEntry, ExerciseMetadata, ExerciseSetData, ExerciseHistoricalItem } from '@/declarations/weightlifting';
import { Dictionary } from 'vue-router/types/router';

export default class ApiClient {
    private backendUrl: string;
    constructor(backendUrl: string) {
        this.backendUrl = backendUrl;
    }

    private async sendRequest(input: RequestInfo, init?: RequestInit): Promise<Response> {
        if (!init) {
            init = {};
        }
        init.credentials = "include";
        init.mode = "cors";
     
        let response = await fetch(input, init);
        if (response.status === 401) {
            let location = response.headers.get("location")
            if (!location) {
                throw new Error("Expected location in headers for Unauthorized responses");
            }
            window.location.href = location;
        }
        return response;
    }

    public async getTrainingDays(dateRange?: {from: string, to: string}): Promise<HistoryEntry[]> {
        if (dateRange === undefined) {
            let response = await this.sendRequest(`${this.backendUrl}/training`);
            return response.json();
        }
        else {
            let response = await this.sendRequest(`${this.backendUrl}/training/range/from/${dateRange.from}/to/${dateRange.to}`);
            return response.json();
        }
    }

    public async allocateTrainingDate(entry: HistoryEntry): Promise<void> {
        let response = await this.sendRequest(`${this.backendUrl}/training`, {
            method: "post",
            body: JSON.stringify(entry),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        });
        if (response.status !== 200) {
            throw new Error(
                `Got non-OK response from allocateTrainingDate ${response.statusText}.
                 Sent { title: ${entry.title}, date: ${entry.date}, subtitle: ${entry.subTitle} }`
            );
        }
    }

    public async getHistory(exerciseCode: string): Promise<ExerciseHistoricalItem[]> {
        let response = await this.sendRequest(`${this.backendUrl}/exercises/history/${exerciseCode}`);
        return response.json();
    }

    public async getExercises(isoDate: string): Promise<Dictionary<ExerciseEntry>> {
        let response = await this.sendRequest(`${this.backendUrl}/exercises/${isoDate}`);
        if (response.status === 400) {
            throw new Error(`Bad request format! Expected date in 'yyyy-MM-dd' format, sent ${isoDate}.`);
        }
        else if (response.status === 404) {
            throw new Error(`Training date ${isoDate} is not registered`);
        }
        return response.json();
    }

    public async availableExercises(): Promise<ExerciseMetadata[]> {
        let response = await this.sendRequest(`${this.backendUrl}/exercises/list`);
        return response.json();
    }

    public async setExercise(isoDate: string, exerciseCode: string, setsData: ExerciseSetData[]): Promise<void> {
        let url = `${this.backendUrl}/exercises/${isoDate}/${exerciseCode}`;
        let response = await this.sendRequest(url, {
            method: "post",
            body: JSON.stringify(setsData),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        if (response.status !== 200) {
            throw new Error(
                `Got non-OK response from setExercise ${response.statusText}.
                 Sent ${setsData.map(x => `${x.weight} x ${x.repetitions}`).join(',')} to ${url}`);
        }
    }
}