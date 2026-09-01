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
    value: string | Date | null | undefined,
): string {
    if (!value) return "—";

    // Handle UTC ISO strings without explicit timezone offsets (e.g. "2026-07-24T12:00:00")
    // by appending "Z" so JS parses it as UTC rather than local time.
    let dateInput = value;
    if (typeof value === "string" && !value.endsWith("Z") && !value.includes("+")) {
        dateInput = `${value}Z`;
    }

    const date = new Date(dateInput);

    if (isNaN(date.getTime())) {
        return "Invalid Date";
    }

    const now = new Date();

    // Reset hours to compare local calendar dates
    const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const diffInDays = Math.round(
        (targetDate.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const timeString = date.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });

    if (diffInDays === 0) {
        return `Today at ${timeString}`;
    }

    if (diffInDays === 1) {
        return `Tomorrow at ${timeString}`;
    }

    if (diffInDays === -1) {
        return `Yesterday at ${timeString}`;
    }

    const dateString = date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    return `${dateString} at ${timeString}`;
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

export function formatDuration(minutes: number): string {
    if (!minutes || minutes <= 0) {
        return "0 Minutes";
    }

    const days = Math.floor(minutes / 1440);
    const hours = Math.floor((minutes % 1440) / 60);
    const mins = minutes % 60;

    const parts: string[] = [];

    if (days > 0) {
        parts.push(`${days} Day${days === 1 ? "" : "s"}`);
    }

    if (hours > 0) {
        parts.push(`${hours} Hour${hours === 1 ? "" : "s"}`);
    }

    if (mins > 0) {
        parts.push(`${mins} Minute${mins === 1 ? "" : "s"}`);
    }

    return parts.join(" ");
}