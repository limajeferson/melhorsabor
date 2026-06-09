"use client";

/**
 * /perfil — Perfil privado do usuário
 *
 * Gamificação íntima: sem pontos públicos, sem ranking.
 * A pessoa vê sua própria jornada — calendário de check-ins, badges privados,
 * fase atual — como um espelho do que ela está construindo.
 *
 * Auth: client-side via Supabase anon key + RLS
 */

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChefHat,
  Loader2,
  LogOut,
  Trophy,
  Calendar,
  Leaf,
  Sprout,
  TreePine,
  Wheat,
  Check,
  Lock,
  Plus,
  X,
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------
interface Checkin {
  date: string; // "YYYY-MM-DD"
  items: string[];
}

interface Badge {
  badge_id: string;
  unlocked_at: string;
}

// ---------------------------------------------------------------------------
// Dados de gamificação (definições estáticas)
// ---------------------------------------------------------------------------
const CHECKIN_OPTIONS = [
  "Café da manhã saudável ☀️",
  "Almoço em casa 🍽️",
  "Evitei o fast food 🚫",
  "Bebi água suficiente 💧",
  "Jantar equilibrado 🥗",
  "Cozinhei para a família 👨‍👩‍👧",
];

const BADGE_DEFINITIONS: Record<string, { label: string; emoji: string; description: string }> = {
  primeira_refeicao:  { label: "Primeira Refeição",    emoji: "🍽️", description: "Primeira receita preparada" },
  semana_inteira:     { label: "Semana Inteira",        emoji: "📅", description: "7 check-ins no mesmo mês" },
  explorador:         { label: "Explorador",            emoji: "🧭", description: "Receitas de 3 categorias" },
  silencio_produtivo: { label: "Silêncio Produtivo",    emoji: "🌿", description: "3 dias sem fast food" },
  cozinhou_pra_casa:  { label: "Cozinhou pra Casa",     emoji: "🏠", description: "Cozinhou para a família 5 vezes" },
  mes_colorido:       { label: "Mês Colorido",          emoji: "🌈", description: "20+ check-ins em um mês" },
  constancia_tranqui: { label: "Constância Tranquila",  emoji: "🌳", description: "3 meses com ≥10 check-ins" },
  voz_comunidade:     { label: "Voz da Comunidade",     emoji: "💬", description: "Comentou em 10 posts" },
  primeira_conquista: { label: "Primeira Conquista",    emoji: "🏆", description: "Atingiu um objetivo do onboarding" },
};

