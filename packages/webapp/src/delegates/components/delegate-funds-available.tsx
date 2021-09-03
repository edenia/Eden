import dayjs from "dayjs";
import { useState } from "react";
import { useQueryClient } from "react-query";

import {
    assetToString,
    Button,
    Heading,
    onError,
    queryDistributionsForAccount,
    queryTokenBalanceForAccount,
    sumAssetStrings,
    Text,
    useDistributionsForAccount,
    useDistributionState,
    useMemberByAccountName,
    useUALAccount,
} from "_app";

import { withdrawDelegateAvailableFunds } from "../transactions";

interface Props {
    account: string;
}

export const DelegateFundsAvailable = ({ account }: Props) => {
    const [ualAccount] = useUALAccount();
    const { data: member } = useMemberByAccountName(account);
    const { data: distributions } = useDistributionsForAccount(account);
    const [isLoading, setIsLoading] = useState(false);
    const queryClient = useQueryClient();

    const availableFunds = distributions
        ? sumAssetStrings(
              distributions.map((distribution) => distribution.balance)
          )
        : undefined;

    // omit component if it's not a current delegate and available funds are empty
    if ((!member || !member.election_rank) && !availableFunds) {
        return null;
    }

    const submitWithdraw = async () => {
        setIsLoading(true);

        try {
            const authorizerAccount = ualAccount.accountName;
            const trx = withdrawDelegateAvailableFunds(
                authorizerAccount,
                distributions!
            );
            console.info("signing trx", trx);

            const signedTrx = await ualAccount.signTransaction(trx, {
                broadcast: true,
            });
            console.info("withdraw delegate available funds trx", signedTrx);

            // allow time for chain tables to update
            await new Promise((resolve) => setTimeout(resolve, 3000));

            // invalidate current member query to update participating status
            queryClient.invalidateQueries(
                queryDistributionsForAccount(ualAccount.accountName).queryKey
            );
            queryClient.invalidateQueries(
                queryTokenBalanceForAccount(ualAccount.accountName).queryKey
            );
        } catch (error) {
            console.error(error);
            onError(error.message);
        }

        setIsLoading(false);
    };

    const isLoggedMember = Boolean(
        ualAccount && member && ualAccount.accountName === member.account
    );

    return (
        <>
            <div className="flex justify-between items-center">
                <div>
                    <Heading size={3}>Delegate funds available</Heading>
                    <Text>
                        {availableFunds
                            ? assetToString(availableFunds)
                            : "None"}
                    </Text>
                </div>
                <div>
                    {isLoggedMember && (
                        <Button
                            onClick={submitWithdraw}
                            disabled={
                                isLoading ||
                                !availableFunds ||
                                availableFunds.quantity === 0
                            }
                            isLoading={isLoading}
                        >
                            Withdraw
                        </Button>
                    )}
                </div>
            </div>
            {isLoggedMember && <NextDisbursementInfo />}
        </>
    );
};

export const NextDisbursementInfo = () => {
    const { data: distributionState } = useDistributionState();

    if (!distributionState) return null;

    switch (distributionState.state) {
        case "next_distribution":
            const nextDisbursementTime = dayjs(
                distributionState.data.distribution_time + "Z"
            );
            return (
                <Text>
                    Delegate funds are disbursed monthly. Check back on{" "}
                    {nextDisbursementTime.format("LL")} after{" "}
                    {nextDisbursementTime.format("LT z")} for your next
                    disbursement.
                </Text>
            );
        case "election_distribution":
            return (
                <Text>
                    An election is currently underway. Disbursements to
                    newly-elected delegates will be processed as soon as the
                    election ends.
                </Text>
            );
        case "current_distribution":
            return (
                <Text>
                    A disbursement is being processed now. Check back in the
                    next few hours.
                </Text>
            );
        default:
            return null;
    }
};
