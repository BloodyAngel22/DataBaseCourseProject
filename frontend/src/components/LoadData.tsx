import { CircularProgress } from "@nextui-org/react";

export default function LoadData() {
	return (
		<>
      <div className="w-full h-screen flex items-center justify-center">
        <CircularProgress className='scale-150' color="success" label="Loading..." size="lg"/>
      </div>
		</>
	);
}