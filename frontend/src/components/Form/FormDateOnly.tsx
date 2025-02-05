import { DateInput } from "@nextui-org/react";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { CalendarDate, parseDate } from "@internationalized/date";
import { useState, useEffect } from "react";

interface FormDateOnlyProps {
  name: string;
  label: string;
  register: UseFormRegister<any>;
  errors: any;
  setValue: UseFormSetValue<any>;
  value?: string;
  maxDate?: Date;
  required?: boolean;
}

export default function FormDateOnly({
  name,
  label,
  register,
  errors,
  setValue,
  value: externalValue,
  maxDate,
  required,
}: FormDateOnlyProps) {
  const [localValue, setLocalValue] = useState<CalendarDate | null>(
    externalValue ? parseDate(externalValue) : null
  );

  useEffect(() => {
    if (externalValue) {
      const parsedDate = parseDate(externalValue);
      if (parsedDate?.toString() !== localValue?.toString()) {
        setLocalValue(parsedDate);
      }
    }
  }, [externalValue]);

	useEffect(() => {
  register(name, {
    validate: (val) => {
      if (!val && !required) return true;

      if (required && !val) return "Date is required";

      const parsedDate = val ? parseDate(val) : null;
      const valueDate = parsedDate
        ? new Date(parsedDate.year, parsedDate.month - 1, parsedDate.day)
        : null;
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0); // Обнуляем время

      if (!parsedDate) return "Invalid date format";
      if (parsedDate.year < 1900) return "Year must be after 1900";
      if (maxDate && valueDate && valueDate > maxDate) return "Date exceeds max range";
      // if (valueDate && valueDate > currentDate) return "Date cannot be in the future";

      return true;
    },
  });
}, [name, register, required, maxDate]);


  const handleChange = (newValue: CalendarDate | null) => {
    setLocalValue(newValue);
    setValue(name, newValue?.toString() || "", { shouldValidate: true });
  };

  return (
    <DateInput
      hideTimeZone
      label={label}
      isInvalid={!!errors[name]}
      errorMessage={errors[name]?.message}
      value={localValue}
      onChange={handleChange}
    />
  );
}
