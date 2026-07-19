import type { RenewalMode } from "./types";

export const RENEWAL_MODES: {

    value: RenewalMode;

    title: string;

    description: string;

}[] = [

    {

        value: "EXTEND",

        title: "Extend Current",

        description:
            "Begins when current subscription expires.",

    },

    {

        value: "IMMEDIATE",

        title: "Start Immediately",

        description:
            "Activate immediately and replace current subscription.",

    },

    {

        value: "CUSTOM",

        title: "Custom Start",

        description:
            "Choose a future activation date.",

    },

];