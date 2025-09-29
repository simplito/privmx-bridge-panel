import { MultiSelect, type MultiSelectOption, type MultiSelectProps } from "privmx-components/components/index";
import { useI18n } from "privmx-components/i18n/useI18n";
import { useCallback, useMemo, useState } from "react";
import { PromptModal, type PromptModalProps } from "@/modals/promptModal/PromptModal";

export interface ApiScopesEditorProps extends Omit<MultiSelectProps, "options"> {}

const ipAddrPrefix = "ipAddr:";
const sessionPrefix = "session:";
const basicOptions = ["apiKey", "solution", "context"];
const ipAddrCreatorOption = `${ipAddrPrefix}...`;
const sessionCreatorOption = `${sessionPrefix}...`;
const allInitialOptions = [...basicOptions, ipAddrCreatorOption, sessionCreatorOption];

export function ApiScopesEditor(props: ApiScopesEditorProps) {
    const { t } = useI18n("components.apiScopesEditor");
    const propsOnChange = props.onChange;
    const [value, setValue] = useState<string[]>(props.value ?? []);
    const [options, setOptions] = useState<string[]>(allInitialOptions);
    const [promptModalContentProps, setPromptModalContentProps] = useState<PromptModalProps | null>(null);
    const handleChange = useCallback(
        (newValue: string[]) => {
            let filteredValue = newValue.filter((v) => v !== ipAddrCreatorOption && v !== sessionCreatorOption);
            const creatorType = newValue.includes(ipAddrCreatorOption)
                ? ipAddrCreatorOption
                : newValue.includes(sessionCreatorOption)
                  ? sessionCreatorOption
                  : null;
            if (creatorType !== null) {
                const prefix = creatorType === ipAddrCreatorOption ? ipAddrPrefix : sessionPrefix;
                setPromptModalContentProps({
                    title: creatorType === ipAddrCreatorOption ? t("ipAddrPromptModal.title") : t("sessionPromptModal.title"),
                    inputPlaceholder: creatorType === ipAddrCreatorOption ? t("ipAddrPromptModal.placeholder") : t("sessionPromptModal.placeholder"),
                    isOpened: true,
                    onResult: (result) => {
                        if (result.result === "submitted") {
                            const newOptionValue = `${prefix}${result.value}`;
                            setOptions((prevOptions) => {
                                if (options.includes(newOptionValue)) {
                                    return prevOptions;
                                }
                                return [
                                    ...prevOptions.filter((v) => v !== ipAddrCreatorOption && v !== sessionCreatorOption),
                                    newOptionValue,
                                    ipAddrCreatorOption,
                                    sessionCreatorOption,
                                ];
                            });
                            filteredValue = filteredValue.filter((v) => v !== newOptionValue);
                            setValue([...filteredValue, newOptionValue]);
                            propsOnChange?.([...filteredValue, newOptionValue]);
                        }
                        setPromptModalContentProps(null);
                    },
                });
            }
            setValue(filteredValue);
            propsOnChange?.(filteredValue);
        },
        [propsOnChange, t, options],
    );
    const multiSelectOptions: MultiSelectOption[] = useMemo(
        () =>
            options.map((option) => ({
                value: option,
                label: option,
            })),
        [options],
    );

    return (
        <>
            <MultiSelect
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...props}
                value={value}
                onChange={handleChange}
                options={multiSelectOptions}
            />
            {promptModalContentProps === null ? null : (
                // eslint-disable-next-line react/jsx-props-no-spreading
                <PromptModal {...promptModalContentProps} />
            )}
        </>
    );
}
