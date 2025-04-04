import PostComposer from "@/components/post-composer"
import { ModeToggle } from "@/components/mode-toggle"
import TwitterProfile from "./components/TwitterProfile"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="container flex items-center justify-between py-4">
        <h1 className="text-2xl font-bold">TweeThreads Poster</h1>
        <ModeToggle />
      </header>
      <main className="container px-4 py-8">
        <div className="mb-8">
          <TwitterProfile />
        </div>
        <div className="flex justify-center">
          <div className="w-full max-w-xl">
            <PostComposer />
          </div>
        </div>
      </main>
    </div>
  )
}