import { ExerciseMetadata } from './declarations/weightlifting';

export default class Utils {
    public static readonly exerciseNames: ExerciseMetadata[] = 
    [
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

    public static generateUUID(): string {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            var r = (Math.random() * 16) | 0,
                v = c == "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }

    public static isoDate(date: Date) {
        let month = date.getMonth() + 1,
            dayOfMonth = date.getDate();
        return date.getFullYear() +
            "-" +
            (month < 10 ? "0" : "") + month +
            "-" +
            (dayOfMonth < 10 ? "0" : "") + dayOfMonth;
    }

    public static readableDate(date: Date) {
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