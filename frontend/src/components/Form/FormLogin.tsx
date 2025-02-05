"use client";

import { useForm } from "react-hook-form";
import FormInput from "./FormInput";
import { Button } from "@nextui-org/react";
import FormPasswordInput from "./FormPasswordInput";
import { login } from "@/api/authApi";
import { useEffect } from "react";

export default function FormLogin() {
	const { register, handleSubmit, formState: { errors } } = useForm<{ username: string, password: string }>({
		defaultValues: {
			username: "",
			password: ""
		},
		mode: "onChange"
	});

	const onSubmit = handleSubmit(async (data) => {
		console.log(data);

		try {
			await login(data.username, data.password);
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
					<Button className="w-full mt-2" color="primary" variant="shadow" type="submit">Login</Button>
				</div>
			</form>
		</>
	);
}