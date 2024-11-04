import { Notifications as MantineNotifications } from "@mantine/notifications";
import { Icon } from "@/components/atoms/Icon";

export interface NotificationProps {
    message: string;
    title?: string | undefined;
    loading?: boolean | undefined;
    autoClose?: number | undefined;
    onOpen?: (() => void) | undefined;
    onClose?: (() => void) | undefined;
}

export class Notifications {
    static showSuccess(props: NotificationProps): void {
        MantineNotifications.show({
            message: props.message,
            title: props.title,
            loading: props.loading,
            autoClose: props.autoClose,
            onOpen: props.onOpen,
            onClose: props.onClose,
            color: "green",
            icon: <Icon name="check" />,
        });
    }

    static showError(props: NotificationProps): void {
        MantineNotifications.show({
            message: props.message,
            title: props.title,
            loading: props.loading,
            autoClose: props.autoClose,
            onOpen: props.onOpen,
            onClose: props.onClose,
            color: "red",
            icon: <Icon name="error" />,
        });
    }

    static showWarning(props: NotificationProps): void {
        MantineNotifications.show({
            message: props.message,
            title: props.title,
            loading: props.loading,
            autoClose: props.autoClose,
            onOpen: props.onOpen,
            onClose: props.onClose,
            color: "yellow",
            icon: <Icon name="warning" />,
        });
    }

    static showInfo(props: NotificationProps): void {
        MantineNotifications.show({
            message: props.message,
            title: props.title,
            loading: props.loading,
            autoClose: props.autoClose,
            onOpen: props.onOpen,
            onClose: props.onClose,
            color: "blue",
            icon: <Icon name="info" />,
        });
    }
}
