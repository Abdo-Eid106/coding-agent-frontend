import type { SubmitEvent } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import type { AddProviderDto, ProviderDto } from "../types";

export interface UseProviderFormOptions {
  initialData?: ProviderDto | null;
  onSubmit: (data: AddProviderDto) => void;
}

const DEFAULT_MODEL = { id: "", displayName: "" };
const DEFAULT_VALUES = {
  id: "",
  displayName: "",
  baseUrl: "",
  apiKey: "",
  models: [DEFAULT_MODEL],
};

const trimValues = (values: AddProviderDto): AddProviderDto => ({
  id: values.id.trim(),
  displayName: values.displayName.trim(),
  baseUrl: values.baseUrl.trim(),
  apiKey: values.apiKey.trim(),
  models: values.models
    .map((m) => ({ id: m.id.trim(), displayName: m.displayName.trim() }))
    .filter((m) => m.id && m.displayName),
});

const toFormValues = (data?: ProviderDto | null): AddProviderDto =>
  data ? data : DEFAULT_VALUES;

export function useProviderForm({
  initialData,
  onSubmit,
}: UseProviderFormOptions) {
  const form = useForm<AddProviderDto>({
    defaultValues: toFormValues(initialData),
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "models",
  });

  const addModel = () => append(DEFAULT_MODEL);
  const removeModel = (index: number) =>
    fields.length > 1 ? remove(index) : replace([DEFAULT_MODEL]);

  const reset = (data?: ProviderDto) => form.reset(toFormValues(data));

  const handleFormSubmit = (e?: SubmitEvent<HTMLFormElement>) =>
    form.handleSubmit((values) => {
      onSubmit(trimValues(values));
    })(e);

  return {
    register: form.register,
    control: form.control,
    formState: form.formState,
    fields,
    addModel,
    removeModel,
    reset,
    handleFormSubmit,
  };
}

export default useProviderForm;
