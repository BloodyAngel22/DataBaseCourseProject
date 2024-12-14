import { DateInput } from "@nextui-org/react";
import { UseFormRegister, UseFormWatch } from "react-hook-form";
import { CalendarDate, parseDate } from "@internationalized/date";
import { useEffect } from "react";

interface FormDateOnlyProps {
	name: string;
	label: string;
	register: UseFormRegister<any>;
	errors: any;
	setValue: any;
	watch: UseFormWatch<any>;
	value?: any;
	maxDate?: Date;
	required?: boolean;
}

export default function FormDateOnly({
	name,
	label,
	register,
	errors,
	setValue,
	watch,
	value: initialDate,
	maxDate,
	required,
}: FormDateOnlyProps) {
	const rawValue = watch(name) || initialDate;
	const value = rawValue ? parseDate(rawValue) : null;

	const isDateRange = (date: CalendarDate | null): boolean => {
		if (!date) return false;

		if (date.year < 1900) return false;

		const valueDate = new Date(date.year, date.month - 1, date.day);
		const currentDate = new Date();

		if (maxDate) {
			return valueDate <= maxDate;
		}

		return valueDate <= currentDate;
	};

	useEffect(() => {
		register(name, {
			validate: (value) => {
				if (!value && !required) return true;

				if (required && !value) return "Date is required";

				try {
					const parsedDate = value ? parseDate(value) : null;
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
	}, [name, register, required, initialDate, setValue, isDateRange]);

	return (
		<>
			<DateInput
				hideTimeZone
				label={label}
				isInvalid={!!errors[name]}
				errorMessage={errors[name]?.message}
				value={value}
				onChange={(value) =>
					setValue(name, value?.toString() || "", { shouldValidate: true })
				}
			/>
		</>
	);
}
