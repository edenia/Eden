import dayjs from "dayjs";
import * as relativeTime from "dayjs/plugin/relativeTime";

import { useFetchedData } from "_app";
import * as InductionTable from "_app/ui/table";
import { EdenMember, getEdenMember } from "members";

import { getEndorsementsByInductionId } from "../../api";
import { getInductionStatus } from "../../utils";
import { Endorsement, Induction, InductionStatus } from "../../interfaces";
import { InductionActionButton } from "./action-button";

dayjs.extend(relativeTime.default);

interface Props {
    inductions: Induction[];
}

export const InviteeInductions = ({ inductions }: Props) => (
    <InductionTable.Table
        columns={INVITEE_INDUCTION_COLUMNS}
        data={getTableData(inductions)}
        tableHeader="My invitations to Eden"
    />
);

const INVITEE_INDUCTION_COLUMNS: InductionTable.Column[] = [
    {
        key: "inviter",
        label: "Inviter",
    },
    {
        key: "voters",
        label: "Voters",
        className: "hidden md:flex",
    },
    {
        key: "time_remaining",
        label: "Time remaining",
        className: "hidden md:flex",
    },
    {
        key: "status",
        label: "Action/Status",
        type: InductionTable.DataTypeEnum.Action,
    },
];

const getTableData = (inductions: Induction[]): InductionTable.Row[] => {
    return inductions.map((ind) => {
        const [allEndorsements] = useFetchedData<Endorsement[]>(
            getEndorsementsByInductionId,
            ind.id
        );

        const [inviter] = useFetchedData<EdenMember>(
            getEdenMember,
            ind.inviter
        );

        const endorsers =
            allEndorsements
                ?.map((end: Endorsement): string => end.endorser)
                .filter((end: string) => end !== ind.inviter)
                ?.join(", ") || "";

        const isFullyEndorsed =
            allEndorsements &&
            allEndorsements.filter((endorsement) => endorsement.endorsed)
                .length === allEndorsements.length;

        const remainingTime = dayjs().to(
            dayjs(ind.created_at).add(7, "day"),
            true
        );

        return {
            key: ind.id,
            inviter: inviter ? inviter.name : ind.inviter,
            voters: endorsers,
            time_remaining: remainingTime,
            status: (
                <InviteeInductionStatus
                    induction={ind}
                    isFullyEndorsed={isFullyEndorsed}
                />
            ),
        };
    });
};

interface InviteeInductionStatusProps {
    induction: Induction;
    isFullyEndorsed?: boolean;
}
const InviteeInductionStatus = ({
    induction,
    isFullyEndorsed,
}: InviteeInductionStatusProps) => {
    const status = getInductionStatus(induction);
    switch (status) {
        case InductionStatus.waitingForProfile:
            return (
                <InductionActionButton
                    href={`/induction/${induction.id}`}
                    className="bg-blue-400 border-blue-400"
                    lightText
                >
                    Create my profile
                </InductionActionButton>
            );
        case InductionStatus.waitingForVideo:
            return (
                <InductionActionButton
                    href={`/induction/${induction.id}`}
                    className="bg-gray-50"
                >
                    Induction ceremony
                </InductionActionButton>
            );
        case InductionStatus.waitingForEndorsement:
            return isFullyEndorsed ? (
                <InductionActionButton
                    href={`/induction/${induction.id}`}
                    className="bg-blue-400 border-blue-400"
                    lightText
                >
                    Donate & Complete
                </InductionActionButton>
            ) : (
                <InductionActionButton
                    href={`/induction/${induction.id}`}
                    className="bg-gray-50"
                >
                    Voting
                </InductionActionButton>
            );
        default:
            return <>Error</>;
    }
};
