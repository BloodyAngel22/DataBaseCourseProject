import { Input } from "@nextui-org/react";
import { useState } from "react";
import { UseFormRegister } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface FormPasswordInputProps {
  register: UseFormRegister<any>;
  errors: any;
  name: string;
  label?: string;
  maxLength?: number;
  required?: boolean;
  regex?: RegExp;
}

export default function FormPasswordInput({
  register,
  errors,
  name,
  maxLength,
  label,
  required,
  regex,
}: FormPasswordInputProps) {
	const [showPassword, setShowPassword] = useState(false);
	const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <>
      <Input
        type={showPassword ? "text" : "password"}
        label={label ? label : name}
        errorMessage={errors[name]?.message}
        {...register(name, {
          required: required ? `${name} is required` : undefined,
          maxLength: {
            value: maxLength ? maxLength : 100,
            message: `${name} must be less than ${
              maxLength ? maxLength : 100
            } characters`,
					},
					pattern: {
						value: regex ?? /^\S+$/,
						message: `${name} is invalid`,
					}
        })}
				isInvalid={!!errors[name]?.message}
				endContent={
					<button type="button" onClick={toggleShowPassword} className="focus:outline-none">
						{showPassword ? <FaEye className="text-lg"/> : <FaEyeSlash className="text-lg"/>}
					</button>
				}
      />
    </>
  );
}
