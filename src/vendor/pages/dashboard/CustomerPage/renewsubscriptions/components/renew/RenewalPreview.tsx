import {
    Calendar,
    CalendarDays,
    Clock3,
    Coins,
} from "lucide-react";

import Card from "../common/Card";
import InfoRow from "../common/InfoRow";

import { formatDate } from "../../utils/date";

import type {
    RenewalPreview as RenewalPreviewData,
} from "../../types/subscription";

interface RenewalPreviewProps {

    preview: RenewalPreviewData;

}

export default function RenewalPreview({

    preview,

}: RenewalPreviewProps) {

    return (

        <Card
            title="Renewal Preview"
            subtitle="Review how the subscription will change."
        >

            <div className="space-y-4">

                <InfoRow

                    icon={Coins}

                    label="Amount"

                    value={`KES ${preview.amount.toLocaleString()}`}

                />

                <InfoRow

                    icon={Clock3}

                    label="Duration"

                    value={`${preview.duration_minutes} minutes`}

                />

                <InfoRow

                    icon={Calendar}

                    label="Starts"

                    value={formatDate(preview.start_at)}

                />

                <InfoRow

                    icon={CalendarDays}

                    label="Expires"

                    value={formatDate(preview.end_at)}

                />

            </div>

        </Card>

    );

}