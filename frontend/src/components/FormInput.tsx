import { Input } from "@nextui-org/react";
import { FieldErrors, UseFormRegister } from "react-hook-form";

interface FormInputProps {
  name: string;
	label?: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  errors: FieldErrors;
  placeholder: string;
	maxLength: number;
	defaultValue?: string;
}

export default function FormInput({
  name,
  register,
  errors,
  placeholder,
	maxLength,
	label
}: FormInputProps) {

  return (
		<Input
			id={name}
      isClearable
      isRequired
      placeholder={placeholder}
			label={label}
      {...register(name, {
        required: `${name} is required`,
        maxLength: { value: maxLength, message: `${name} is too long` },
      })}
			errorMessage={errors[name]?.message as string}
			isInvalid={!!errors[name]}
    />
  );
}
