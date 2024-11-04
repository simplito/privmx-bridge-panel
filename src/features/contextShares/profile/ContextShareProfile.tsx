import { Box, Center, Group, Stack } from "@mantine/core";
import type * as ServerApiTypes from "privmx-server-api";
import { useCallback, useMemo, useState } from "react";
import { useTranslations } from "use-intl";
import { appRoutes } from "@/app/appRoutes";
import { Icon } from "@/components/atoms/Icon";
import { LoadingOrError } from "@/components/atoms/LoadingOrError";
import { Button } from "@/components/button/Button";
import { PropsView } from "@/components/propsView/PropsView";
import type * as propsViewTypes from "@/components/propsView/types";
import { useContextApi } from "@/hooks/useContextApi";
import { useDataLoader } from "@/hooks/useDataLoader";
import { usePrivMxBridgeApiEventListener } from "@/hooks/usePrivMxBridgeApiEventListener";
import { useSolutionApi } from "@/hooks/useSolutionApi";
import { useRouter } from "@/i18n/routing";
import type { ContextDeletedEvent, ContextUpdatedEvent, SolutionDeletedEvent, SolutionUpdatedEvent } from "@/privMxBridgeApi/PrivMxBridgeApiEvents";
import { useOpenRemoveContextShareModal } from "../remove/openRemoveContextShareModal";

export interface ContextShareProfileProps {
    solutionId: ServerApiTypes.types.cloud.SolutionId;
    contextId: ServerApiTypes.types.context.ContextId;
    contextShareId: ServerApiTypes.types.cloud.SolutionId;
}

interface ContextShareProfileData {
    solution: ServerApiTypes.api.solution.Solution;
    context: ServerApiTypes.api.context.Context;
    contextShare: ServerApiTypes.api.solution.Solution;
}

export function ContextShareProfile(props: ContextShareProfileProps) {
    const contextApi = useContextApi();
    const solutionApi = useSolutionApi();
    const [profileData, setProfileData] = useState<ContextShareProfileData | null>(null);
    const profileDataLoader = useCallback(async () => {
        const solution = await solutionApi.getSolution({ id: props.solutionId });
        const context = await contextApi.getContext({ contextId: props.contextId });
        const contextShare = await solutionApi.getSolution({ id: props.contextShareId });
        return { solution: solution.solution, context: context.context, contextShare: contextShare.solution };
    }, [solutionApi, props.solutionId, props.contextId, props.contextShareId, contextApi]);
    const { isLoading: isLoadingProfileData, error: profileDataLoadingError, reload: reloadProfileData } = useDataLoader(profileDataLoader, setProfileData);
    usePrivMxBridgeApiEventListener(
        "contextDeleted",
        useCallback(
            (event: ContextDeletedEvent) => {
                if (event.contextId === props.contextId) {
                    void reloadProfileData();
                }
            },
            [props.contextId, reloadProfileData],
        ),
    );
    usePrivMxBridgeApiEventListener(
        "contextUpdated",
        useCallback(
            (event: ContextUpdatedEvent) => {
                if (event.contextId === props.contextId) {
                    void reloadProfileData();
                }
            },
            [props.contextId, reloadProfileData],
        ),
    );
    usePrivMxBridgeApiEventListener(
        "solutionDeleted",
        useCallback(
            (event: SolutionDeletedEvent) => {
                if (event.solutionId === props.solutionId || event.solutionId === props.contextShareId) {
                    void reloadProfileData();
                }
            },
            [props.contextShareId, props.solutionId, reloadProfileData],
        ),
    );
    usePrivMxBridgeApiEventListener(
        "solutionUpdated",
        useCallback(
            (event: SolutionUpdatedEvent) => {
                if (event.solutionId === props.solutionId || event.solutionId === props.contextShareId) {
                    void reloadProfileData();
                }
            },
            [props.contextShareId, props.solutionId, reloadProfileData],
        ),
    );

    if (Boolean(profileDataLoadingError) || isLoadingProfileData || profileData === null) {
        return (
            <Center mt={100}>
                <LoadingOrError error={profileDataLoadingError} isLoading={isLoadingProfileData} loaderSize="lg" />
            </Center>
        );
    }

    return <ContextShareProfileCore solution={profileData.solution} context={profileData.context} contextShare={profileData.contextShare} />;
}

export interface ContextShareProfileCoreProps {
    solution: ServerApiTypes.api.solution.Solution;
    context: ServerApiTypes.api.context.Context;
    contextShare: ServerApiTypes.api.solution.Solution;
}

export function ContextShareProfileCore(props: ContextShareProfileCoreProps) {
    const contextShare = props.contextShare;
    const t = useTranslations("features.contextShares");
    const router = useRouter();

    const solutionProps: propsViewTypes.Prop[] = useMemo((): propsViewTypes.Prop[] => {
        return [
            {
                id: "id",
                type: "shortString",
                label: t("profile.id"),
                value: contextShare.id,
                emptyValueMessage: true,
                useMonospaceFont: true,
                withCopyButton: true,
            },
            {
                id: "name",
                type: "shortString",
                label: t("profile.name"),
                value: contextShare.name,
                emptyValueMessage: true,
                useMonospaceFont: false,
                withCopyButton: true,
            },
            {
                id: "created",
                type: "dateTime",
                label: t("profile.created"),
                value: contextShare.created,
                emptyValueMessage: true,
                useMonospaceFont: false,
                withCopyButton: true,
            },
        ];
    }, [contextShare, t]);

    const { openRemoveContextShareModal } = useOpenRemoveContextShareModal();
    const handleRemoveClick = useCallback(() => {
        void openRemoveContextShareModal({ context: props.context, solution: contextShare }).then((res) => {
            if (res.removed) {
                router.push(appRoutes.solutions.$solution(props.solution.id).contexts.$context(props.context.id).shares.list());
            }
        });
    }, [contextShare, openRemoveContextShareModal, props.context, props.solution.id, router]);

    return (
        <Stack gap="xl">
            <PropsView props={solutionProps} />
            <Group justify="space-between" align="flex-start">
                <Group gap="md">
                    <Button type="button" preset="remove" onClick={handleRemoveClick} />
                </Group>
                <Stack gap="md">
                    <Button type="link" icon="solution" href={appRoutes.solutions.$solution(props.contextShare.id).profile()}>
                        <Box component="span" mr={6}>
                            {t("goToSolutionButton.label")}
                        </Box>
                        <Icon name="arrowRight" />
                    </Button>
                </Stack>
            </Group>
        </Stack>
    );
}
