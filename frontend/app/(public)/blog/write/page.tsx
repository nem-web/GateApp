import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import WriteForm from "./WriteForm";
import Link from "next/link";
import { ArrowLeft, PenSquare } from "lucide-react";

export default async function WriteBlogPage() {
  // 1. Auth Check
  const session = await getServerSession();
  
  if (!session?.user?.email) {
    redirect("/api/auth/signin"); 
  }

  // 2. Get User ID from DB
  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, name: true }
  });

  if (!dbUser) {
    redirect("/api/auth/signin");
  }

  // 3. Render the UI
  return (
    <div className="min-h-screen bg-[#0e0f14] text-gray-100 flex flex-col font-sans selection:bg-blue-500/30">
      {/* Background ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <main className="relative z-10 mx-auto w-full max-w-5xl flex-1 px-4 py-10 md:py-14">
        
        <Link 
          href="/blog" 
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-400 transition-colors hover:text-blue-400"
        >
          <ArrowLeft size={16} /> Back to Community
        </Link>

        <header className="mb-8 flex items-center gap-4 border-b border-gray-800/60 pb-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-inner">
            <PenSquare size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
              Write a Post
            </h1>
            <p className="mt-1 text-gray-400">
              Share your GATE preparation strategies and notes. Posting as <span className="font-semibold text-blue-400">{dbUser.name || session.user.email}</span>.
            </p>
          </div>
        </header>

        {/* Form Container */}
        <div className="rounded-2xl border border-gray-800 bg-[#111216]/80 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
          <WriteForm authorId={dbUser.id} />
        </div>

      </main>
    </div>
  );
}