interface Props {

    service: "HOTSPOT" | "PPPOE";

}

export default function ServiceBadge({

    service,

}: Props) {

    const hotspot =
        service === "HOTSPOT";

    return (

        <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                hotspot
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                    : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
            }`}
        >

            {hotspot
                ? "Hotspot"
                : "PPPoE"}

        </span>

    );

}