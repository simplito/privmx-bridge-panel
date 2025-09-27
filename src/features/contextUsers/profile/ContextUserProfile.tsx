import { Center, Group, Stack } from "@mantine/core";
import type * as ServerApiTypes from "privmx-server-api";
import { useCallback, useMemo, useState } from "react";
import { useTranslations } from "use-intl";
import { appRoutes } from "@/app/appRoutes";
import { LoadingOrError } from "@/components/atoms/LoadingOrError";
import { Button } from "@/components/button/Button";
import { PropsView } from "@/components/propsView/PropsView";
import type * as propsViewTypes from "@/components/propsView/types";
import { useContextApi } from "@/hooks/useContextApi";
import { useDataLoader } from "@/hooks/useDataLoader";
import { usePrivMxBridgeApiEventListener } from "@/hooks/usePrivMxBridgeApiEventListener";
import { useRouter } from "@/i18n/routing";
import type { ContextDeletedEvent, ContextUpdatedEvent } from "@/privMxBridgeApi/PrivMxBridgeApiEvents";
import { useOpenDeleteContextUserModal } from "../delete/openDeleteContextUserModal";
import { useOpenEditContextUserModal } from "../edit/openEditContextUserModal";

export interface ContextUserProfileProps {
    solutionId: ServerApiTypes.types.cloud.SolutionId;
    contextId: ServerApiTypes.types.context.ContextId;
    contextUserId: ServerApiTypes.types.cloud.UserId;
}

interface ContextUserProfileData {
    context: ServerApiTypes.api.context.Context;
    contextUser: ServerApiTypes.api.context.ContextUser;
}

export function ContextUserProfile(props: ContextUserProfileProps) {
    const contextApi = useContextApi();
    const [profileData, setProfileData] = useState<ContextUserProfileData | null>(null);
    const profileDataLoader = useCallback(async () => {
        const contextUser = await contextApi.getUserFromContext({ contextId: props.contextId, userId: props.contextUserId });
        const context = await contextApi.getContext({ contextId: props.contextId });
        return { contextUser: contextUser.user, context: context.context };
    }, [contextApi, props.contextId, props.contextUserId]);
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

    if (Boolean(profileDataLoadingError) || isLoadingProfileData || profileData === null) {
        return (
            <Center mt={100}>
                <LoadingOrError error={profileDataLoadingError} isLoading={isLoadingProfileData} loaderSize="lg" />
            </Center>
        );
    }

    return <ContextUserProfileCore contextUser={profileData.contextUser} context={profileData.context} />;
}

export interface ContextUserProfileCoreProps {
    context: ServerApiTypes.api.context.Context;
    contextUser: ServerApiTypes.api.context.ContextUser;
}

export function ContextUserProfileCore(props: ContextUserProfileCoreProps) {
    const contextUser = props.contextUser;
    const context = props.context;
    const t = useTranslations("features.contextUsers");
    const router = useRouter();

    const contextProps: propsViewTypes.Prop[] = useMemo((): propsViewTypes.Prop[] => {
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
                useMonospaceFont: true,
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
                label: t("profile.acl"),
                value: contextUser.acl,
                emptyValueMessage: true,
                useMonospaceFont: true,
                withCopyButton: true,
                whiteSpace: "pre-wrap",
            },
        ];
    }, [contextUser, t]);

    const { openEditContextUserModal } = useOpenEditContextUserModal();
    const handleEditClick = useCallback(() => {
        void openEditContextUserModal(contextUser);
    }, [contextUser, openEditContextUserModal]);

    const { openDeleteContextUserModal } = useOpenDeleteContextUserModal();
    const handleDeleteClick = useCallback(() => {
        void openDeleteContextUserModal({
            context: context,
            user: contextUser,
        }).then((res) => {
            if (res.deleted) {
                router.push(appRoutes.contexts.list());
            }
        });
    }, [context, contextUser, openDeleteContextUserModal, router]);

    return (
        <Stack gap="xl">
            <PropsView props={contextProps} />
            <Group justify="space-between" align="flex-start">
                <Group gap="md">
                    <Button type="button" preset="edit" onClick={handleEditClick} />
                    <Button type="button" preset="delete" onClick={handleDeleteClick} />
                </Group>
            </Group>
        </Stack>
    );
}
