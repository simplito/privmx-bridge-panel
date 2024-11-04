import { useState } from "react";

export interface ProcessingSuccessResult<T> {
    success: true;
    result: T;
}

export interface ProcessingFailureResult {
    success: false;
    error: unknown;
}

export type ProcessingResult<T> = ProcessingSuccessResult<T> | ProcessingFailureResult;

export type WithProcessingFunction<TResult> = (callback: () => Promise<TResult>) => Promise<ProcessingResult<TResult>>;

interface UseProcessingReturnValue<TResult> {
    isProcessing: boolean;
    setIsProcessing: (isProcessing: boolean) => void;
    withProcessing: WithProcessingFunction<TResult>;
}

export function useProcessing<TResult>(): UseProcessingReturnValue<TResult> {
    const [isProcessing, setIsProcessing] = useState(false);

    const withProcessing = async <T>(callback: () => Promise<T>): Promise<ProcessingResult<T>> => {
        setIsProcessing(true);
        let result: ProcessingResult<T>;
        try {
            const callbackResult = await callback();
            result = {
                success: true,
                result: callbackResult,
            };
        } catch (err) {
            result = {
                success: false,
                error: err,
            };
        }
        setIsProcessing(false);
        return result;
    };

    return {
        isProcessing,
        setIsProcessing,
        withProcessing,
    };
}
