import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { CheckCircle2, CreditCard, Database, IndianRupee, ShieldCheck, UserCheck, Users } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ADMIN_ROLE } from "@/lib/admin-config";
import { authOptions } from "@/lib/auth";
import { getCurrentAdminUser } from "@/lib/admin-access";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function uploadRoot() {
  return process.env.LOCAL_UPLOAD_DIR ?? path.join(process.cwd(), ".local-uploads");
}

async function folderSizeBytes(dir: string): Promise<number> {
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    const sizes = await Promise.all(
      entries.map(async (entry) => {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) return folderSizeBytes(fullPath);
        if (!entry.isFile()) return 0;
        const info = await stat(fullPath);
        return info.size;
      }),
    );
    return sizes.reduce((sum, size) => sum + size, 0);
  } catch {
    return 0;
  }
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB", "TB"];
  let value = bytes / 1024;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(value >= 10 ? 1 : 2)} ${units[unitIndex]}`;
}

function formatDate(date: Date | null) {
  if (!date) return "Not set";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatCurrencyPaise(amountPaise: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amountPaise / 100);
}

async function approveUser(formData: FormData) {
  "use server";

  const admin = await getCurrentAdminUser();
  if (!admin) throw new Error("Admin access required.");

  const userId = String(formData.get("userId") ?? "");
  if (!userId) return;

  await prisma.user.update({
    where: { id: userId },
    data: {
      approved: true,
      approvedAt: new Date(),
    },
  });

  revalidatePath("/admin");
}

async function suspendUser(formData: FormData) {
  "use server";

  const admin = await getCurrentAdminUser();
  if (!admin) throw new Error("Admin access required.");

  const userId = String(formData.get("userId") ?? "");
  if (!userId || userId === admin.id) return;

  await prisma.user.update({
    where: { id: userId },
    data: {
      approved: false,
      approvedAt: null,
    },
  });

  revalidatePath("/admin");
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login?callbackUrl=/admin");

  const admin = await getCurrentAdminUser();
  if (!admin) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-3xl items-center px-4 py-8 lg:px-8">
        <Alert variant="destructive">
          <ShieldCheck />
          <AlertTitle>Admin access required</AlertTitle>
          <AlertDescription>
            This area is limited to the configured administrator account.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const users = await prisma.user.findMany({
    orderBy: [{ approved: "asc" }, { createdAt: "desc" }],
    include: {
      _count: {
        select: {
          tasks: true,
          notes: true,
          notePdfs: true,
          flashcards: true,
          lectures: true,
          pyqPapers: true,
          testAttempts: true,
          testPaperUploads: true,
          htmlGames: true,
        },
      },
    },
  });
  const [payments, subscriptions] = await Promise.all([
    prisma.paymentHistory.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      include: { user: { select: { email: true, name: true } } },
    }),
    prisma.subscription.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      include: { user: { select: { email: true, name: true } } },
    }),
  ]);

  const storageByUser = new Map<string, number>();
  await Promise.all(
    users.map(async (user) => {
      storageByUser.set(user.id, await folderSizeBytes(path.join(uploadRoot(), user.id)));
    }),
  );

  const pendingCount = users.filter((user) => !user.approved && user.role !== ADMIN_ROLE).length;
  const approvedCount = users.filter((user) => user.approved || user.role === ADMIN_ROLE).length;
  const activePremiumCount = users.filter((user) => user.planType === "PREMIUM" && user.subscriptionStatus === "ACTIVE").length;
  const capturedRevenuePaise = payments
    .filter((payment) => payment.status === "CAPTURED")
    .reduce((sum, payment) => sum + payment.amountPaise, 0);
  const localStorageBytes = [...storageByUser.values()].reduce((sum, size) => sum + size, 0);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 lg:px-8 lg:py-8">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ShieldCheck />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Admin Panel</h1>
            <p className="text-sm text-muted-foreground">
              Review new users, approve accounts, and inspect storage-heavy activity.
            </p>
          </div>
        </div>
      </header>

      <div className="grid gap-3 md:grid-cols-5">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Users /> Total users
            </CardTitle>
            <CardDescription>Registered accounts including admin</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{users.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <UserCheck /> Pending review
            </CardTitle>
            <CardDescription>New accounts waiting for upload approval</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{pendingCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Database /> Local uploads
            </CardTitle>
            <CardDescription>Files stored under the configured local upload folder</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{formatBytes(localStorageBytes)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <CreditCard /> Active plans
            </CardTitle>
            <CardDescription>Premium subscriptions marked active</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{activePremiumCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <IndianRupee /> Revenue
            </CardTitle>
            <CardDescription>Captured payment total in local records</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{formatCurrencyPaise(capturedRevenuePaise)}</p>
          </CardContent>
        </Card>
      </div>

      <Alert>
        <CheckCircle2 />
        <AlertTitle>Approval policy</AlertTitle>
        <AlertDescription>
          Existing accounts are approved by migration. Accounts created after this change stay pending until approved here; pending users cannot upload PDFs or workbooks.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>User review</CardTitle>
          <CardDescription>
            {approvedCount} approved, {pendingCount} pending. Counts show the main user-owned content areas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Profile</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Local storage</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const isAdmin = user.role === ADMIN_ROLE;
                const approved = user.approved || isAdmin;
                const counts = user._count;
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex max-w-[220px] flex-col gap-1">
                        <span className="truncate font-medium">{user.name || "Unnamed"}</span>
                        <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge variant={approved ? "default" : "secondary"}>
                          {isAdmin ? "Admin" : approved ? "Approved" : "Pending"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {approved ? `Approved ${formatDate(user.approvedAt)}` : "Uploads locked"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                        <span>{user.branch} / {user.streamLabel}</span>
                        <span>Gate: {user.gateDate ? formatDate(user.gateDate) : "Not set"}</span>
                        <span>{user.hoursPerDay}h/day target</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="grid min-w-[180px] grid-cols-2 gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <span>Tasks {counts.tasks}</span>
                        <span>Notes {counts.notes}</span>
                        <span>PDFs {counts.notePdfs}</span>
                        <span>PYQ {counts.pyqPapers}</span>
                        <span>Tests {counts.testAttempts}</span>
                        <span>Uploads {counts.testPaperUploads}</span>
                        <span>Cards {counts.flashcards}</span>
                        <span>Games {counts.htmlGames}</span>
                      </div>
                    </TableCell>
                    <TableCell>{formatBytes(storageByUser.get(user.id) ?? 0)}</TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      {isAdmin ? (
                        <Badge variant="outline">Protected</Badge>
                      ) : approved ? (
                        <form action={suspendUser}>
                          <input type="hidden" name="userId" value={user.id} />
                          <Button type="submit" variant="outline" size="sm">
                            Suspend uploads
                          </Button>
                        </form>
                      ) : (
                        <form action={approveUser}>
                          <input type="hidden" name="userId" value={user.id} />
                          <Button type="submit" size="sm">
                            Approve
                          </Button>
                        </form>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subscription management</CardTitle>
          <CardDescription>
            Active plans, renewals, Razorpay identifiers, and cancellation/refund workflow context.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Razorpay reference</TableHead>
                <TableHead>Renewal / expiry</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.map((subscription) => (
                <TableRow key={subscription.id}>
                  <TableCell>
                    <div className="flex max-w-[220px] flex-col gap-1">
                      <span className="truncate font-medium">{subscription.user.name || "Unnamed"}</span>
                      <span className="truncate text-xs text-muted-foreground">{subscription.user.email}</span>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant={subscription.status === "ACTIVE" ? "default" : "secondary"}>{subscription.status}</Badge></TableCell>
                  <TableCell className="font-mono text-xs">{subscription.razorpaySubscriptionId ?? subscription.razorpayOrderId ?? subscription.id}</TableCell>
                  <TableCell>{formatDate(subscription.renewalDate ?? subscription.expiryDate)}</TableCell>
                  <TableCell>{formatCurrencyPaise(subscription.amountPaise)}</TableCell>
                </TableRow>
              ))}
              {subscriptions.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-muted-foreground">No subscription records yet.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment visibility and refund workflow</CardTitle>
          <CardDescription>
            Use Razorpay payment ids and order/subscription ids here when initiating refunds in Razorpay. Webhooks update refunded status when configured.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Created / paid</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <div className="flex max-w-[220px] flex-col gap-1">
                      <span className="truncate font-medium">{payment.user.name || "Unnamed"}</span>
                      <span className="truncate text-xs text-muted-foreground">{payment.user.email}</span>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant={payment.status === "CAPTURED" ? "default" : "secondary"}>{payment.status}</Badge></TableCell>
                  <TableCell className="font-mono text-xs">{payment.razorpayPaymentId ?? payment.razorpayOrderId ?? payment.id}</TableCell>
                  <TableCell>{formatDate(payment.paidAt ?? payment.createdAt)}</TableCell>
                  <TableCell className="text-right">{formatCurrencyPaise(payment.amountPaise)}</TableCell>
                </TableRow>
              ))}
              {payments.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-muted-foreground">No payment records yet.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
