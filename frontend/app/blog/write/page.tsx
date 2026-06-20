import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PublicFooter } from "@/components/PublicFooter";
import { getServerSession } from "next-auth/next";
import WriteForm from "./WriteForm";

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
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 md:py-14">
        
        <header className="mb-8 border-b border-border pb-6">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Write a Community Post
          </h1>
          <p className="mt-2 text-muted-foreground">
            Share your GATE preparation strategies, notes, and experiences. Posting as <span className="font-medium text-foreground">{dbUser.name || session.user.email}</span>.
          </p>
        </header>

        {/* Load our advanced client-side form */}
        <WriteForm authorId={dbUser.id} />

      </main>
      <PublicFooter />
    </div>
  );
}