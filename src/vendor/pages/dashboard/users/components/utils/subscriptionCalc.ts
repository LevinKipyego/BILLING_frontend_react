export function subscriptionProgress(

    start: string,

    end: string,

) {

    const now = Date.now();

    const startTime = new Date(start).getTime();

    const endTime = new Date(end).getTime();

    const total = endTime - startTime;

    const remaining = endTime - now;

    return Math.max(

        0,

        (remaining / total) * 100

    );

}

export function remainingTime(

    end: string,

) {

    const diff =

        new Date(end).getTime() -

        Date.now();

    if (diff <= 0)

        return "Expired";

    const days = Math.floor(

        diff / 86400000

    );

    const hours = Math.floor(

        (diff % 86400000) /

        3600000

    );

    const minutes = Math.floor(

        (diff % 3600000) /

        60000

    );

    if (days > 0)

        return `${days}d ${hours}h`;

    if (hours > 0)

        return `${hours}h ${minutes}m`;

    return `${minutes} minutes`;

}