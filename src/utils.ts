import { ExerciseMetadata } from './declarations/weightlifting';

export default class Utils {
    private static readonly monthNames = [
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

    private static readonly shortMonthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ];

    public static readonly BackendUrl = "https://localhost:5002/api";

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

    public static readableDate(date: Date | string, shortened: boolean) {
        if (date instanceof Date) {
            if (shortened) {
                return `${date.getDate()} ${this.shortMonthNames[date.getMonth()]}`;
            }
            return `${date.getDate()} ${this.shortMonthNames[date.getMonth()]} ${date.getFullYear()}`;
        }
        //string is supposed to be in yyyy-MM-dd format
        const monthIndex = +date.substr(5, 2) - 1;
        if (shortened) {
            return `${date.substr(8, 2)} ${this.shortMonthNames[monthIndex]}`;
        }
        return `${date.substr(8, 2)} ${this.monthNames[monthIndex]} ${date.substr(0, 4)}`;
    }
}