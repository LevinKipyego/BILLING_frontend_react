import CurrentServicesSection from "../sections/CurrentServicesSection";
import SummarySection, {
    type WalletBalanceUpdatePayload,
    type CreditBalanceUpdatePayload,
} from "../sections/SummarySection";
import RecentPaymentsSection from "../sections/RecentPaymentsSection";
import DevicesSection from "../sections/DevicesSection";
import QuickActionsSection from "../sections/QuickActionsSection";

import type { UserProfile } from "../types/types";
import TimelineSection from "../sections/TimelineSection";

interface Props {
    profile: UserProfile;
    reload: () => Promise<void>;
    onUpdateWalletBalance?: (
        payload: WalletBalanceUpdatePayload,
    ) => Promise<void> | void;
    onUpdateCreditBalance?: (
        payload: CreditBalanceUpdatePayload,
    ) => Promise<void> | void;
}

export default function OverviewTab({
    profile,
    onUpdateWalletBalance,
    onUpdateCreditBalance,
}: Props) {
    return (
        <div className="space-y-4 sm:space-y-8">
            <CurrentServicesSection
                profile={profile}
            />

            <SummarySection
                profile={profile}
                onUpdateWalletBalance={onUpdateWalletBalance}
                onUpdateCreditBalance={onUpdateCreditBalance}
            />

            <div className="grid xl:grid-cols-2 gap-4 sm:gap-6">
                <RecentPaymentsSection
                    profile={profile}
                />

                <DevicesSection
                    profile={profile}
                />
            </div>

            <TimelineSection profile={profile} />

            <QuickActionsSection profile={profile} />
        </div>
    );
}