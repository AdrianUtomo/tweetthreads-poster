import PostInput from "./components/PostInput";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen max-h-screen font-[family-name:var(--font-geist-sans)]">
      <h1>TwitThread Poster</h1>
      {/* <TwitterLoginButton /> */}
      {/* <TwitterProfile /> */}
      <PostInput />
    </div>
  );
}
