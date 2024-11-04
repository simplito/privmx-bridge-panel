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
import { useDataLoader } from "@/hooks/useDataLoader";
import { useManagerApi } from "@/hooks/useManagerApi";
import { usePrivMxBridgeApiEventListener } from "@/hooks/usePrivMxBridgeApiEventListener";
import { useRouter } from "@/i18n/routing";
import type { ApiKeyDeletedEvent, ApiKeyUpdatedEvent } from "@/privMxBridgeApi/PrivMxBridgeApiEvents";
import { DocsUtils } from "@/utils/DocsUtils";
import { ApiKeyUtils } from "../ApiKeyUtils";
import { useOpenDeleteApiKeyModal } from "../delete/openDeleteApiKeyModal";
import { useOpenEditApiKeyModal } from "../edit/openEditApiKeyModal";

export interface ApiKeyProfileProps {
    apiKeyId: ServerApiTypes.types.auth.ApiKeyId;
}

interface ApiKeyProfileData {
    apiKey: ServerApiTypes.api.manager.ApiKey;
}

export function ApiKeyProfile(props: ApiKeyProfileProps) {
    const managerApi = useManagerApi();
    const [profileData, setProfileData] = useState<ApiKeyProfileData | null>(null);
    const profileDataLoader = useCallback(async () => {
        const apiKey = await managerApi.getApiKey({ id: props.apiKeyId });
        return { apiKey: apiKey.apiKey };
    }, [managerApi, props.apiKeyId]);
    const { isLoading: isLoadingProfileData, error: profileDataLoadingError, reload: reloadProfileData } = useDataLoader(profileDataLoader, setProfileData);
    usePrivMxBridgeApiEventListener(
        "apiKeyDeleted",
        useCallback(
            (event: ApiKeyDeletedEvent) => {
                if (event.apiKeyId === props.apiKeyId) {
                    void reloadProfileData();
                }
            },
            [props.apiKeyId, reloadProfileData],
        ),
    );
    usePrivMxBridgeApiEventListener(
        "apiKeyUpdated",
        useCallback(
            (event: ApiKeyUpdatedEvent) => {
                if (event.apiKeyId === props.apiKeyId) {
                    void reloadProfileData();
                }
            },
            [props.apiKeyId, reloadProfileData],
        ),
    );

    if (Boolean(profileDataLoadingError) || isLoadingProfileData || profileData === null) {
        return (
            <Center mt={100}>
                <LoadingOrError error={profileDataLoadingError} isLoading={isLoadingProfileData} loaderSize="lg" />
            </Center>
        );
    }

    return <ApiKeyProfileCore apiKey={profileData.apiKey} />;
}

export interface ApiKeyProfileCoreProps {
    apiKey: ServerApiTypes.api.manager.ApiKey;
}

export function ApiKeyProfileCore(props: ApiKeyProfileCoreProps) {
    const apiKey = props.apiKey;
    const t = useTranslations("features.management.apiKeys");
    const tRoot = useTranslations();
    const router = useRouter();

    const apiKeyProps: propsViewTypes.Prop[] = useMemo((): propsViewTypes.Prop[] => {
        return [
            {
                id: "id",
                type: "shortString",
                label: t("profile.id"),
                value: apiKey.id,
                emptyValueMessage: true,
                useMonospaceFont: true,
                withCopyButton: true,
            },
            {
                id: "name",
                type: "shortString",
                label: t("profile.name"),
                value: apiKey.name,
                emptyValueMessage: true,
                useMonospaceFont: false,
                withCopyButton: true,
            },
            {
                id: "enabled",
                type: "boolean",
                label: t("profile.enabled"),
                value: apiKey.enabled,
                withCopyButton: false,
            },
            {
                id: "created",
                type: "dateTime",
                label: t("profile.created"),
                value: apiKey.created,
                emptyValueMessage: true,
                useMonospaceFont: false,
                withCopyButton: true,
            },
            {
                id: "scope",
                type: "longString",
                label: (
                    <Group component="span">
                        {t("profile.scope")}
                        <InfoIcon tooltip={tRoot("clickToOpenDocs")} linkType="external" href={DocsUtils.getApiScopesUrl()} />
                    </Group>
                ),
                value: ApiKeyUtils.scopeArrayToString(apiKey.scope),
                emptyValueMessage: true,
                useMonospaceFont: false,
                withCopyButton: true,
                whiteSpace: "pre-wrap",
            },
        ];
    }, [apiKey, t, tRoot]);

    const { openEditApiKeyModal } = useOpenEditApiKeyModal();
    const handleEditClick = useCallback(() => {
        void openEditApiKeyModal(apiKey);
    }, [apiKey, openEditApiKeyModal]);

    const { openDeleteApiKeyModal } = useOpenDeleteApiKeyModal();
    const handleDeleteClick = useCallback(() => {
        void openDeleteApiKeyModal(apiKey).then((res) => {
            if (res.deleted) {
                router.push(appRoutes.management.apiKeys.list());
            }
        });
    }, [apiKey, openDeleteApiKeyModal, router]);

    return (
        <Stack gap="xl">
            <PropsView props={apiKeyProps} />
            <Group justify="space-between" align="flex-start">
                <Group gap="md">
                    <Button type="button" preset="edit" onClick={handleEditClick} />
                    <Button type="button" preset="delete" onClick={handleDeleteClick} />
                </Group>
            </Group>
        </Stack>
    );
}
