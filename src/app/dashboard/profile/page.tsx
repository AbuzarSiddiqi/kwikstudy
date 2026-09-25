import { requireUser } from "@/lib/session";
import { db } from "@/lib/db";
import { ProfileForm, PasswordForm } from "@/components/ProfileForms";
import { formatDate } from "@/lib/site";
import { ShieldCheck } from "@/components/Icons";

export default async function ProfilePage() {
  const user = await requireUser();
  const enrolled = db.prepare("SELECT COUNT(*) n FROM enrollments WHERE user_id = ?").get(user.id) as { n: number };
  const certs = db.prepare("SELECT COUNT(*) n FROM certificates WHERE user_id = ?").get(user.id) as { n: number };

  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-8">
        <h1 className="font-display text-[1.65rem] font-bold tracking-tight sm:text-[1.9rem]">Profile</h1>
        <p className="mt-1 text-[0.9rem] text-ink-500">Your account details, since {formatDate(user.created_at)}.</p>
      </header>

      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ["Member since", formatDate(user.created_at)],
            ["Active enrollments", String(enrolled.n)],
            ["Certificates", String(certs.n)],
          ].map(([l, v]) => (
            <div key={l} className="card p-5">
              <p className="font-mono text-[0.66rem] uppercase tracking-wider text-ink-400">{l}</p>
              <p className="mt-1 font-display text-[1.15rem] font-bold tabular">{v}</p>
            </div>
          ))}
        </div>

        <ProfileForm name={user.name} phone={user.phone} email={user.email} />
        <PasswordForm />

        <div className="card flex items-start gap-3.5 p-6">
          <ShieldCheck width={19} height={19} className="mt-0.5 shrink-0 text-moss-600" />
          <div>
            <h2 className="font-display text-[0.95rem] font-semibold">Account security</h2>
            <p className="mt-1 text-[0.85rem] leading-relaxed text-ink-500">
              Sessions sign you in for 30 days per device. Signing out ends the session on that device only. If you
              suspect unauthorised access, change your password above and write to support@kwikstudy.in.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
