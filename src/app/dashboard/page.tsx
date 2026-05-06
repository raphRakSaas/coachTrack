import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, CalendarCheck, TrendingUp, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

function startOfWeek() {
  const d = new Date();
  const diff = d.getDate() - d.getDay() + (d.getDay() === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfMonth() {
  const d = new Date();
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-zinc-500">
          Configuration du compte en cours...
        </p>
      </div>
    );
  }

  const [activeClients, sessionsThisWeek, sessionsThisMonth, recentSessions] =
    await Promise.all([
      prisma.client.count({ where: { coachId: user.id, isActive: true } }),
      prisma.session.count({
        where: { coachId: user.id, date: { gte: startOfWeek() } },
      }),
      prisma.session.count({
        where: { coachId: user.id, date: { gte: startOfMonth() } },
      }),
      prisma.session.findMany({
        where: { coachId: user.id },
        take: 5,
        orderBy: { date: "desc" },
        include: { client: { select: { firstName: true, lastName: true } } },
      }),
    ]);

  const stats = [
    {
      label: "Clients actifs",
      value: activeClients,
      icon: Users,
      href: "/dashboard/clients",
    },
    {
      label: "Séances cette semaine",
      value: sessionsThisWeek,
      icon: CalendarCheck,
      href: "/dashboard/sessions",
    },
    {
      label: "Séances ce mois",
      value: sessionsThisMonth,
      icon: TrendingUp,
      href: "/dashboard/sessions",
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Dashboard</h1>
          <p className="text-sm text-zinc-500">
            Bienvenue{user.name ? `, ${user.name}` : ""}
          </p>
        </div>
        <Link href="/dashboard/sessions/new" className={buttonVariants()}>
          <Plus className="h-4 w-4" />
          Nouvelle séance
        </Link>
      </div>

      <div className="mb-8 grid grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link key={label} href={href}>
            <Card className="transition-shadow hover:shadow-md cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-zinc-500">
                  {label}
                </CardTitle>
                <Icon className="h-4 w-4 text-zinc-400" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-zinc-900">{value}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold">
            Séances récentes
          </CardTitle>
          <Link href="/dashboard/sessions" className={buttonVariants({ variant: "ghost", size: "sm" })}>
            Voir tout
          </Link>
        </CardHeader>
        <CardContent>
          {recentSessions.length === 0 ? (
            <div className="flex flex-col items-center py-10 text-center">
              <CalendarCheck className="mb-3 h-10 w-10 text-zinc-300" />
              <p className="text-sm font-medium text-zinc-500">
                Aucune séance enregistrée
              </p>
              <p className="mt-1 text-xs text-zinc-400">
                Commencez par ajouter un client, puis créez sa première séance.
              </p>
              <Link href="/dashboard/clients" className={buttonVariants({ variant: "outline", size: "sm" }) + " mt-4"}>
                Ajouter un client
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-zinc-100">
              {recentSessions.map((s: (typeof recentSessions)[number]) => (
                <li
                  key={s.id}
                  className="flex items-center justify-between py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-zinc-900">
                      {s.client.firstName} {s.client.lastName}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {new Date(s.date).toLocaleDateString("fr-FR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                    </p>
                  </div>
                  {s.duration && (
                    <span className="text-xs text-zinc-400">
                      {s.duration} min
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
