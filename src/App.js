import React, { useMemo, useState } from "react";
import { TrendingUp, BarChart3, Info, CalendarDays } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

// --- Data Configuration ---

const INR = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

const RAW = [
  {
    key: "2025-08",
    label: "Aug",
    month: "August",
    gmvCr: 0.8,
    note: "Foundational setup, early traction, key integrations live.",
  },
  {
    key: "2025-09",
    label: "Sep",
    month: "September",
    gmvCr: 1.5,
    note: "UX revamp + targeted brand mix → strong MoM lift.",
  },
  {
    key: "2025-10",
    label: "Oct (TD)",
    month: "October (to date)",
    gmvCr: 2.1,
    note: "Stable momentum, expanding GMV and repeat usage.",
  },
];

function calculateGrowth(prev, curr) {
  if (!prev) return null;
  return ((curr - prev) / prev) * 100;
}

// --- Main Component ---

export default function App() {
  const [mode, setMode] = useState("line");
  const [active, setActive] = useState(RAW[2]); // Default to latest month

  const data = useMemo(
    () =>
      RAW.map((d, i) => ({
        ...d,
        gmv: d.gmvCr * 1_00_00_000,
        momPct: calculateGrowth(i > 0 ? RAW[i - 1].gmvCr : null, d.gmvCr),
      })),
    []
  );

  const maxGmv = Math.max(...data.map((d) => d.gmv));
  const yAxisDomain = [0, Math.ceil(maxGmv / 1_00_00_000) * 1_00_00_000];
  const yTickFormat = (v) =>
    v >= 1_00_00_000 ? `${(v / 1_00_00_000).toFixed(1)} Cr` : INR.format(v);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* --- Header --- */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Zavo Gift Card Growth
          </h1>
          <p className="text-sm text-zavo-muted mt-1">
            3-Month GMV Snapshot (Aug 2025 - Oct 2025)
          </p>
        </div>
        <div className="flex items-center gap-2" role="tablist" aria-label="Chart view">
          <ChartToggleButton
            label="Line"
            icon={<TrendingUp className="h-4 w-4" />}
            isActive={mode === "line"}
            onClick={() => setMode("line")}
          />
          <ChartToggleButton
            label="Bar"
            icon={<BarChart3 className="h-4 w-4" />}
            isActive={mode === "bar"}
            onClick={() => setMode("bar")}
          />
        </div>
      </header>

      {/* --- KPI Cards --- */}
      <section className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {data.map((d) => (
          <KpiCard
            key={d.key}
            data={d}
            isActive={active.key === d.key}
            onClick={() => setActive(d)}
          />
        ))}
      </section>

      {/* --- Chart --- */}
      <section className="mt-6 rounded-2xl border border-zavo-border bg-zavo-card p-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-white">GMV Trend (₹)</h2>
          <span className="text-xs text-zavo-muted inline-flex items-center gap-1.5">
            <Info className="h-3 w-3" /> Click cards to focus
          </span>
        </div>
        <div className="h-80 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            {mode === "line" ? (
              <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                <XAxis dataKey="label" tick={{ fill: '#a7adb2' }} fontSize={12} />
                <YAxis
                  tickFormatter={yTickFormat}
                  domain={yAxisDomain}
                  tick={{ fill: '#a7adb2' }}
                  fontSize={12}
                />
                <Tooltip
                  formatter={(val) => INR.format(val)}
                  labelFormatter={(l) => `Month: ${l}`}
                  cursor={{ stroke: '#ff7a00', strokeWidth: 1, strokeDasharray: '3 3' }}
                />
                <ReferenceLine x={active.label} stroke="#ff7a00" strokeDasharray="4 2" />
                <Line
                  type="monotone"
                  dataKey="gmv"
                  stroke="#ff7a00"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#ff7a00' }}
                  activeDot={{ r: 8, stroke: '#0b0b0b', strokeWidth: 2 }}
                />
              </LineChart>
            ) : (
              <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                <XAxis dataKey="label" tick={{ fill: '#a7adb2' }} fontSize={12} />
                <YAxis
                  tickFormatter={yTickFormat}
                  domain={yAxisDomain}
                  tick={{ fill: '#a7adb2' }}
                  fontSize={12}
                />
                <Tooltip
                  formatter={(val) => INR.format(val)}
                  labelFormatter={(l) => `Month: ${l}`}
                  cursor={{ fill: 'rgba(255, 122, 0, 0.1)' }}
                />
                <ReferenceLine x={active.label} stroke="#ff7a00" strokeDasharray="4 2" />
                <Bar dataKey="gmv" radius={[8, 8, 0, 0]} fill="#ff7a00" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </section>

      {/* --- Detail Panel --- */}
      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        <DetailCard label="Selected Month" value={active.month} />
        <DetailCard
          label="Month-over-Month Growth"
          value={
            active.momPct == null
              ? "—"
              : `${active.momPct > 0 ? "+" : ""}${active.momPct.toFixed(1)}%`
          }
          subvalue={active.momPct == null ? "Base month" : "vs previous month"}
        />
        <DetailCard label="Analyst Notes" value={active.note} isNote={true} />
      </section>
    </div>
  );
}

// --- Sub-Components ---

function ChartToggleButton({ label, icon, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      role="tab"
      aria-selected={isActive}
      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 ${
        isActive
          ? "bg-zavo-orange text-black shadow-lg"
          : "bg-zavo-card text-zavo-muted hover:bg-zavo-border"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function KpiCard({ data, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`text-left rounded-2xl border bg-zavo-card p-5 shadow-lg transition-all duration-200 ${
        isActive
          ? "border-zavo-orange ring-2 ring-zavo-orange/50"
          : "border-zavo-border hover:border-gray-800"
      }`}
      aria-current={isActive ? "true" : "false"}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-zavo-muted inline-flex items-center gap-1.5">
          <CalendarDays className="h-4 w-4" />
          {data.month}
        </span>
        {data.momPct == null ? (
          <span className="text-xs font-medium text-zavo-muted px-2 py-0.5 rounded-full bg-zavo-border">
            BASE
          </span>
        ) : (
          <span className="text-xs font-medium text-green-400">
            {data.momPct > 0 ? "+" : ""}
            {data.momPct.toFixed(1)}%
          </span>
        )}
      </div>
      <div className="mt-2 text-2xl font-bold text-white">{data.gmvCr.toFixed(2)} Cr</div>
      <p className="mt-3 text-xs text-zavo-muted leading-relaxed line-clamp-2">{data.note}</p>
    </button>
  );
}

function DetailCard({ label, value, subvalue, isNote = false }) {
  return (
    <div className="rounded-2xl border border-zavo-border bg-zavo-card p-5">
      <div className="text-xs font-medium text-zavo-muted">{label}</div>
      <div className={`mt-1 font-semibold ${isNote ? 'text-sm text-zavo-text' : 'text-xl text-white'}`}>
        {value}
      </div>
      {subvalue && (
        <div className="mt-1 text-xs text-zavo-muted">{subvalue}</div>
      )}
    </div>
  );
}
