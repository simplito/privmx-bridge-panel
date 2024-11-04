import { useCallback, useEffect, useState } from "react";
import { Deferred } from "../utils/Deferred";

interface UseDataLoaderReturnValue<TData> {
    cancelLoading: (() => void) | null;
    data: TData | null;
    error: unknown;
    isLoading: boolean;
    reload: () => Promise<TData>;
}

export function useDataLoader<TData>(loader: () => Promise<TData>, dataSetter?: (data: TData) => void): UseDataLoaderReturnValue<TData> {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<unknown>(null);
    const [data, setData] = useState<TData | null>(null);
    const [cancelLoading, setCancelLoading] = useState<(() => void) | null>(null);

    const loadData = useCallback(() => {
        let isCancelled = false;
        const deferred = new Deferred<TData>();
        void (async () => {
            setIsLoading(true);
            try {
                const newData = await loader();
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                if (!isCancelled) {
                    deferred.resolve(newData);
                    setData(newData);
                    setError(null);
                    dataSetter?.(newData);
                }
            } catch (err) {
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                if (!isCancelled) {
                    deferred.reject(err);
                    setError(err);
                }
            } finally {
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                if (!isCancelled) {
                    setIsLoading(false);
                }
            }
        })();
        const cancel = (): void => {
            isCancelled = true;
        };
        return {
            cancel: cancel,
            promise: deferred.promise,
        };
    }, [loader, dataSetter]);

    useEffect(() => {
        const { cancel } = loadData();
        setCancelLoading(() => cancel);
        return cancel;
    }, [loader, dataSetter, loadData]);

    const reload = useCallback(async () => {
        setError(null);
        cancelLoading?.();
        const { cancel, promise } = loadData();
        setCancelLoading(() => cancel);
        return await promise;
    }, [loadData, cancelLoading]);

    return {
        cancelLoading,
        data,
        error,
        isLoading,
        reload,
    };
}
