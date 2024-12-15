import { useForm } from "react-hook-form";
import FormInput from "./FormInput";
import { Button } from "@nextui-org/react";
import FormPasswordInput from "./FormPasswordInput";
import { register as registerUser } from "@/api/authApi";

export default function FormRegister() {
	const { register, handleSubmit, formState: { errors } } = useForm<{ username: string, password: string, confirmPassword: string, email: string }>({
		defaultValues: {
			email: "",
			username: "",
			password: "",
			confirmPassword: ""
		},
		mode: "onChange"
	});

	const onSubmit = handleSubmit(async (data) => {
		if (data.password !== data.confirmPassword) {
			alert("Passwords do not match");
		}

		console.log(data);
		try {
			await registerUser(data.username, data.password, data.email);
			window.location.href = "/authenticated";
		} catch (error) {
			alert((error as Error).message);
		}
	});

	return (
		<>
			<form onSubmit={onSubmit}>
				<div className="flex flex-col gap-1">
					<FormInput
						register={register}
						errors={errors}
						maxLength={100}
						max={Infinity}
						name="email"
						label="Email"
						type="email"
						required
						regex={/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/}
					/>
					<FormInput
						register={register}
						errors={errors}
						maxLength={100}
						max={Infinity}
						name="username"
						label="Username"
						type="text"
						required
					/>
					<FormPasswordInput
						register={register}
						errors={errors}
						name="password"
						label="Password"
						maxLength={128}
						required
					/>
					<FormPasswordInput
						register={register}
						errors={errors}
						name="confirmPassword"
						label="Confirm Password"
						maxLength={128}
						required
					/>
					<Button className="w-full mt-2" color="primary" variant="shadow" type="submit">Register</Button>
				</div>
			</form>
		</>
	);
}