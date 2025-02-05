import { Spinner } from "@nextui-org/react";

export default function LoadingSection() {
	return (
		<div className="w-full h-screen flex items-center justify-center">
			<Spinner className="scale-150" color="success" size="lg" label="Loading..." labelColor="success"/>
		</div>
	);
}