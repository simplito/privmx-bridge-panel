import { Button, Center, Group, LoadingOrError, PropsView, Stack, Text } from "privmx-components/components/index";
import type * as propsViewTypes from "privmx-components/components/propsView/types";
import { useDataLoader } from "privmx-components/hooks/useDataLoader";
import { useI18n } from "privmx-components/i18n/useI18n";
import type * as ServerApiTypes from "privmx-server-api";
import { useCallback, useMemo, useState } from "react";
import { appRoutes } from "@/app/appRoutes";
import { pageWidthBySize } from "@/components/atoms/PageWrapper";
import { ContextsCrudTable } from "@/features/contexts/list/ContextsCrudTable";
import { usePrivMxBridgeApiEventListener } from "@/hooks/usePrivMxBridgeApiEventListener";
import { useSolutionApi } from "@/hooks/useSolutionApi";
import { useRouter } from "@/i18n/routing";
import type { SolutionDeletedEvent, SolutionUpdatedEvent } from "@/privMxBridgeApi/PrivMxBridgeApiEvents";
import { useOpenDeleteSolutionModal } from "../delete/openDeleteSolutionModal";
import { useOpenEditSolutionModal } from "../edit/openEditSolutionModal";

export interface SolutionProfileProps {
    solutionId: ServerApiTypes.types.cloud.SolutionId;
}

interface SolutionProfileData {
    solution: ServerApiTypes.api.solution.Solution;
}

export function SolutionProfile(props: SolutionProfileProps) {
    const solutionApi = useSolutionApi();
    const [profileData, setProfileData] = useState<SolutionProfileData | null>(null);
    const profileDataLoader = useCallback(async () => {
        const solution = await solutionApi.getSolution({ id: props.solutionId });
        return { solution: solution.solution };
    }, [solutionApi, props.solutionId]);
    const { isLoading: isLoadingProfileData, error: profileDataLoadingError, reload: reloadProfileData } = useDataLoader(profileDataLoader, setProfileData);
    usePrivMxBridgeApiEventListener(
        "solutionDeleted",
        useCallback(
            (event: SolutionDeletedEvent) => {
                if (event.solutionId === props.solutionId) {
                    void reloadProfileData();
                }
            },
            [props.solutionId, reloadProfileData],
        ),
    );
    usePrivMxBridgeApiEventListener(
        "solutionUpdated",
        useCallback(
            (event: SolutionUpdatedEvent) => {
                if (event.solutionId === props.solutionId) {
                    void reloadProfileData();
                }
            },
            [props.solutionId, reloadProfileData],
        ),
    );

    if (Boolean(profileDataLoadingError) || isLoadingProfileData || profileData === null) {
        return (
            <Center mt={100}>
                <LoadingOrError error={profileDataLoadingError} isLoading={isLoadingProfileData} loaderSize="lg" />
            </Center>
        );
    }

    return <SolutionProfileCore solution={profileData.solution} />;
}

export interface SolutionProfileCoreProps {
    solution: ServerApiTypes.api.solution.Solution;
}

export function SolutionProfileCore(props: SolutionProfileCoreProps) {
    const solution = props.solution;
    const { t } = useI18n("features.solutions");
    const router = useRouter();

    const solutionProps: propsViewTypes.Prop[] = useMemo((): propsViewTypes.Prop[] => {
        return [
            {
                id: "id",
                type: "shortString",
                label: t("profile.id"),
                value: solution.id,
                emptyValueMessage: true,
                useMonospaceFont: true,
                withCopyButton: true,
            },
            {
                id: "name",
                type: "shortString",
                label: t("profile.name"),
                value: solution.name,
                emptyValueMessage: true,
                useMonospaceFont: false,
                withCopyButton: true,
            },
            {
                id: "created",
                type: "dateTime",
                label: t("profile.created"),
                value: solution.created,
                emptyValueMessage: true,
                useMonospaceFont: false,
                withCopyButton: true,
            },
        ];
    }, [solution, t]);

    const { openEditSolutionModal } = useOpenEditSolutionModal();
    const handleEditClick = useCallback(() => {
        void openEditSolutionModal(solution);
    }, [solution, openEditSolutionModal]);

    const { openDeleteSolutionModal } = useOpenDeleteSolutionModal();
    const handleDeleteClick = useCallback(() => {
        void openDeleteSolutionModal(solution).then((res) => {
            if (res.deleted) {
                void router.push(appRoutes.solutions.list());
            }
        });
    }, [solution, openDeleteSolutionModal, router]);

    return (
        <Stack gap="xl">
            <Stack gap="xl" w={pageWidthBySize.lg}>
                <PropsView props={solutionProps} />
                <Group justify="space-between" align="flex-start">
                    <Group gap="md">
                        <Button type="button" preset="edit" onClick={handleEditClick} />
                        <Button type="button" preset="delete" onClick={handleDeleteClick} />
                    </Group>
                </Group>
            </Stack>
            <Text component="h3" mt="lg">
                {t("profile.contexts")}
            </Text>
            <ContextsCrudTable solutionId={props.solution.id} />
        </Stack>
    );
}
