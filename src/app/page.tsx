import { ChatRoom } from "@/components/ChatRoom";
import SignIn from "@/components/sign-in";

export default function Home() {
  return (
    <main className="flex h-screen overflow-hidden items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="w-full max-w-2xl flex flex-col">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">Welcome to Chat Room</h1>
          <p className="text-muted-foreground text-sm">A real-time chat application built with Next.js, Shadcn UI, and Convex</p>
        </div>
        <SignIn />
        <ChatRoom />
      </div>
    </main>
  );
}
