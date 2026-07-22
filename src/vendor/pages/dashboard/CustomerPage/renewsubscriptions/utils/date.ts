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