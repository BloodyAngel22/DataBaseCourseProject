import { DateInput } from "@nextui-org/react";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { CalendarDateTime, parseDateTime } from "@internationalized/date";
import { useState, useEffect } from "react";

interface FormDateTimeProps {
  label?: string;
  name: string;
  register: UseFormRegister<any>;
  errors: any;
  setValue: UseFormSetValue<any>;
  value?: string;
  maxDate?: Date;
  required?: boolean;
}

export default function FormDateTime({
  name,
  register,
  errors,
  setValue,
  value: initialDate,
  maxDate,
  label,
  required,
}: FormDateTimeProps) {
  const [localValue, setLocalValue] = useState<CalendarDateTime | null>(
    initialDate ? parseDateTime(initialDate) : null
  );

  const isDateRange = (date: CalendarDateTime | null): boolean => {
    if (!date) return false;

    const valueDate = new Date(
      date.year,
      date.month - 1,
      date.day,
      date.hour || 0,
      date.minute || 0
    );

    const maxAllowedDate = maxDate || new Date();
    return (
      valueDate >= new Date(1900, 0, 1) && valueDate <= maxAllowedDate
    );
  };

  // Обновляем локальное состояние при изменении initialDate
  useEffect(() => {
    if (initialDate) {
      const parsedDate = parseDateTime(initialDate);
      setLocalValue(parsedDate);
      setValue(name, initialDate, { shouldValidate: true });
    } else {
      setLocalValue(null);
    }
  }, [initialDate, name, setValue]);

  // Регистрируем поле в react-hook-form
  useEffect(() => {
    register(name, {
      validate: (value) => {
        if (!value && !required) return true;
        if (required && !value) return "Date is required";

        try {
          const parsedDate = value ? parseDateTime(value) : null;
          if (!parsedDate) return "Invalid date format";
          if (!isDateRange(parsedDate))
            return (
              "Date must be between 1900 and " +
              (maxDate ? maxDate.toLocaleDateString() : "today")
            );
          return true;
        } catch (error) {
          return "Invalid date format";
        }
      },
    });
  }, [name, register, required, isDateRange, maxDate]);

  const handleChange = (newValue: CalendarDateTime | null) => {
    setLocalValue(newValue);
    setValue(name, newValue?.toString() || "", { shouldValidate: true });
  };

  return (
    <DateInput
      granularity="minute"
      hideTimeZone
      label={label ? label : name}
      isInvalid={!!errors[name]}
      errorMessage={errors[name]?.message}
      value={localValue}
      onChange={handleChange}
    />
  );
}
