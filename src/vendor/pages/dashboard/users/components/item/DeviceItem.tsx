import {
    Smartphone,
    Laptop,
    Router,
    Tablet,
    Circle,
} from "lucide-react";

import type { Device } from "../types/types";

interface Props {
    device: Device;
}

export default function DeviceItem({
    device,
}: Props) {

    const Icon =
        device.type === "phone"
            ? Smartphone
            : device.type === "computer"
            ? Laptop
            : device.type === "tablet"
            ? Tablet
            : Router;

    return (

        <div className="flex items-center justify-between py-4 border-b border-slate-200 dark:border-slate-700 last:border-0">

            <div className="flex gap-3">

                <div className="rounded-xl bg-slate-100 dark:bg-slate-800 p-2">

                    <Icon size={18} />

                </div>

                <div>

                    <h4 className="font-semibold">

                        {device.name}

                    </h4>

                    <p className="text-sm text-slate-500">

                        {device.source}

                    </p>

                    {device.mac_address && (

                        <p className="text-xs text-slate-400">

                            {device.mac_address}

                        </p>

                    )}

                </div>

            </div>

            <div className="flex items-center gap-2">

                <Circle
                    size={10}
                    fill={
                        device.status === "active"
                            ? "#22c55e"
                            : "#94a3b8"
                    }
                />

                <span className="text-sm capitalize">

                    {device.status}

                </span>

            </div>

        </div>

    );

}