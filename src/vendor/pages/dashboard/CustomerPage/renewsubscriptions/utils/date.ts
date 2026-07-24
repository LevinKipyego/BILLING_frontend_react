export function addDays(

    date: Date,

    days: number,

): Date {

    const result = new Date(date);

    result.setDate(

        result.getDate() + days,

    );

    return result;

}

export function formatDate(

    value: string | Date,

): string {

    return new Date(value)

        .toLocaleDateString();

}

export function daysBetween(

    start: Date,

    end: Date,

): number {

    return Math.ceil(

        (

            end.getTime() -

            start.getTime()

        ) /

        86400000,

    );

}





export function addMinutes(
    date: Date,
    minutes: number,
): Date {

    return new Date(
        date.getTime() +
        minutes * 60 * 1000,
    );

}

export function formatDuration(
    minutes: number,
): string {

    if (minutes < 60) {

        return `${minutes} Minute${minutes === 1 ? "" : "s"}`;

    }

    if (minutes < 1440) {

        const hours = minutes / 60;

        return `${hours} Hour${hours === 1 ? "" : "s"}`;

    }

    const days = minutes / 1440;

    if (days < 30) {

        return `${days} Day${days === 1 ? "" : "s"}`;

    }

    const months = days / 30;

    return `${months} Month${months === 1 ? "" : "s"}`;

}