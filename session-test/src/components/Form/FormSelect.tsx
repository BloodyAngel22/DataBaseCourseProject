import {
  Autocomplete,
  AutocompleteItem,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";

interface FormSelectProps {
  label: string;
  data: Promise<any[]> | any[];
  name: string;
  register: UseFormRegister<any>;
  errors: any;
  defaultSelectedValue?: string;
	setValue?: any;
	required?: boolean;
}

export default function FormSelect({
  label,
  data,
  register,
  errors,
  name,
  defaultSelectedValue,
	setValue,
	required,
}: FormSelectProps) {
  const [resolvedData, setResolvedData] = useState<any[]>([]);
  const [selectedKey, setSelectedKey] = useState<string | undefined>(
    defaultSelectedValue
  );

  useEffect(() => {
    const fetchData = async () => {
      const result = await data;
      setResolvedData(result);
      if (defaultSelectedValue && result.includes(defaultSelectedValue)) {
        setSelectedKey(defaultSelectedValue);
        setValue(name, defaultSelectedValue);
      }
    };
    fetchData();
  }, [defaultSelectedValue]);

  return (
    <>
			<Autocomplete
        label={label}
        defaultItems={resolvedData.map((item) => ({
          key: item,
          label: item,
				}))}
        {...register(name, { required: required ? `${label} is required` : undefined })}
        isInvalid={!!errors[name]?.message}
        errorMessage={errors[name]?.message as string}
        selectedKey={selectedKey}
        onSelectionChange={(key) => setSelectedKey(key as string)}
      >
        {(item) => (
          <AutocompleteItem key={item.key} value={item.label}>
            {item.label}
          </AutocompleteItem>
        )}
      </Autocomplete>
    </>
  );
}
