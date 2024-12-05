import { Input } from "@nextui-org/react";
import { UseFormRegister } from "react-hook-form";

interface FormInputProps {
	register: UseFormRegister<any>;
	errors: any;
	setValue?: any;
	name: string;
	label?: string;
	maxLength?: number;
	min?: number;
	max?: number;
	type: string;
}

export default function FormInput({ register, errors, setValue, name, maxLength, min, max, type, label }: FormInputProps) {
  return (
    <>
			<Input
				type={type}
        label={label ? label : name}
        errorMessage={errors[name]?.message}
        {...register(name, {
          required: `${name} is required`,
          maxLength: {
            value: maxLength ? maxLength : 100,
            message: `${name} must be less than ${maxLength ? maxLength : 100} characters`,
					},
					min: {
						value: min ? min : 0,
						message: `${name} must be greater than 0`,
					},
					max: {
						value: max ? max : 100,
						message: `${name} must be less than 100`,
					},
        })}
				value={setValue ? setValue(name) : undefined}
				isInvalid={!!errors[name]?.message}
      />
    </>
  );
}
