import { DateInput } from "@nextui-org/react";
import { UseFormRegister, UseFormWatch } from "react-hook-form";
import { CalendarDate, CalendarDateTime, DateValue, parseDate, parseDateTime, Time } from "@internationalized/date";
import { useEffect } from "react";

interface FormDateOnlyProps {
  name: string;
  register: UseFormRegister<any>;
  errors: any;
  setValue: any;
	watch: UseFormWatch<any>;
	value?: any;
	maxDate?: Date;
}

export default function FormDateTime({ name, register, errors, setValue, watch, value: initialDate, maxDate }: FormDateOnlyProps) {
  const rawValue = watch(name) || initialDate;
  const value = rawValue ? parseDateTime(rawValue) : null;

  const isDateRange = (date: CalendarDateTime | null): boolean => {
    if (!date) return false;

    if (date.year < 1900) return false;

    const valueDate = new Date(date.year, date.month - 1, date.day, date.hour, date.minute);
    const currentDate = new Date();
		if (maxDate) {
			return valueDate <= maxDate;
		}

    return valueDate <= currentDate;
  };
	
	useEffect(() => {
    register(name, {
			validate: (value) => {
				if (!value) return "Date is required";
				try {
					const parsedDate = parseDateTime(value);
					if (!parsedDate) return "Invalid date format";
					if (!isDateRange(parsedDate)) return "Date must be between 1900 and today";
					return true;
				} catch (error) {
					return "Invalid date format";
				}
      },
		});
		if (initialDate) {
			setValue(name, initialDate, { shouldValidate: true });
		}
  }, [name, register]);

  return (
    <>
			<DateInput
				granularity='minute'
				hideTimeZone
				isRequired
        label={name}
        isInvalid={!!errors[name]}
        errorMessage={errors[name]?.message}
        value={value}
        onChange={(value) => setValue(name, value?.toString() || "", { shouldValidate: true })}
      />
    </>
  );
}
