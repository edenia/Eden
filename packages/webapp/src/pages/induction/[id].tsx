import { useRouter } from "next/router";

import {
    CallToAction,
    Card,
    RawLayout,
    SingleColLayout,
    useIsCommunityActive,
    useUALAccount,
} from "_app";
import {
    getInductionStatus,
    InductionJourneyContainer,
    InductionStatus,
    useGetInductionWithEndorsements,
} from "inductions";
import { ROUTES } from "_app/config";

export const InductionDetailsPage = () => {
    const router = useRouter();
    const inductionId = router.query.id;

    // refetches inductions query on sign in (in case previously cleared on sign out)
    useUALAccount(); // see https://github.com/eoscommunity/Eden/pull/239

    const { isLoading: isLoadingCommunityState } = useIsCommunityActive();

    const {
        data,
        isLoading: isLoadingEndorsements,
    } = useGetInductionWithEndorsements(inductionId as string);

    const isLoading = isLoadingEndorsements || isLoadingCommunityState;

    const induction = data?.induction;
    const endorsements = data?.endorsements || [];

    const status = getInductionStatus(induction, endorsements);

    const notFound =
        status === InductionStatus.Invalid ||
        status === InductionStatus.Expired;

    if (!isLoading && notFound) {
        return (
            <RawLayout title="Invite not found">
                <CallToAction
                    href={ROUTES.INDUCTION.href}
                    buttonLabel="Membership Dashboard"
                >
                    Hmmm... this invitation couldn't be found. The invitee may
                    have already been inducted, or their invitation could have
                    expired.
                </CallToAction>
            </RawLayout>
        );
    }

    return (
        <SingleColLayout
            title={isLoading ? "Loading" : `Induction #${inductionId}`}
        >
            {isLoading ? (
                <Card title="Loading...">...</Card>
            ) : (
                induction && (
                    <InductionJourneyContainer
                        induction={induction}
                        endorsements={endorsements}
                        status={status}
                    />
                )
            )}
        </SingleColLayout>
    );
};

export default InductionDetailsPage;
