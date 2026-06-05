import { useState } from "react";
import Icon from "@/components/ui/icon";

const AVATAR_URL =
  "https://cdn.poehali.dev/projects/3e9d6252-f055-4953-8e3e-e9bfaebdc990/bucket/540b7473-3ed4-47c3-8fd7-3a3ef2899ab1.jpeg";

const services = [
  { icon: "User", title: "Скины", desc: "Рисуем и решейдим скины — уникальный облик для персонажа с проработкой каждой детали" },
  { icon: "Layers", title: "Тотемы", desc: "2D и 3D тотемы — детализированные, яркие, с характером" },
  { icon: "Share2", title: "Оформление соц. сетей", desc: "Баннеры, аватарки и шаблоны постов в едином стиле для канала или сервера" },
  { icon: "Monitor", title: "Обои для рабочего стола", desc: "Эксклюзивные обои в стиле Minecraft под любой вкус и разрешение" },
  { icon: "Video", title: "Монтаж видео", desc: "Профессиональный монтаж роликов для YouTube, TikTok и других платформ" },
  { icon: "Image", title: "Превью", desc: "Кликабельные превью для видео, которые увеличивают просмотры" },
  { icon: "Map", title: "Карты", desc: "Создаём уникальные игровые карты — от мини-игр до приключенческих миров" },
  { icon: "Play", title: "Анимации", desc: "Плавные анимации персонажей и объектов для роликов и проектов в Blender" },
  { icon: "Package", title: "Ресурс-паки и шейдеры", desc: "Полноценные ресурс-паки и шейдеры, меняющие визуал игры до неузнаваемости" },
];

const portfolio = [
  { label: "Скин «Лесной дух»", tag: "Скины", color: "from-emerald-400 to-teal-600", emoji: "🌿" },
  { label: "3D Тотем «Феникс»", tag: "Тотемы", color: "from-orange-400 to-rose-500", emoji: "🔥" },
  { label: "Карта «Джунгли»", tag: "Карты", color: "from-lime-400 to-emerald-600", emoji: "🗺️" },
  { label: "Превью для канала", tag: "Превью", color: "from-sky-400 to-blue-600", emoji: "🎬" },
  { label: "Ресурс-пак «Тропики»", tag: "Ресурс-паки", color: "from-teal-400 to-cyan-600", emoji: "📦" },
  { label: "Монтаж клипа", tag: "Видео", color: "from-violet-400 to-purple-600", emoji: "🎞️" },
];

const navLinks = [
  { label: "Главная", href: "#hero" },
  { label: "Направления", href: "#services" },
  { label: "Портфолио", href: "#portfolio" },
  { label: "Вступить", href: "#contacts" },
];