const JOURNEY_PHASES = [
  { id: "semente",  label: "Semente",  icon: Leaf,     description: "Você começou sua jornada.",            color: "text-green-500" },
  { id: "broto",    label: "Broto",    icon: Sprout,   description: "2 semanas de check-ins.",              color: "text-emerald-500" },
  { id: "raiz",     label: "Raiz",     icon: TreePine, description: "1 mês consistente de prática.",        color: "text-teal-600" },
  { id: "colheita", label: "Colheita", icon: Wheat,    description: "Objetivo do onboarding atingido.",     color: "text-amber-500" },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function getPhaseIndex(checkins: Checkin[]): number {
  const total = checkins.length;
  if (total >= 30) return 3;
  if (total >= 14) return 2;
  if (total >= 2)  return 1;
  return 0;
}

function getMonthDays(year: number, month: number): (string | null)[] {
  const firstDay = new Date(year, month, 1).getDay(); // 0=Dom
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (string | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(`${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`);
  }
  return cells;
}

function formatMonthLabel(year: number, month: number): string {
  return new Date(year, month, 1).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
}

// ---------------------------------------------------------------------------
// Componente: Calendário de check-ins
// ---------------------------------------------------------------------------
function CheckinCalendar({
  checkins,
  onCheckin,
  today,
}: {
  checkins: Checkin[];
  onCheckin: (items: string[]) => Promise<void>;
  today: string;
}) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const days = getMonthDays(year, month);
  const checkinMap = new Map(checkins.map((c) => [c.date, c]));
  const todayCheckin = checkinMap.get(today);
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();

  async function saveCheckin() {
    if (selected.length === 0) return;
    setSaving(true);
    await onCheckin(selected);
    setSaving(false);
    setShowModal(false);
    setSelected([]);
  }

  function toggleOption(opt: string) {
    setSelected((prev) =>
      prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt]
    );
  }

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  }

  const checkinCount = days.filter((d) => d && checkinMap.has(d)).length;

  return (
    <section className="bg-white rounded-2xl p-5 shadow-sm border border-peach/40">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-tomato" />
          <h2 className="font-bold text-gray-900">Minha agenda</h2>
        </div>
        {isCurrentMonth && !todayCheckin && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 bg-tomato hover:bg-paprika text-white text-xs font-semibold px-3 py-1.5 rounded-full transition shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Check-in de hoje
          </button>
        )}
        {isCurrentMonth && todayCheckin && (
          <span className="flex items-center gap-1 text-xs text-green-600 font-semibold bg-green-50 border border-green-200 px-3 py-1 rounded-full">
            <Check className="w-3 h-3" />
            Feito hoje!
          </span>
        )}
      </div>

      {/* Navegação de mês */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="text-gray-400 hover:text-gray-700 text-lg leading-none px-2 py-1 transition">‹</button>
        <span className="text-sm font-semibold text-gray-700 capitalize">{formatMonthLabel(year, month)}</span>
        <button
          onClick={nextMonth}
          disabled={isCurrentMonth}
          className="text-gray-400 hover:text-gray-700 disabled:opacity-30 text-lg leading-none px-2 py-1 transition"
        >›</button>
      </div>

      {/* Header dias da semana */}
      <div className="grid grid-cols-7 mb-1">
        {["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) => (
          <div key={i} className="text-center text-[10px] font-semibold text-gray-400 py-1">{d}</div>
        ))}
      </div>

      {/* Células do calendário */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, i) => {
          if (!date) return <div key={`empty-${i}`} />;
          const hasCheckin = checkinMap.has(date);
          const isToday = date === today;
          return (
            <div
              key={date}
              title={hasCheckin ? `${checkinMap.get(date)!.items.length} item(s)` : date}
              className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition ${
                hasCheckin
                  ? "bg-gradient-to-br from-honey to-apricot text-paprika shadow-sm font-bold"
                  : isToday
                  ? "border-2 border-tomato/40 text-tomato"
                  : "text-gray-400 bg-gray-50"
              }`}
            >
              {new Date(date + "T12:00:00").getDate()}
            </div>
          );
        })}
      </div>

      {/* Resumo do mês */}
      <p className="text-center text-xs text-gray-400 mt-4">
        {checkinCount > 0
          ? `${checkinCount} dia${checkinCount > 1 ? "s" : ""} marcado${checkinCount > 1 ? "s" : ""} este mês`
          : "Nenhum check-in este mês ainda"}
      </p>

      {/* Modal de check-in */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0"
            onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-xl"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-gray-900">O que você fez hoje?</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-700 transition">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mb-4">Selecione tudo que se aplica. Sem pressão. 😊</p>
              <div className="flex flex-col gap-2 mb-5">
                {CHECKIN_OPTIONS.map((opt) => {
                  const sel = selected.includes(opt);
                  return (
                    <button
                      key={opt}
                      onClick={() => toggleOption(opt)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left text-sm transition-all ${
                        sel ? "border-tomato bg-peach/30 text-paprika font-semibold" : "border-gray-200 text-gray-700 hover:border-apricot"
                      }`}
                    >
                      <span className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${sel ? "bg-tomato border-tomato" : "border-gray-300"}`}>
                        {sel && <Check className="w-2.5 h-2.5 text-white" />}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={saveCheckin}
                disabled={selected.length === 0 || saving}
                className="w-full flex items-center justify-center gap-2 bg-tomato hover:bg-paprika disabled:bg-gray-200 disabled:text-gray-400 text-white py-3.5 rounded-full text-sm font-bold transition"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {saving ? "Salvando…" : "Registrar meu dia"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Componente: Grid de badges
// ---------------------------------------------------------------------------
function BadgeGrid({ unlockedBadges }: { unlockedBadges: Badge[] }) {
  const unlockedIds = new Set(unlockedBadges.map((b) => b.badge_id));

  return (
    <section className="bg-white rounded-2xl p-5 shadow-sm border border-peach/40">
      <div className="flex items-center gap-2 mb-5">
        <Trophy className="w-5 h-5 text-tomato" />
        <h2 className="font-bold text-gray-900">Minhas conquistas</h2>
        <span className="ml-auto text-xs text-gray-400">
          {unlockedBadges.length}/{Object.keys(BADGE_DEFINITIONS).length} desbloqueadas
        </span>
      </div>
      <p className="text-xs text-gray-400 mb-4 leading-relaxed">
        Cada conquista é só sua. Ninguém mais vê. Você descobre ao abrir este painel.
      </p>
      <div className="grid grid-cols-3 sm:grid-cols-3 gap-3">
        {Object.entries(BADGE_DEFINITIONS).map(([id, badge]) => {
          const unlocked = unlockedIds.has(id);
          const unlockedData = unlockedBadges.find((b) => b.badge_id === id);
          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              title={unlocked ? `${badge.label} — ${badge.description}` : "Conquista bloqueada"}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border text-center transition ${
                unlocked
                  ? "border-apricot bg-honey/10 shadow-sm"
                  : "border-gray-100 bg-gray-50 opacity-50"
              }`}
            >
              <span className={`text-2xl ${unlocked ? "" : "grayscale"}`}>
                {unlocked ? badge.emoji : <Lock className="w-5 h-5 text-gray-300" />}
              </span>
              <span className={`text-[11px] font-semibold leading-tight ${unlocked ? "text-gray-800" : "text-gray-400"}`}>
                {unlocked ? badge.label : "???"}
              </span>
              {unlocked && unlockedData && (
                <span className="text-[10px] text-gray-400">
                  {new Date(unlockedData.unlocked_at).toLocaleDateString("pt-BR")}
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Componente: Fase da jornada
// ---------------------------------------------------------------------------
function JourneyPhase({ checkins }: { checkins: Checkin[] }) {
  const phaseIndex = getPhaseIndex(checkins);
  const phase = JOURNEY_PHASES[phaseIndex];
  const PhaseIcon = phase.icon;

  return (
    <section className="bg-white rounded-2xl p-5 shadow-sm border border-peach/40">
      <h2 className="font-bold text-gray-900 mb-4">Minha fase</h2>
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-12 h-12 rounded-full bg-honey/20 flex items-center justify-center ${phase.color}`}>
          <PhaseIcon className="w-6 h-6" />
        </div>
        <div>
          <p className="font-bold text-gray-900">{phase.label}</p>
          <p className="text-xs text-gray-500">{phase.description}</p>
        </div>
      </div>
      <div className="flex gap-1.5">
        {JOURNEY_PHASES.map((p, i) => (
          <div
            key={p.id}
            className={`flex-1 h-1.5 rounded-full transition-all ${
              i <= phaseIndex ? "bg-tomato" : "bg-gray-200"
            }`}
          />
        ))}
      </div>
      <div className="flex justify-between mt-1">
        {JOURNEY_PHASES.map((p) => (
          <span key={p.id} className="text-[9px] text-gray-400">{p.label}</span>
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Página principal
// ---------------------------------------------------------------------------
export default function PerfilPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [displayName, setDisplayName] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const fetchData = useCallback(async (userId: string) => {
    const [checkinsRes, badgesRes] = await Promise.all([
      supabase
        .from("user_checkins")
        .select("date, items")
        .eq("user_id", userId)
        .order("date", { ascending: false }),
      supabase
        .from("user_badges")
        .select("badge_id, unlocked_at")
        .eq("user_id", userId),
    ]);
    if (checkinsRes.data) setCheckins(checkinsRes.data as Checkin[]);
    if (badgesRes.data)  setBadges(badgesRes.data as Badge[]);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        router.replace("/onboarding");
        return;
      }
      setUser(session.user);

      // Nome: metadata do Google ou email
      const name =
        (session.user.user_metadata?.full_name as string | undefined) ||
        (session.user.user_metadata?.name as string | undefined) ||
        session.user.email?.split("@")[0] ||
        "você";
      setDisplayName(name);

      await fetchData(session.user.id);
      setReady(true);
    });
  }, [router, fetchData]);

  async function handleCheckin(items: string[]) {
    if (!user) return;
    const { data } = await supabase
      .from("user_checkins")
      .upsert({ user_id: user.id, date: today, items }, { onConflict: "user_id,date" })
      .select("date, items")
      .single();
    if (data) {
      setCheckins((prev) => {
        const filtered = prev.filter((c) => c.date !== today);
        return [data as Checkin, ...filtered];
      });
    }
    // Avalia badges após check-in (client-side simples para MVP)
    await evaluateBadges(user.id);
  }

  async function evaluateBadges(userId: string) {
    // Badge: semana_inteira (7 check-ins no mês atual)
    const currentMonth = today.slice(0, 7); // "YYYY-MM"
    const monthCheckins = checkins.filter((c) => c.date.startsWith(currentMonth)).length + 1;

    const newBadges: string[] = [];
    if (monthCheckins >= 7)  newBadges.push("semana_inteira");
    if (monthCheckins >= 20) newBadges.push("mes_colorido");

    // Check-in de "cozinhei para a família"
    const familyCount = checkins.filter((c) =>
      c.items.some((i) => i.includes("família"))
    ).length;
    if (familyCount >= 5) newBadges.push("cozinhou_pra_casa");

    const existingIds = new Set(badges.map((b) => b.badge_id));
    const toUnlock = newBadges.filter((id) => !existingIds.has(id));

    if (toUnlock.length > 0) {
      const now = new Date().toISOString();
      await supabase.from("user_badges").upsert(
        toUnlock.map((badge_id) => ({ user_id: userId, badge_id, unlocked_at: now })),
        { onConflict: "user_id,badge_id" }
      );
      setBadges((prev) => [
        ...prev,
        ...toUnlock.map((badge_id) => ({ badge_id, unlocked_at: now })),
      ]);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace("/");
  }

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-cream to-peach/30">
        <Loader2 className="w-8 h-8 text-tomato animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream via-peach/20 to-cream">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-4 max-w-2xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-gray-800 font-semibold text-sm">
          <ChefHat className="w-5 h-5 text-tomato" />
          MelhorSabor
        </Link>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sair
        </button>
      </header>

      <main className="px-4 pb-16 max-w-2xl mx-auto">
        {/* Saudação */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-7 pt-2"
        >
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1 capitalize">
            Olá, {displayName.split(" ")[0]} 👋
          </h1>
          <p className="text-gray-500 text-sm">
            {checkins.length === 0
              ? "Faça seu primeiro check-in e comece a colorir sua agenda."
              : `${checkins.length} dia${checkins.length > 1 ? "s" : ""} registrado${checkins.length > 1 ? "s" : ""} na sua jornada.`}
          </p>
        </motion.div>

        <div className="flex flex-col gap-5">
          {/* Fase */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <JourneyPhase checkins={checkins} />
          </motion.div>

          {/* Calendário */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <CheckinCalendar checkins={checkins} onCheckin={handleCheckin} today={today} />
          </motion.div>

          {/* Badges */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <BadgeGrid unlockedBadges={badges} />
          </motion.div>

          {/* Link para planos se não assinante */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="bg-gradient-to-r from-apricot/30 to-honey/20 rounded-2xl p-5 text-center border border-apricot/40">
              <p className="text-sm font-semibold text-gray-800 mb-1">Libere todos os recursos</p>
              <p className="text-xs text-gray-500 mb-4">
                Acesse receitas personalizadas, séries temáticas e conteúdo avançado.
              </p>
              <Link
                href="/planos"
                className="inline-flex items-center gap-2 bg-tomato hover:bg-paprika text-white text-sm font-bold px-6 py-2.5 rounded-full transition shadow-sm shadow-tomato/20"
              >
                Ver planos de acesso
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
