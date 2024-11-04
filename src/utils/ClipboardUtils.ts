import { Deferred } from "./Deferred";
import { Notifications } from "./Notifications";

export type CopyTextToClipboardResult =
    | {
          success: true;
          text: string;
      }
    | {
          success: false;
          error: unknown;
      };

export class ClipboardUtils {
    static async copyTextToClipboardFromCallback(callback: () => Promise<string>): Promise<CopyTextToClipboardResult> {
        const deferred = new Deferred<CopyTextToClipboardResult>();
        const prom = new Promise<Blob>((r) => {
            void (async () => {
                const text = await callback();
                r(new Blob([text], { type: "text/plain" }));
            })();
        });

        // ClipboardItem with a promise is required to make it work in Safari - the new IE6
        void navigator.clipboard
            // eslint-disable-next-line @typescript-eslint/naming-convention
            .write([new ClipboardItem({ "text/plain": prom })])
            .then(() => {
                prom.then(async (blob) => {
                    deferred.resolve({ success: true, text: await blob.text() });
                }).catch((error: unknown) => {
                    deferred.resolve({ success: false, error: error });
                });
            })
            .catch((error: unknown) => {
                deferred.resolve({ success: false, error: error });
            });
        return await deferred.promise;
    }

    static async copyTextToClipboardFromCallbackAndNotify(
        callback: () => Promise<string>,
        successMessage: string,
        errorMessage: string,
    ): Promise<CopyTextToClipboardResult> {
        const res = await ClipboardUtils.copyTextToClipboardFromCallback(callback);
        if (res.success) {
            Notifications.showSuccess({ message: successMessage });
        } else {
            Notifications.showError({ message: errorMessage });
        }
        return res;
    }
}
