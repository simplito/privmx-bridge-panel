import { Center, Group, Stack } from "@mantine/core";
import type * as ServerApiTypes from "privmx-server-api";
import { useCallback, useMemo, useState } from "react";
import { useTranslations } from "use-intl";
import { appRoutes } from "@/app/appRoutes";
import { InfoIcon } from "@/components/atoms/InfoIcon";
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
import { DocsUtils } from "@/utils/DocsUtils";
import { useOpenDeleteContextUserModal } from "../delete/openDeleteContextUserModal";
import { useOpenEditContextUserModal } from "../edit/openEditContextUserModal";

export interface ContextUserProfileProps {
    solutionId: ServerApiTypes.types.cloud.SolutionId;
    contextId: ServerApiTypes.types.context.ContextId;
    contextUserId: ServerApiTypes.types.cloud.UserId;
}

interface ContextUserProfileData {
    solution: ServerApiTypes.api.solution.Solution;
    context: ServerApiTypes.api.context.Context;
    contextUser: ServerApiTypes.api.context.ContextUser;
}

export function ContextUserProfile(props: ContextUserProfileProps) {
    const contextApi = useContextApi();
    const solutionApi = useSolutionApi();
    const [profileData, setProfileData] = useState<ContextUserProfileData | null>(null);
    const profileDataLoader = useCallback(async () => {
        const solution = await solutionApi.getSolution({ id: props.solutionId });
        const context = await contextApi.getContext({ contextId: props.contextId });
        const contextUser = await contextApi.getUserFromContext({ userId: props.contextUserId, contextId: props.contextId });
        return { solution: solution.solution, context: context.context, contextUser: contextUser.user };
    }, [solutionApi, props.solutionId, props.contextId, props.contextUserId, contextApi]);
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

    return <ContextUserProfileCore solution={profileData.solution} context={profileData.context} contextUser={profileData.contextUser} />;
}

export interface ContextUserProfileCoreProps {
    solution: ServerApiTypes.api.solution.Solution;
    context: ServerApiTypes.api.context.Context;
    contextUser: ServerApiTypes.api.context.ContextUser;
}

export function ContextUserProfileCore(props: ContextUserProfileCoreProps) {
    const contextUser = props.contextUser;
    const t = useTranslations("features.contextUsers");
    const tRoot = useTranslations();
    const router = useRouter();

    const solutionProps: propsViewTypes.Prop[] = useMemo((): propsViewTypes.Prop[] => {
        return [
            {
                id: "id",
                type: "shortString",
                label: t("profile.id"),
                value: contextUser.userId,
                emptyValueMessage: true,
                useMonospaceFont: true,
                withCopyButton: true,
            },
            {
                id: "pubKey",
                type: "shortString",
                label: t("profile.pubKey"),
                value: contextUser.pubKey,
                emptyValueMessage: true,
                useMonospaceFont: false,
                withCopyButton: true,
            },
            {
                id: "created",
                type: "dateTime",
                label: t("profile.created"),
                value: contextUser.created,
                emptyValueMessage: true,
                useMonospaceFont: false,
                withCopyButton: true,
            },
            {
                id: "acl",
                type: "longString",
                label: (
                    <Group component="span">
                        {t("profile.acl")}
                        <InfoIcon tooltip={tRoot("clickToOpenDocs")} linkType="external" href={DocsUtils.getIntroductionToAclUrl()} />
                    </Group>
                ),
                value: contextUser.acl,
                emptyValueMessage: true,
                useMonospaceFont: true,
                withCopyButton: true,
                whiteSpace: "pre-wrap",
            },
        ];
    }, [contextUser, t, tRoot]);

    const { openDeleteContextUserModal } = useOpenDeleteContextUserModal();
    const handleDeleteClick = useCallback(() => {
        void openDeleteContextUserModal({ context: props.context, solution: props.solution, user: contextUser }).then((res) => {
            if (res.deleted) {
                router.push(appRoutes.solutions.$solution(props.solution.id).contexts.$context(props.context.id).users.list());
            }
        });
    }, [contextUser, openDeleteContextUserModal, props.context, props.solution, router]);

    const { openEditContextUserModal } = useOpenEditContextUserModal();
    const handleEditClick = useCallback(() => {
        void openEditContextUserModal(props.contextUser);
    }, [props.contextUser, openEditContextUserModal]);

    return (
        <Stack gap="xl">
            <PropsView props={solutionProps} />
            <Group justify="space-between" align="flex-start">
                <Group gap="md">
                    <Button type="button" preset="edit" onClick={handleEditClick} />
                    <Button type="button" preset="delete" onClick={handleDeleteClick} />
                </Group>
            </Group>
        </Stack>
    );
}
