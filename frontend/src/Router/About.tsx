import FetchTestData from "../fetch/FetchTestData.js";

export default function About() {
  const { data, error, isLoading } = FetchTestData();

  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return (
      <>
        <h1>About page</h1>
        <h2>Error: {error.message}</h2>
      </>
    );
  }

  return (
    <>
      <h1>About Page</h1>
      {data?.map((post) => (
        <div key={post.id} className="flex flex-col bg-slate-200 mb-4">
          <h2 className="text-xl font-bold">{post.title}</h2>
          <p>{post.body}</p>
        </div>
      ))}
    </>
  );
}
