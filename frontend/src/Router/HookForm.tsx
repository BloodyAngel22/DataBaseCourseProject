import { Button, Input } from "@nextui-org/react";
import { SubmitHandler, useForm } from "react-hook-form";

interface FormValues {
	name: string;
}

export default function HookForm() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormValues>();

	const onSubmit:SubmitHandler<FormValues> = (data) => {
		console.log('data:', data)
	}

	return (
		<>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="w-max">
					<label>Name</label>
					<Input label="Name" {...register('name', { required: 'Name is required' })}></Input>
					{errors.name && <p>{errors.name.message}</p>}
				</div>

				<Button className="mt-4" type='submit' color='primary'>Submit</Button>
			</form>
		</>
	);
}