const Index = () => {
  const [form, setForm] = useState({ name: "", contact: "", message: "" });
  const [sent, setSent] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f5f0e8]" style={{ fontFamily: "'Golos Text', sans-serif" }}>

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#f5f0e8]/90 backdrop-blur-md border-b border-[#d4c9b0]">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={AVATAR_URL}
              alt="Оазис"
              className="w-9 h-9 rounded-full object-cover border-2 border-teal-600"
            />
            <span className="font-bold text-lg text-[#1a3028]" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.05em" }}>
              ОАЗИС
            </span>
          </div>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <button
                key={l.href}
                onClick={() => scrollTo(l.href)}
                className="text-sm font-medium text-[#2d5a44] hover:text-teal-600 transition-colors"
              >
                {l.label}
              </button>
            ))}
            <button
              onClick={() => scrollTo("#contacts")}
              className="bg-teal-700 text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-teal-600 transition-colors"
            >
              Вступить в команду
            </button>
          </div>

          {/* Mobile burger */}
          <button className="md:hidden text-[#1a3028]" onClick={() => setMenuOpen(!menuOpen)}>
            <Icon name={menuOpen ? "X" : "Menu"} size={24} />
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-[#f5f0e8] border-t border-[#d4c9b0] px-6 py-4 flex flex-col gap-4">
            {navLinks.map((l) => (
              <button key={l.href} onClick={() => scrollTo(l.href)} className="text-left text-base font-medium text-[#2d5a44]">
                {l.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
        style={{
          backgroundImage: `url(${AVATAR_URL.replace("540b7473-3ed4-47c3-8fd7-3a3ef2899ab1.jpeg", "540b7473-3ed4-47c3-8fd7-3a3ef2899ab1.jpeg")})`,
        }}
      >
        {/* Tropical bg */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(https://cdn.poehali.dev/projects/3e9d6252-f055-4953-8e3e-e9bfaebdc990/bucket/540b7473-3ed4-47c3-8fd7-3a3ef2899ab1.jpeg)`,
            filter: "brightness(0.45) saturate(1.2)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#f5f0e8]" />

        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <div className="animate-fade-in">
            <img
              src={AVATAR_URL}
              alt="Оазис"
              className="w-28 h-28 md:w-36 md:h-36 rounded-full object-cover mx-auto mb-6 border-4 border-white/80 shadow-2xl"
            />
          </div>

          <h1
            className="text-5xl md:text-7xl font-black text-white mb-4 animate-fade-in-up"
            style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.08em", textShadow: "0 4px 20px rgba(0,0,0,0.4)" }}
          >
            ОАЗИС
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-3 animate-fade-in-up delay-100 font-medium">
            Minecraft-студия ищет таланты в команду
          </p>
          <p className="text-base text-white/75 mb-10 animate-fade-in-up delay-200 max-w-xl mx-auto leading-relaxed">
            Мы создаём скины, тотемы, карты, ресурс-паки, анимации и контент. Если ты умеешь делать что-то из этого — нам нужен такой человек.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-300">
            <button
              onClick={() => scrollTo("#contacts")}
              className="bg-teal-600 hover:bg-teal-500 text-white font-bold px-8 py-4 rounded-full text-base transition-all hover:scale-105 shadow-lg"
            >
              Вступить в команду
            </button>
            <button
              onClick={() => scrollTo("#services")}
              className="bg-white/15 hover:bg-white/25 text-white font-bold px-8 py-4 rounded-full text-base border border-white/40 transition-all hover:scale-105 backdrop-blur-sm"
            >
              Чем мы занимаемся
            </button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 animate-bounce">
          <Icon name="ChevronDown" size={28} />
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-24 px-6 bg-[#f5f0e8]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-teal-600 font-semibold text-sm uppercase tracking-widest">Кто нам нужен</span>
            <h2
              className="text-4xl md:text-5xl font-black text-[#1a3028] mt-2"
              style={{ fontFamily: "'Oswald', sans-serif" }}
            >
              НАПРАВЛЕНИЯ
            </h2>
            <p className="text-[#4a7a62] mt-3 text-base max-w-lg mx-auto">
              Ищем людей по каждому из этих направлений — одному или нескольким сразу
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <div
                key={i}
                className="group bg-white rounded-2xl p-6 border border-[#ddd4c0] hover:border-teal-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-teal-100 transition-colors">
                  <Icon name={s.icon} fallback="Star" size={22} className="text-teal-700" />
                </div>
                <h3
                  className="text-xl font-bold text-[#1a3028] mb-2"
                  style={{ fontFamily: "'Oswald', sans-serif" }}
                >
                  {s.title}
                </h3>
                <p className="text-sm text-[#5a7a6a] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section id="portfolio" className="py-24 px-6 bg-[#1a3028]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-teal-400 font-semibold text-sm uppercase tracking-widest">Наши работы</span>
            <h2
              className="text-4xl md:text-5xl font-black text-white mt-2"
              style={{ fontFamily: "'Oswald', sans-serif" }}
            >
              ПОРТФОЛИО
            </h2>
            <p className="text-teal-200/70 mt-3 text-base max-w-lg mx-auto">
              Примеры работ — скоро здесь появятся реальные проекты
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolio.map((p, i) => (
              <div
                key={i}
                className="group relative rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 aspect-video"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${p.color} opacity-80`} />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <span className="text-5xl mb-3">{p.emoji}</span>
                  <span className="font-bold text-lg text-center px-4" style={{ fontFamily: "'Oswald', sans-serif" }}>
                    {p.label}
                  </span>
                  <span className="mt-2 text-xs bg-white/20 px-3 py-1 rounded-full">{p.tag}</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            ))}
          </div>

          <p className="text-center text-teal-300/50 text-sm mt-10">
            Портфолио пополняется — напишите нам, чтобы узнать о наличии примеров в нужной категории
          </p>
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts" className="py-24 px-6 bg-[#f5f0e8]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-teal-600 font-semibold text-sm uppercase tracking-widest">Хочешь к нам?</span>
            <h2
              className="text-4xl md:text-5xl font-black text-[#1a3028] mt-2"
              style={{ fontFamily: "'Oswald', sans-serif" }}
            >
              ВСТУПИТЬ В КОМАНДУ
            </h2>
            <p className="text-[#4a7a62] mt-3 text-base max-w-md mx-auto">
              Расскажи о себе и своих навыках — мы рассмотрим заявку и свяжемся с тобой
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 items-start">
            {/* Form */}
            <div className="bg-white rounded-3xl p-8 border border-[#ddd4c0] shadow-sm">
              {!sent ? (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-[#1a3028] mb-1">Имя / Ник</label>
                    <input
                      type="text"
                      required
                      placeholder="Herobrine228"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full border border-[#d4c9b0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all bg-[#fafaf7]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1a3028] mb-1">Discord / Telegram / VK</label>
                    <input
                      type="text"
                      required
                      placeholder="@username"
                      value={form.contact}
                      onChange={(e) => setForm({ ...form, contact: e.target.value })}
                      className="w-full border border-[#d4c9b0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all bg-[#fafaf7]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1a3028] mb-1">Чем ты занимаешься?</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Умею рисовать скины, решейдить, делаю превью и баннеры..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full border border-[#d4c9b0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all bg-[#fafaf7] resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-teal-700 hover:bg-teal-600 text-white font-bold py-4 rounded-xl text-base transition-all hover:shadow-lg hover:scale-[1.02]"
                  >
                    Подать заявку
                  </button>
                </form>
              ) : (
                <div className="text-center py-8">
                  <div className="text-5xl mb-4">🌴</div>
                  <h3 className="text-2xl font-bold text-[#1a3028] mb-2" style={{ fontFamily: "'Oswald', sans-serif" }}>
                    Заявка отправлена!
                  </h3>
                  <p className="text-[#4a7a62] text-sm">Мы рассмотрим её и свяжемся с тобой в ближайшее время.</p>
                  <button
                    onClick={() => { setSent(false); setForm({ name: "", contact: "", message: "" }); }}
                    className="mt-6 text-teal-600 text-sm hover:underline"
                  >
                    Отправить ещё одну заявку
                  </button>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col gap-6">
              <div className="bg-white rounded-2xl p-6 border border-[#ddd4c0]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center">
                    <Icon name="MessageCircle" size={20} className="text-teal-700" />
                  </div>
                  <span className="font-bold text-[#1a3028]" style={{ fontFamily: "'Oswald', sans-serif" }}>Discord</span>
                </div>
                <p className="text-sm text-[#5a7a6a]">Напишите нам в Discord — там мы отвечаем быстрее всего</p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-[#ddd4c0]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center">
                    <Icon name="Clock" size={20} className="text-teal-700" />
                  </div>
                  <span className="font-bold text-[#1a3028]" style={{ fontFamily: "'Oswald', sans-serif" }}>Сроки</span>
                </div>
                <p className="text-sm text-[#5a7a6a]">Сроки обсуждаем индивидуально — зависит от сложности задачи</p>
              </div>
              <div className="bg-[#1a3028] rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <img src={AVATAR_URL} alt="Оазис" className="w-10 h-10 rounded-full object-cover" />
                  <span className="font-bold text-white" style={{ fontFamily: "'Oswald', sans-serif" }}>ОАЗИС</span>
                </div>
                <p className="text-teal-200/80 text-sm leading-relaxed">
                  Мы — небольшая команда с большой любовью к Minecraft. Ищем людей, которые горят тем же и хотят создавать крутые вещи вместе.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0f1f17] text-white/50 py-8 px-6 text-center text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <img src={AVATAR_URL} alt="Оазис" className="w-6 h-6 rounded-full object-cover" />
          <span className="font-semibold text-white/70" style={{ fontFamily: "'Oswald', sans-serif" }}>ОАЗИС</span>
        </div>
        <p>© 2024 Minecraft-студия Оазис. Все работы создаются в Blender.</p>
      </footer>
    </div>
  );
};

export default Index;