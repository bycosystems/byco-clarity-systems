import { CheckCircle2, Clock, AlertCircle, TrendingUp, Users, ClipboardList } from "lucide-react";

export function DashboardMockup() {
  return (
    <div className="relative rounded-2xl bg-white shadow-elevated border border-border overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/60">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-[oklch(0.78_0.13_25)]" />
          <span className="size-2.5 rounded-full bg-[oklch(0.85_0.13_85)]" />
          <span className="size-2.5 rounded-full bg-[oklch(0.78_0.13_145)]" />
        </div>
        <div className="ml-3 text-xs text-muted-foreground font-medium">ReadyFlow Manager · Operations</div>
      </div>

      <div className="grid grid-cols-12 gap-4 p-5">
        {/* Sidebar */}
        <div className="col-span-3 hidden md:flex flex-col gap-1 text-xs">
          {["Overview", "Tasks", "Units", "Team", "Requests", "Reports"].map((item, i) => (
            <div
              key={item}
              className={`px-3 py-2 rounded-md ${i === 0 ? "bg-brand/10 text-navy-deep font-semibold" : "text-muted-foreground"}`}
            >
              {item}
            </div>
          ))}
        </div>

        {/* Main */}
        <div className="col-span-12 md:col-span-9 flex flex-col gap-4">
          {/* KPI cards */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Open tasks", value: "24", icon: ClipboardList },
              { label: "In progress", value: "12", icon: Clock },
              { label: "Completed", value: "186", icon: CheckCircle2 },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="rounded-lg border border-border p-3 bg-white">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
                  <Icon className="size-3.5 text-brand" />
                </div>
                <div className="mt-1 text-xl font-semibold text-navy-deep">{value}</div>
              </div>
            ))}
          </div>

          {/* Chart placeholder */}
          <div className="rounded-lg border border-border p-4 bg-white">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-xs text-muted-foreground">Workflow throughput</div>
                <div className="text-sm font-semibold text-navy-deep">Last 14 days</div>
              </div>
              <TrendingUp className="size-4 text-brand" />
            </div>
            <div className="flex items-end gap-1.5 h-20">
              {[40, 55, 35, 60, 48, 72, 58, 80, 65, 90, 70, 85, 78, 95].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm bg-gradient-to-t from-brand/30 to-brand"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>

          {/* Task list */}
          <div className="rounded-lg border border-border bg-white">
            <div className="px-4 py-2 border-b border-border flex items-center justify-between">
              <span className="text-xs font-semibold text-navy-deep">Active requests</span>
              <Users className="size-3.5 text-muted-foreground" />
            </div>
            <ul className="divide-y divide-border text-xs">
              {[
                { title: "Unit 204 — turnover prep", status: "In progress", color: "text-[oklch(0.55_0.15_250)]", icon: Clock },
                { title: "Maintenance · plumbing", status: "Assigned", color: "text-[oklch(0.55_0.12_85)]", icon: AlertCircle },
                { title: "Cleaning route · downtown", status: "Done", color: "text-[oklch(0.5_0.13_145)]", icon: CheckCircle2 },
              ].map(({ title, status, color, icon: Icon }) => (
                <li key={title} className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-foreground">{title}</span>
                  <span className={`flex items-center gap-1.5 ${color} font-medium`}>
                    <Icon className="size-3.5" /> {status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
