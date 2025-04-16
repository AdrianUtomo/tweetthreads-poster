import PostComposer from "@/components/post-composer";
import { ModeToggle } from "@/components/mode-toggle";
import TwitterProfile from "./components/TwitterProfile";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="p-[2rem] flex items-center justify-between py-4">
				<h1 className="text-2xl font-bold">TweeThreads Poster</h1>
				<ModeToggle />
      </header>
      <main className="px-4 py-8">
				<TwitterProfile />
				<div className="flex justify-center">
					<div className="w-full max-w-xl">
							<PostComposer />
					</div>
				</div>
      </main>
    </div>
  );
}