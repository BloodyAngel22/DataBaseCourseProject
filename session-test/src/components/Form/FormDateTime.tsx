import { DateInput } from "@nextui-org/react";
import { UseFormRegister, UseFormWatch } from "react-hook-form";
import { CalendarDateTime, parseDateTime } from "@internationalized/date";
import { useEffect } from "react";

interface FormDateOnlyProps {
  label?: string;
  name: string;
  register: UseFormRegister<any>;
  errors: any;
  setValue: any;
  watch: UseFormWatch<any>;
  value?: any;
  maxDate?: Date;
  required?: boolean;
}

export default function FormDateTime({ name, register, errors, setValue, watch, value: initialDate, maxDate, label, required }: FormDateOnlyProps) {
  const rawValue = watch(name) || initialDate;
  const value = rawValue ? parseDateTime(rawValue) : null;

  const isDateRange = (date: CalendarDateTime | null): boolean => {
    if (!date) return false;
    const valueDate = new Date(date.year, date.month - 1, date.day, date.hour || 0, date.minute || 0);
    const maxAllowedDate = maxDate || new Date();
    return valueDate >= new Date(1900, 0, 1) && valueDate <= maxAllowedDate;
  };

  useEffect(() => {
    register(name, {
      validate: (value) => {
        if (!value && !required) return true;
        if (required && !value) return "Date is required";

        try {
          const parsedDate = value ? parseDateTime(value) : null;
          if (!parsedDate) return "Invalid date format";
          if (!isDateRange(parsedDate)) return "Date must be between 1900 and " + (maxDate ? maxDate.toLocaleDateString() : "today");
          return true;
        } catch (error) {
          return "Invalid date format";
        }
      },
    });
    if (initialDate) {
      setValue(name, initialDate, { shouldValidate: true });
    }
  }, [name, register, required, setValue, initialDate]);

  return (
    <>
      <DateInput
        granularity="minute"
        hideTimeZone
        label={label ? label : name}
        isInvalid={!!errors[name]}
        errorMessage={errors[name]?.message}
        value={value}
        onChange={(newValue) => {
          setValue(name, newValue?.toString() || "", { shouldValidate: true });
        }}
      />
    </>
  );
}
