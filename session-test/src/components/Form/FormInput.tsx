import { Input } from "@nextui-org/react";
import { UseFormRegister } from "react-hook-form";

interface FormInputProps {
  register: UseFormRegister<any>;
  errors: any;
  name: string;
  label?: string;
  maxLength?: number;
  min?: number;
  max?: number;
  type: string;
  required?: boolean;
	setValue?: any;
	regex?: RegExp;
}

export default function FormInput({
  register,
  errors,
  name,
  maxLength,
  min,
  max,
  type,
  label,
  required,
  setValue,
	regex,
}: FormInputProps) {
  return (
    <>
      <Input
        // isClearable
        type={type}
        label={label ? label : name}
        errorMessage={errors[name]?.message}
				{...register(name, {
					pattern: {
						value: regex ?? /^\S+$/,
						message: `${name} is invalid`,
					},
					required: required ? `${name} is required` : undefined,
          maxLength: {
            value: maxLength ? maxLength : 100,
            message: `${name} must be less than ${
              maxLength ? maxLength : 100
            } characters`,
          },
          min: {
            value: min ? min : 0,
            message: `${name} must be greater than ${min ? min : 0}`,
          },
          max: {
            value: max ? max : 100,
            message: `${name} must be less than ${max ? max : 100}`,
					},
        })}
        isInvalid={!!errors[name]?.message}
        value={setValue ? setValue(name) : undefined}
      />
    </>
  );
}
