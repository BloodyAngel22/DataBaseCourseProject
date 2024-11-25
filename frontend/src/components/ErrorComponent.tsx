interface ErrorComponentProps {
	error: string;
	pageName?: string;
}

export default function ErrorComponent({ error, pageName } : ErrorComponentProps) {
  return (
    <div>
			<h1>{pageName}</h1>
      <h2>Error: {error}</h2>
    </div>
  );
}