import { Box, Center, Group, Stack, Text } from "@mantine/core";
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
import { useOpenDeleteContextModal } from "../delete/openDeleteContextModal";
import { useOpenEditContextModal } from "../edit/openEditContextModal";

export interface ContextProfileProps {
    solutionId: ServerApiTypes.types.cloud.SolutionId;
    contextId: ServerApiTypes.types.context.ContextId;
}

interface ContextProfileData {
    solution: ServerApiTypes.api.solution.Solution;
    context: ServerApiTypes.api.context.Context;
}

export function ContextProfile(props: ContextProfileProps) {
    const contextApi = useContextApi();
    const solutionApi = useSolutionApi();
    const [profileData, setProfileData] = useState<ContextProfileData | null>(null);
    const profileDataLoader = useCallback(async () => {
        const context = await contextApi.getContext({ contextId: props.contextId });
        const solution = await solutionApi.getSolution({ id: props.solutionId });
        return { context: context.context, solution: solution.solution };
    }, [contextApi, solutionApi, props.contextId, props.solutionId]);
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

    return <ContextProfileCore context={profileData.context} solution={profileData.solution} />;
}

export interface ContextProfileCoreProps {
    solution: ServerApiTypes.api.solution.Solution;
    context: ServerApiTypes.api.context.Context;
}

export function ContextProfileCore(props: ContextProfileCoreProps) {
    const context = props.context;
    const t = useTranslations("features.contexts");
    const tRoot = useTranslations();
    const router = useRouter();

    const contextProps: propsViewTypes.Prop[] = useMemo((): propsViewTypes.Prop[] => {
        return [
            {
                id: "id",
                type: "shortString",
                label: t("profile.id"),
                value: context.id,
                emptyValueMessage: true,
                useMonospaceFont: true,
                withCopyButton: true,
            },
            {
                id: "name",
                type: "shortString",
                label: t("profile.name"),
                value: context.name,
                emptyValueMessage: true,
                useMonospaceFont: false,
                withCopyButton: true,
            },
            {
                id: "scope",
                type: "custom",
                label: t("profile.scope"),
                value: <Text size="md">{tRoot(`api.context.scopeShort.${context.scope}`)}</Text>,
                emptyValueMessage: true,
                withCopyButton: false,
            },
            {
                id: "sharesCount",
                type: "number",
                label: t("profile.sharesCount"),
                value: context.shares.length,
                useMonospaceFont: true,
                withCopyButton: false,
            },
            {
                id: "created",
                type: "dateTime",
                label: t("profile.created"),
                value: context.created,
                emptyValueMessage: true,
                useMonospaceFont: false,
                withCopyButton: true,
            },
            {
                id: "modified",
                type: "dateTime",
                label: t("profile.modified"),
                value: context.modified,
                emptyValueMessage: true,
                useMonospaceFont: false,
                withCopyButton: true,
            },
            {
                id: "description",
                type: "longString",
                label: t("profile.description"),
                value: context.description,
                emptyValueMessage: true,
                useMonospaceFont: false,
                withCopyButton: true,
                whiteSpace: "pre-wrap",
            },
        ];
    }, [context, t, tRoot]);

    const { openEditContextModal } = useOpenEditContextModal();
    const handleEditClick = useCallback(() => {
        void openEditContextModal(context);
    }, [context, openEditContextModal]);

    const { openDeleteContextModal } = useOpenDeleteContextModal();
    const handleDeleteClick = useCallback(() => {
        void openDeleteContextModal(context).then((res) => {
            if (res.deleted) {
                //redirect
                router.push(appRoutes.solutions.$solution(props.solution.id).contexts.list());
            }
        });
    }, [context, openDeleteContextModal, props.solution.id, router]);

    return (
        <Stack gap="xl">
            <PropsView props={contextProps} />
            <Group justify="space-between" align="flex-start">
                <Group gap="md">
                    <Button type="button" preset="edit" onClick={handleEditClick} />
                    <Button type="button" preset="delete" onClick={handleDeleteClick} />
                </Group>
                <Stack gap="md">
                    <Button type="link" icon="users" href={appRoutes.solutions.$solution(props.solution.id).contexts.$context(props.context.id).users.list()}>
                        <Box component="span" mr={6}>
                            {t("usersButton.label")}
                        </Box>
                        <Icon name="arrowRight" />
                    </Button>
                    <Button
                        type="link"
                        icon="solutions"
                        href={appRoutes.solutions.$solution(props.solution.id).contexts.$context(props.context.id).shares.list()}
                    >
                        <Box component="span" mr={6}>
                            {t("sharesButton.label")}
                        </Box>
                        <Icon name="arrowRight" />
                    </Button>
                </Stack>
            </Group>
        </Stack>
    );
}
