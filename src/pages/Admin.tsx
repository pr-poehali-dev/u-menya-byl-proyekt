import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import Icon from "@/components/ui/icon";

const ADMIN_STATS_URL = "https://functions.poehali.dev/7a98e799-5147-40f5-b090-57778b8c4094";

interface StatsData {
  visits: {
    total: number;
    unique: number;
    today: number;
    week: number;
    by_day: { day: string; count: number }[];
  };
  applications: {
    total: number;
    today: number;
    by_day: { day: string; count: number }[];
  };
}

const formatDay = (day: string) => {
  const d = new Date(day);
  return `${d.getDate()}.${String(d.getMonth() + 1).padStart(2, "0")}`;
};

const StatCard = ({ icon, label, value, sub }: { icon: string; label: string; value: number | string; sub?: string }) => (
  <div className="bg-white rounded-2xl p-5 border border-[#e8e0d0] flex items-center gap-4">
    <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center shrink-0">
      <Icon name={icon} size={22} className="text-teal-700" />
    </div>
    <div>
      <div className="text-2xl font-bold text-[#1a3028]">{value}</div>
      <div className="text-sm text-[#7a9a8a]">{label}</div>
      {sub && <div className="text-xs text-[#aaa] mt-0.5">{sub}</div>}
    </div>
  </div>
);

const Admin = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stats, setStats] = useState<StatsData | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(ADMIN_STATS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка");
      setStats(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ошибка");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const res = await fetch(ADMIN_STATS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok) setStats(data);
    } finally {
      setLoading(false);
    }
  };

  if (!stats) {
    return (
      <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 border border-[#e8e0d0] w-full max-w-sm shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center">
              <Icon name="Lock" size={20} className="text-teal-700" />
            </div>
            <div>
              <div className="font-bold text-[#1a3028]" style={{ fontFamily: "'Oswald', sans-serif" }}>ОАЗИС</div>
              <div className="text-xs text-[#7a9a8a]">Панель управления</div>
            </div>
          </div>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[#d4c9b0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 bg-[#fafaf7]"
              autoFocus
            />
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button
              type="submit"
              disabled={loading || !password}
              className="bg-teal-700 hover:bg-teal-600 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all"
            >
              {loading ? "Входим..." : "Войти"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const mergedByDay = (() => {
    const map: Record<string, { day: string; visits: number; apps: number }> = {};
    stats.visits.by_day.forEach(({ day, count }) => {
      map[day] = { day, visits: count, apps: 0 };
    });
    stats.applications.by_day.forEach(({ day, count }) => {
      if (map[day]) map[day].apps = count;
      else map[day] = { day, visits: 0, apps: count };
    });
    return Object.values(map).sort((a, b) => a.day.localeCompare(b.day));
  })();

  return (
    <div className="min-h-screen bg-[#f5f0e8]" style={{ fontFamily: "'Golos Text', sans-serif" }}>
      <nav className="bg-white border-b border-[#e8e0d0] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-teal-700 rounded-lg flex items-center justify-center">
            <Icon name="BarChart2" size={16} className="text-white" />
          </div>
          <span className="font-bold text-[#1a3028]" style={{ fontFamily: "'Oswald', sans-serif" }}>
            ОАЗИС · Статистика
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-1.5 text-sm text-teal-700 hover:text-teal-600 font-medium"
          >
            <Icon name="RefreshCw" size={14} className={loading ? "animate-spin" : ""} />
            Обновить
          </button>
          <button
            onClick={() => setStats(null)}
            className="flex items-center gap-1.5 text-sm text-[#7a9a8a] hover:text-red-500 font-medium"
          >
            <Icon name="LogOut" size={14} />
            Выйти
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col gap-8">

        {/* Карточки */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon="Eye" label="Всего визитов" value={stats.visits.total} />
          <StatCard icon="Users" label="Уникальных" value={stats.visits.unique} sub="по IP" />
          <StatCard icon="TrendingUp" label="Сегодня" value={stats.visits.today} />
          <StatCard icon="Calendar" label="За 7 дней" value={stats.visits.week} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <StatCard icon="FileText" label="Всего заявок" value={stats.applications.total} />
          <StatCard icon="Bell" label="Заявок сегодня" value={stats.applications.today} />
        </div>

        {/* График */}
        <div className="bg-white rounded-2xl border border-[#e8e0d0] p-6">
          <h2 className="font-bold text-[#1a3028] mb-4" style={{ fontFamily: "'Oswald', sans-serif" }}>
            АКТИВНОСТЬ ЗА 30 ДНЕЙ
          </h2>
          {mergedByDay.length === 0 ? (
            <div className="text-center text-[#7a9a8a] py-12 text-sm">Данных пока нет — они появятся после первых визитов</div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={mergedByDay} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0ece2" />
                <XAxis dataKey="day" tickFormatter={formatDay} tick={{ fontSize: 11, fill: "#7a9a8a" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#7a9a8a" }} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  formatter={(value, name) => [value, name === "visits" ? "Визиты" : "Заявки"]}
                  labelFormatter={(label) => formatDay(label)}
                  contentStyle={{ borderRadius: 12, border: "1px solid #e8e0d0", fontSize: 13 }}
                />
                <Area type="monotone" dataKey="visits" stroke="#0d9488" strokeWidth={2} fill="url(#colorVisits)" dot={false} />
                <Area type="monotone" dataKey="apps" stroke="#f59e0b" strokeWidth={2} fill="url(#colorApps)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          )}
          <div className="flex items-center gap-5 mt-3">
            <div className="flex items-center gap-1.5 text-xs text-[#7a9a8a]">
              <div className="w-3 h-3 rounded-full bg-teal-600" /> Визиты
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#7a9a8a]">
              <div className="w-3 h-3 rounded-full bg-amber-400" /> Заявки
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Admin;
