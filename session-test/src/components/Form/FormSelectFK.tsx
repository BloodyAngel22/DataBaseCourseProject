import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { useState, useEffect } from "react";
import { UseFormRegister } from "react-hook-form";

interface FormSelectProps {
  label: string;
  data: Promise<{ id: string; label: string }[]>;
  name: string;
  defaultSelectedValue?: string | null; // ФИО
  setValue: (value: string) => void; // Функция для записи ФИО в форму
  register: UseFormRegister<any>;
  errors: any;
  required?: boolean;
}

export default function FormSelect({
  label,
  data,
  name,
  defaultSelectedValue,
  setValue,
  register,
  errors,
  required,
}: FormSelectProps) {
  const [resolvedData, setResolvedData] = useState<{ id: string; label: string }[]>([]);
  const [selectedKey, setSelectedKey] = useState<string | null>(defaultSelectedValue || null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await data;
      setResolvedData(result);

      // Установка значения по умолчанию
      if (defaultSelectedValue) {
        const defaultItem = result.find((item) => item.label === defaultSelectedValue);
        if (defaultItem) {
          setSelectedKey(defaultItem.label); // Сохраняем выбранное ФИО
          setValue(defaultItem.label); // Устанавливаем ФИО в форму
        }
      }
    };
    fetchData();
  }, [defaultSelectedValue, data, setValue]);

  const handleSelectionChange = (key: string | null) => {
    setSelectedKey(key);
    setValue(key || ""); // Устанавливаем ФИО в форму
  };

  return (
    <div>
      <Autocomplete
        label={label}
        defaultItems={resolvedData.map((item) => ({
          key: item.label,
          label: item.label,
        }))}
        selectedKey={selectedKey}
        onSelectionChange={(key) => handleSelectionChange(key as string | null)}
        isInvalid={!!errors[name]?.message}
        errorMessage={errors[name]?.message as string}
        {...register(name, { required: required ? `${label} is required` : undefined })}
      >
        {(item) => (
          <AutocompleteItem key={item.key} value={item.label}>
            {item.label}
          </AutocompleteItem>
        )}
      </Autocomplete>
    </div>
  );
}
