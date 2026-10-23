'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type Operation = {
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: string;
  description: string;
};

// --- БЛОК СЕРВЕРОВ ---
const SERVERS = [
  { name: 'Франция', host: 'np.girlsciv.ru', tag: 'Рекомендуемый', maxPlayers: 20 },
  { name: 'Польша', host: 'if.girlsciv.ru', tag: 'Запасной', maxPlayers: 20 },
  { name: 'Канада', host: 'ca.girlsciv.ru', tag: 'Резерв', maxPlayers: 100 },
];

const ServerStatus = () => {
  const [statuses, setStatuses] = useState<any[]>(SERVERS);
  const [loading, setLoading] = useState(true);
  const [copiedHost, setCopiedHost] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const results = await Promise.all(
          SERVERS.map(async (server) => {
            try {
              const res = await fetch(`https://www.minecraftpinger.com/api/v1/${server.host}`, {
                headers: { 'User-Agent': 'GirlsCiv/1.0' }
              });
              const data = await res.json();

              if (data.message === 'ok' && data.server) {
                return {
                  ...server,
                  online: true,
                  players: {
                    online: data.server.players?.online || 0,
                    max: Math.min(data.server.players?.max || server.maxPlayers, server.maxPlayers)
                  },
                  ping: data.server.ping || 0,
                };
              } else {
                return { ...server, online: false, ping: 0, players: { online: 0, max: server.maxPlayers } };
              }
            } catch (err) {
              return { ...server, online: false, ping: 0, players: { online: 0, max: server.maxPlayers } };
            }
          })
        );
        setStatuses(results);
      } catch (err) {
        console.error('Ошибка загрузки статусов:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHost(text);
    setTimeout(() => setCopiedHost(null), 2000);
  };

  const getPingColor = (ping: number) => {
    if (ping < 80) return '#7be0a0';
    if (ping < 150) return '#f1c40f';
    return '#ff8e8e';
  };

  return (
    <div style={{ marginTop: '24px' }}>
      {loading && <div style={{ color: '#c9b3d9', textAlign: 'center', marginBottom: '16px' }}>Проверка серверов…</div>}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '16px'
      }}>
        {statuses.map((srv) => (
          <div
            key={srv.host}
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '20px',
              background: 'rgba(43, 26, 61, 0.6)',
              border: '1px solid #4a2e63',
              borderRadius: '16px',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <strong style={{ fontSize: '18px', color: '#fbeaff' }}>{srv.name}</strong>
                  {srv.tag && (
                    <span style={{ fontSize: '10px', background: '#ff8ec7', color: '#1a1a2e', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>
                      {srv.tag}
                    </span>
                  )}
                </div>
              </div>
              <div style={{ color: srv.online ? '#7be0a0' : '#ff8e8e', fontWeight: 'bold', fontSize: '14px' }}>
                {srv.online ? 'Онлайн' : 'Офлайн'}
              </div>
            </div>

            <div
              onClick={() => copyToClipboard(srv.host)}
              style={{
                fontSize: '14px',
                color: copiedHost === srv.host ? '#7be0a0' : '#c9b3d9',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(0,0,0,0.2)',
                padding: '8px 12px',
                borderRadius: '8px',
                marginBottom: '16px',
                transition: 'all 0.2s'
              }}
              title="Нажми, чтобы скопировать IP"
            >
              {srv.host}
              <span style={{ fontSize: '12px', marginLeft: 'auto', opacity: 0.8 }}>
                {copiedHost === srv.host ? '✓' : '📋'}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto' }}>
              {srv.online ? (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: `1px solid ${getPingColor(srv.ping)}`
                }}>
                  <div style={{ fontSize: '10px', color: '#c9b3d9', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Пинг</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: getPingColor(srv.ping), lineHeight: '1' }}>
                    {srv.ping} <span style={{ fontSize: '12px', fontWeight: 'normal' }}>мс</span>
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: '12px', color: '#ff8e8e' }}>Сервер недоступен</div>
              )}

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '10px', color: '#c9b3d9', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Игроки</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#fbeaff' }}>
                  {srv.players ? `${srv.players.online} / ${srv.players.max}` : '0 / 0'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
// --- КОНЕЦ БЛОКА СЕРВЕРОВ ---

const pluralizeWeeks = (n: number) => {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'неделя';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'недели';
  return 'недель';
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const ops = data.opsForDay || [];
    return (
      <div
        style={{
          background: '#2b1a3d',
          border: '1px solid #4a2e63',
          padding: '14px 16px',
          borderRadius: '12px',
          color: '#fbeaff',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          maxWidth: '320px',
          maxHeight: '320px',
          overflowY: 'auto',
          fontSize: '13px',
        }}
      >
        <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', borderBottom: '1px solid #4a2e63', paddingBottom: '8px' }}>
          {label}
        </p>
        <p style={{ margin: '0 0 10px 0', color: '#ff8ec7', fontWeight: 'bold' }}>
          Баланс: {new Intl.NumberFormat('ru-RU').format(data.balance)} ₽
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {ops.map((op: any, i: number) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '10px',
                color: op.type === 'income' ? '#7be0a0' : '#ff8e8e',
              }}
            >
              <span>
                {op.category}
                {op.description ? ` (${op.description})` : ''}
              </span>
              <span style={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>
                {op.type === 'income' ? '+' : '−'}{op.amount} ₽
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function Home() {
  const [ipCopied, setIpCopied] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [weeks, setWeeks] = useState(1);
  const [playerName, setPlayerName] = useState(''); // Стейт для ника
  const [isSubmitting, setIsSubmitting] = useState(false); // Стейт для загрузки
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  const [operations, setOperations] = useState<Operation[]>([]);
  const [budgetLoading, setBudgetLoading] = useState(true);
  const [budgetError, setBudgetError] = useState<string | null>(null);
  const [totals, setTotals] = useState({ income: 0, expense: 0, balance: 0 });
  const [chartData, setChartData] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState<'all' | 'month'>('all');
  const [budgetDate, setBudgetDate] = useState<string>('');

  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const PRICE_PER_WEEK = 99;
  const SP_PER_WEEK = 50;
  const IP = 'np.girlsciv.ru';
  const screenshots = [
    '/screen1.png',
    '/screen2.png',
    '/screen3.png',
    '/screen4.png',
    '/screen5.png',
    '/screen6.png',
    '/screen7.png',
    '/screen8.png',
    '/screen9.png',
    '/screen10.png',
    '/screen11.png',
  ];

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    fetch('/budget.txt', { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error('Файл не найден');
        return res.text();
      })
      .then((text) => {
        const lines = text.split('\n').filter((line) => line.trim() !== '');

        const parsedOps: Operation[] = lines.map((line) => {
          const [category, amountStr, date, description] = line.split('|').map((s) => s.trim());
          const rawAmount = parseInt(amountStr) || 0;
          const isExpense = rawAmount < 0;
          const amount = Math.abs(rawAmount);

          return {
            type: isExpense ? 'expense' : 'income',
            category,
            amount,
            date,
            description: description || '',
          };
        });

        let totalIncome = 0;
        let totalExpense = 0;
        parsedOps.forEach((op) => {
          if (op.type === 'income') totalIncome += op.amount;
          else totalExpense += op.amount;
        });
        setTotals({ income: totalIncome, expense: totalExpense, balance: totalIncome - totalExpense });

        const grouped = parsedOps.reduce((acc, op) => {
          if (!acc[op.date]) acc[op.date] = { date: op.date, income: 0, expense: 0, opsForDay: [] as Operation[] };
          if (op.type === 'income') acc[op.date].income += op.amount;
          else acc[op.date].expense += op.amount;
          acc[op.date].opsForDay.push(op);
          return acc;
        }, {} as Record<string, { date: string; income: number; expense: number; opsForDay: Operation[] }>);

        const sortedDates = Object.keys(grouped).sort(
          (a, b) => new Date(a).getTime() - new Date(b).getTime()
        );
        let runningBalance = 0;
        const allChartData = sortedDates.map((date) => {
          runningBalance += grouped[date].income - grouped[date].expense;
          return { ...grouped[date], balance: runningBalance };
        });

        setOperations([...parsedOps].reverse());
        setChartData(allChartData);
        setBudgetDate(new Date().toLocaleDateString('ru-RU'));
        setBudgetLoading(false);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        console.error('Ошибка бюджета:', err);
        setBudgetError('Не удалось загрузить данные бюджета. Попробуй обновить страницу.');
        setBudgetLoading(false);
      });

    return () => controller.abort();
  }, []);

  const filteredChartData =
    timeRange === 'month' && chartData.length > 0
      ? (() => {
          const lastDate = new Date(chartData[chartData.length - 1].date).getTime();
          const monthAgo = lastDate - 30 * 24 * 60 * 60 * 1000;
          return chartData.filter((d) => new Date(d.date).getTime() >= monthAgo);
        })()
      : chartData;

  const copyIp = () => {
    navigator.clipboard.writeText(IP).then(() => {
      setIpCopied(true);
      showToast(`IP скопирован: ${IP}`);
      setTimeout(() => setIpCopied(false), 2000);
    });
  };

  const showToast = (msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToastMessage(msg);
    toastTimer.current = setTimeout(() => setToastMessage(''), 2500);
  };

  const changeWeeks = (amount: number) => {
    setWeeks((prev) => Math.max(1, Math.min(52, prev + amount)));
  };

  const formatMoney = (num: number) => new Intl.NumberFormat('ru-RU').format(num) + ' ₽';

  // НОВАЯ ФУНКЦИЯ: Обработка оплаты
  const handlePay = async () => {
    if (!playerName.trim()) {
      showToast('Пожалуйста, введи свой ник в Minecraft!');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weeks, playerName: playerName.trim() }),
      });

      const data = await res.json();
      
      if (data.url) {
        window.location.href = data.url; // Перенаправляем на FreeKassa
      } else {
        showToast('Ошибка при создании платежа. Попробуй позже.');
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      showToast('Ошибка сети. Проверь подключение.');
      setIsSubmitting(false);
    }
  };

  const handleModalKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsModalOpen(false);
      return;
    }
    if (e.key !== 'Tab' || !modalRef.current) return;
    const focusables = modalRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, []);

  useEffect(() => {
    if (!isModalOpen) return;
    document.addEventListener('keydown', handleModalKeyDown);
    const firstBtn = modalRef.current?.querySelector<HTMLElement>('button');
    firstBtn?.focus();
    return () => document.removeEventListener('keydown', handleModalKeyDown);
  }, [isModalOpen, handleModalKeyDown]);

  const goToSlide = (dir: 1 | -1) => {
    setCurrentSlide((prev) => {
      const next = prev + dir;
      if (next < 0) return screenshots.length - 1;
      if (next >= screenshots.length) return 0;
      return next;
    });
  };

  return (
    <>
      <nav aria-label="Основная навигация">
        <div className="container nav-inner">
          <div className="logo">Girls Civilization</div>
          
          <div className="nav-links">
            <a href="#about">О сервере</a>
            <a href="#servers">Серверы</a>
            <a href="#shots">Скриншоты</a>
            <a href="#start">Как начать</a>
            <a href="#rules">Правила</a>
            <a href="#budget">Бюджет</a>
            <a href="#sponsor">Поддержать</a>
            <a href="#faq">FAQ</a>
            <a href="https://t.me/girlsciv" target="_blank" rel="noopener noreferrer" className="nav-tg">Telegram</a>
            <button type="button" className="nav-cta" onClick={() => setIsModalOpen(true)}>
              <span>Поддержать</span>
            </button>
          </div>
          <button
            type="button"
            className="burger"
            aria-label={isMobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span></span><span></span><span></span>
          </button>
        </div>
        <div className="container">
          <div id="mobile-menu" className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
            <a href="#about" onClick={() => setIsMobileMenuOpen(false)}>О сервере</a>
            <a href="#servers" onClick={() => setIsMobileMenuOpen(false)}>Серверы</a>
            <a href="#shots" onClick={() => setIsMobileMenuOpen(false)}>Скриншоты</a>
            <a href="#start" onClick={() => setIsMobileMenuOpen(false)}>Как начать</a>
            <a href="#rules" onClick={() => setIsMobileMenuOpen(false)}>Правила</a>
            <a href="#budget" onClick={() => setIsMobileMenuOpen(false)}>Бюджет</a>
            <a href="#sponsor" onClick={() => setIsMobileMenuOpen(false)}>Поддержать</a>
            <a href="#faq" onClick={() => setIsMobileMenuOpen(false)}>FAQ</a>
            <a href="https://t.me/girlsciv" target="_blank" rel="noopener noreferrer">Telegram</a>
            <button
              type="button"
              className="nav-cta"
              onClick={() => { setIsModalOpen(true); setIsMobileMenuOpen(false); }}
            >
              <span>Поддержать</span>
            </button>
          </div>
        </div>
      </nav>

      <main id="main">
        <header className="hero">
          <div className="container">
            <div className="hero-badges">
              <div className="hero-badge">Только для девушек</div>
              <div className="online-badge" data-state="online">
                <span className="dot"></span>
                <span>Сервер работает 24/7</span>
              </div>
            </div>

            <h1>Уютный Minecraft<br />только для нас</h1>
            <p className="subtitle">
              Girls Civilization — сообщество девушек, где можно строить, дружить и отдыхать. Косметика, NPC-жительницы, аукцион, приваты, гильдии. Без pay-to-win.
            </p>
            <button
              type="button"
              className={`ip-box ${ipCopied ? 'copied' : ''}`}
              onClick={copyIp}
              aria-label={`Скопировать IP сервера ${IP}`}
            >
              <span>{IP}</span>
              <span className="copy-hint">{ipCopied ? '✓ скопировано!' : 'нажми, чтобы скопировать'}</span>
            </button>
            <div className="hero-buttons">
              <button type="button" className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                Поддержать сервер
              </button>
              <a href="https://t.me/girlsciv" target="_blank" rel="noopener noreferrer" className="btn btn-tg">
                Telegram-канал
              </a>
              <a href="#start" className="btn btn-ghost">Как начать</a>
            </div>
          </div>
        </header>

        <section id="servers" aria-labelledby="servers-title">
          <div className="container">
            <h2 id="servers-title" className="section-title reveal">Наши серверы</h2>
            <p className="section-sub reveal">
              Это <strong>один и тот же наш уютный мир</strong>, просто с разными «входными дверями» (фильтрами защиты). 
              Выбери тот, где у тебя лучше всего работает пинг — зайти можно через любой!
            </p>
            <ServerStatus />
          </div>
        </section>

        <section id="shots" className="shots" aria-labelledby="shots-title">
          <div className="container">
            <h2 id="shots-title" className="section-title reveal">Наш мир</h2>
            <p className="section-sub reveal">
              Немного атмосферы — чтобы ты почувствовала, каково это, ещё до входа.
            </p>
          </div>
          <div className="shots-wrap reveal">
            <div className="shots-viewport">
              <div
                className="shots-track"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {screenshots.map((src, i) => (
                  <div key={src} className={`shot ${i === currentSlide ? 'active' : ''}`}>
                    <img
                      src={src}
                      alt=""
                      loading={i === 0 ? 'eager' : 'lazy'}
                      width={1280}
                      height={720}
                    />
                  </div>
                ))}
              </div>
              <button type="button" className="shots-arrow prev" aria-label="Предыдущий скриншот" onClick={() => goToSlide(-1)}>‹</button>
              <button type="button" className="shots-arrow next" aria-label="Следующий скриншот" onClick={() => goToSlide(1)}>›</button>
            </div>
            <div className="shots-dots" role="tablist" aria-label="Скриншоты">
              {screenshots.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === currentSlide}
                  aria-label={`Скриншот ${i + 1}`}
                  className={`shots-dot ${i === currentSlide ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(i)}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="about" aria-labelledby="about-title">
          <div className="container">
            <h2 id="about-title" className="section-title reveal">Что у нас есть</h2>
            <p className="section-sub reveal">
              Мы создали место, где девушки могут спокойно играть, строить и общаться.
            </p>
            <div className="features">
              <div className="feature reveal"><span className="emoji">🌸</span><h3>Только для девушек</h3><p>Уютное комьюнити без токсичности и лишнего шума. Здесь только девушки — и это чувствуется.</p></div>
              <div className="feature reveal"><span className="emoji">⚖️</span><h3>0% pay-to-win</h3><p>Поддержка сервера даёт только косметику и статус. Никаких преимуществ в игре.</p></div>
              <div className="feature reveal"><span className="emoji">🏰</span><h3>Гильдии</h3><p>Создавай свою гильдию, приглашай подруг, копите в общую казну.</p></div>
              <div className="feature reveal"><span className="emoji">💰</span><h3>Экономика и банк</h3><p>Зарабатывай монеты, открывай вклады, вкладывай в проекты.</p></div>
              <div className="feature reveal"><span className="emoji">🛒</span><h3>Аукцион</h3><p>Предметы, приваты и услуги. Продавай и покупай у других девушек.</p></div>
              <div className="feature reveal"><span className="emoji">🎀</span><h3>Женский род везде</h3><p>Все NPC, предметы и переводы — в женском роде. Мы говорим о себе в женском роде — и нам так уютнее.</p></div>
              <div className="feature reveal"><span className="emoji">👩‍🌾</span><h3>NPC-жительницы</h3><p>Добрячка, Настройщица, Аукционистка и другие. У каждой — своё дело.</p></div>
              <div className="feature reveal"><span className="emoji">🎨</span><h3>Косметика</h3><p>Ауры, следы, цвета ников, эффекты за снарядами. Всё — за SP или за игру.</p></div>
              <div className="feature reveal"><span className="emoji">🛡️</span><h3>Приваты</h3><p>Защити свою территорию. Настрой флаги, добавь подруг, продай участок через аукцион.</p></div>
            </div>
          </div>
        </section>

        <section id="start" aria-labelledby="start-title">
          <div className="container">
            <h2 id="start-title" className="section-title reveal">Как начать играть</h2>
            <p className="section-sub reveal">Четыре шага — и ты в уютном мире.</p>
            <div className="steps">
              <div className="step reveal"><span className="num">1</span><h3>Открой Minecraft 1.20.1</h3><p>Подойдёт лицензия или аккаунт Ely.by — главное версия 1.20.1.</p></div>
              <div className="step reveal"><span className="num">2</span><h3>Добавь сервер</h3><p>Впиши адрес <strong>{IP}</strong>.</p></div>
              <div className="step reveal"><span className="num">3</span><h3>Проверка аккаунта</h3><p>При первом входе система проверит ваш аккаунт.</p></div>
              <div className="step reveal"><span className="num">4</span><h3>Загрузи ресурспак</h3><p>Появится окно — нажми «Да».</p></div>
            </div>
            <div className="step-note reveal">
              <strong>Важно:</strong> для корректной работы нейросети требуется лицензионный Minecraft или аккаунт Ely.by (https://ely.by/).
            </div>
          </div>
        </section>

        <section id="guard" aria-labelledby="guard-title">
          <div className="container">
            <div className="guard-block reveal">
              <h2 id="guard-title">Только для девушек — по-настоящему</h2>
              <p className="lead">
                Мы серьёзно следим за тем, чтобы сервер оставался уютным и безопасным. При первом входе твой аккаунт проходит проверку, а ресурспак — обязателен для всех.
              </p>
              <div className="guard-grid">
                <div className="guard-item"><span className="gi-icon">🔍</span><h4>Проверка аккаунта</h4><p>При первом входе нейросеть анализирует данные вашего аккаунта. Проверка быстрая и проходит один раз.</p></div>
                <div className="guard-item"><span className="gi-icon">💌</span><h4>Если ошиблась — пиши</h4><p>Если проверка не пропустила, напиши на почту themepyshow@gmail.com — модераторша разберётся вручную.</p></div>
                <div className="guard-item"><span className="gi-icon">🎀</span><h4>Ресурспак обязателен</h4><p>Без него на сервер не попасть. Пак скачается один раз, обновляется автоматически.</p></div>
                <div className="guard-item"><span className="gi-icon">🚪</span><h4>Случайных людей нет</h4><p>Без пройденной проверки и без ресурспака на сервер не попасть. Мы не пропускаем «на авось».</p></div>
                <div className="guard-item"><span className="gi-icon">📜</span><h4>Доверие и репутация</h4><p>Активные девушки получают очки доверия и могут стать частью команды.</p></div>
                <div className="guard-item"><span className="gi-icon">🌙</span><h4>Комфорт и безопасность</h4><p>Мобихи не агрятся на девушек, а PvP отключён. Мы делаем всё, чтобы каждая чувствовала себя спокойно.</p></div>
              </div>
            </div>
          </div>
        </section>

        <section id="rules" aria-labelledby="rules-title">
          <div className="container">
            <div className="rules-block reveal">
              <h2 id="rules-title">Правила</h2>
              <p className="lead">Всего три правила, которые делают наше комьюнити уютным.</p>
              <ul className="rules-list">
                <li><span><strong>Уважение прежде всего.</strong> Никакой токсичности, травли, грубости.</span></li>
                <li><span><strong>Только для девушек.</strong> Проверка при входе — это наша безопасность.</span></li>
                <li><span><strong>Играй честно.</strong> Без читов, дюпов и гриффинга чужих приватов.</span></li>
              </ul>
            </div>
          </div>
        </section>

        <section id="budget" aria-labelledby="budget-title">
          <div className="container">
            <div className="budget-block reveal">
              <h2 id="budget-title">Прозрачный бюджет</h2>
              <p className="lead">
                Мы открыто показываем, как развивается проект. Все средства идут на развитие сервера и его инфраструктуру.
              </p>

              {budgetLoading ? (
                <div className="budget-loading">Загрузка бюджета…</div>
              ) : budgetError ? (
                <div className="budget-error">{budgetError}</div>
              ) : operations.length === 0 ? (
                <div className="budget-loading">Пока нет операций для отображения.</div>
              ) : (
                <>
                  <div className="budget-grid">
                    <div className="budget-card income">
                      <div className="bc-label">Получено</div>
                      <div className="bc-value">{formatMoney(totals.income)}</div>
                    </div>
                    <div className="budget-card expense">
                      <div className="bc-label">Потрачено</div>
                      <div className="bc-value">{formatMoney(totals.expense)}</div>
                    </div>
                    <div className={`budget-card balance ${totals.balance < 0 ? 'negative' : ''}`}>
                      <div className="bc-label">В запасе</div>
                      <div className="bc-value">{formatMoney(totals.balance)}</div>
                    </div>
                  </div>

                  {totals.balance < 0 && (
                    <div className="budget-alert">
                      Сейчас баланс отрицательный — нуждаемся в вашей поддержке 😕
                    </div>
                  )}

                  <div className="budget-chart-wrap">
                    <div className="budget-chart-head">
                      <div>
                        <h3 className="budget-chart-title">График баланса</h3>
                        {budgetDate && <div className="budget-chart-date">данные на {budgetDate}</div>}
                      </div>
                      <div className="budget-range">
                        <button
                          type="button"
                          className={timeRange === 'month' ? 'active' : ''}
                          onClick={() => setTimeRange('month')}
                        >
                          Месяц
                        </button>
                        <button
                          type="button"
                          className={timeRange === 'all' ? 'active' : ''}
                          onClick={() => setTimeRange('all')}
                        >
                          Всё время
                        </button>
                      </div>
                    </div>
                    {filteredChartData.length === 0 ? (
                      <div className="budget-chart-empty">За выбранный период операций нет.</div>
                    ) : (
                      <div style={{ width: '100%', height: 350 }}>
                        <ResponsiveContainer>
                          <AreaChart data={filteredChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ff8ec7" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#ff8ec7" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#362148" />
                            <XAxis dataKey="date" stroke="#c9b3d9" fontSize={12} tickFormatter={(val) => val.slice(5)} />
                            <YAxis stroke="#c9b3d9" fontSize={12} tickFormatter={(val) => new Intl.NumberFormat('ru-RU').format(val)} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="linear" dataKey="balance" stroke="#ff8ec7" fillOpacity={1} fill="url(#colorBalance)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>

                  <div className="budget-history">
                    <h3>Последние операции</h3>
                    <table className="history-table">
                      <thead>
                        <tr>
                          <th>Дата</th>
                          <th>Категория</th>
                          <th>Описание</th>
                          <th style={{ textAlign: 'right' }}>Сумма</th>
                        </tr>
                      </thead>
                      <tbody>
                        {operations.slice(0, 10).map((op, i) => (
                          <tr key={`${op.date}-${op.category}-${i}`}>
                            <td className="h-date">{op.date}</td>
                            <td className="h-cat" data-desc={op.description || ''}>{op.category}</td>
                            <td className="h-desc">{op.description}</td>
                            <td className={`h-amount ${op.type}`}>
                              {op.type === 'income' ? '+' : '−'} {formatMoney(op.amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {operations.length > 10 && (
                      <div className="budget-more">
                        Показаны последние 10 из {operations.length} операций.
                      </div>
                    )}
                  </div>

                  <div className="budget-note">
                    <strong>Прозрачность:</strong> данные берутся из открытого файла <code>/budget.txt</code> и обновляются вручную.
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        <section id="sponsor" aria-labelledby="sponsor-title">
          <div className="container">
            <div className="sponsor-block reveal">
              <h2 id="sponsor-title">Поддержи сервер</h2>
              <p className="lead">
                Получи косметику, статус и спонсорские очки. Без pay-to-win. Всё купленное — навсегда.
              </p>
              <div className="perks-list">
                <div className="perk"><span className="icon">💫</span><div className="text"><strong>Ауры</strong><span>Сакура, звёзды, искры, магия</span></div></div>
                <div className="perk"><span className="icon">👣</span><div className="text"><strong>Следы шагов</strong><span>Красивые частицы за тобой</span></div></div>
                <div className="perk"><span className="icon">🏹</span><div className="text"><strong>Следы снарядов</strong><span>Огненные, ледяные, магические</span></div></div>
                <div className="perk"><span className="icon">🎨</span><div className="text"><strong>Цвета ников</strong><span>16 базовых, радужный, градиенты</span></div></div>
                <div className="perk"><span className="icon">💎</span><div className="text"><strong>SP навсегда</strong><span>Купленное не сгорает</span></div></div>
                <div className="perk"><span className="icon">🏆</span><div className="text"><strong>Топ спонсорш</strong><span>Признание и место в топе</span></div></div>
              </div>
              <button type="button" className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                Поддержать сервер
              </button>
              <div className="no-p2w">
                <strong>Мы принципиально без pay-to-win.</strong> Поддержка не даёт ни монет, ни вещей, ни силы, ни скорости, ни приватов. Только косметика и статус. 1 неделя поддержки = 50 SP.
              </div>
            </div>
          </div>
        </section>

        <section id="faq" aria-labelledby="faq-title">
          <div className="container">
            <h2 id="faq-title" className="section-title reveal">Частые вопросы</h2>
            <p className="section-sub reveal">Если что-то осталось непонятным — пиши на почту.</p>
            <div className="faq">
              {[
                { q: 'Как зайти на сервер?', a: `Открой Minecraft 1.20.1, добавь сервер с адресом ${IP} и заходи. При первом входе система проверит аккаунт, затем загрузится ресурспак.` },
                { q: 'Как вы проверяете, что я девушка?', a: 'При первом входе нейросеть анализирует данные аккаунта и определяет, женский ли это персонаж. Если она ошиблась — напиши на почту themepyshow@gmail.com.' },
                { q: 'Что за ресурспак?', a: 'Наш сборный ресурспак: красивые мобихи, звуки и текстуры. Обязателен для игры, ставится в один клик.' },
                { q: 'Нужна ли лицензия?', a: 'Для корректной работы нейросети требуется лицензионный Minecraft или аккаунт Ely.by (для пираток).' },
              ].map((item, index) => (
                <div key={index} className={`faq-item reveal ${activeFaq === index ? 'open' : ''}`}>
                  <button
                    type="button"
                    className="faq-q"
                    aria-expanded={activeFaq === index}
                    onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  >
                    {item.q} <span className="toggle">+</span>
                  </button>
                  <div className="faq-a" role="region"><div>{item.a}</div></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="container">
          <div className="footer-inner">
            <div className="logo">Girls Civilization</div>
            <div className="footer-links">
              <a href="https://t.me/girlsciv" target="_blank" rel="noopener noreferrer">Telegram-канал</a>
              <a href="mailto:themepyshow@gmail.com">Почта</a>
              <a href="/offer">Оферта</a>
              <a href="/privacy">Конфиденциальность</a>
            </div>
          </div>
          <div className="copyright">
            <span>©</span> {currentYear ?? ''} Girls Civilization. Minecraft — торговая марка Mojang AB.
          </div>
        </div>
      </footer>

      {isModalOpen && (
        <div className="modal-overlay show" onClick={() => setIsModalOpen(false)}>
          <div
            className="modal"
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="support-modal-title"
          >
            <button type="button" className="modal-close" onClick={() => setIsModalOpen(false)} aria-label="Закрыть">×</button>
            
            <h3 id="support-modal-title">Поддержать сервер</h3>
            <p className="modal-sub">Выбери количество недель. Роль и SP начислим автоматически после оплаты.</p>
            
            <div className="weeks-row">
              <button type="button" className="weeks-btn" onClick={() => changeWeeks(-1)} disabled={weeks <= 1} aria-label="Уменьшить количество недель">−</button>
              <div className="weeks-num">{weeks}</div>
              <button type="button" className="weeks-btn" onClick={() => changeWeeks(1)} disabled={weeks >= 52} aria-label="Увеличить количество недель">+</button>
            </div>
            <div className="weeks-label">{weeks} {pluralizeWeeks(weeks)} поддержки</div>
            
            <div className="price-display">
              <div className="price-total">{formatMoney(weeks * PRICE_PER_WEEK)}</div>
              <div className="price-detail">{weeks} × {formatMoney(PRICE_PER_WEEK)}</div>
              <div className="sp-total">+{weeks * SP_PER_WEEK} SP</div>
            </div>

            {/* НОВОЕ ПОЛЕ: Ввод ника */}
            <div style={{ marginBottom: '20px', textAlign: 'left' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-soft)' }}>
                Твой ник в Minecraft
              </label>
              <input 
                type="text" 
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Например: Liza_Craft"
                style={{
                  width: '100%', 
                  padding: '14px 16px', 
                  borderRadius: '12px', 
                  border: '1px solid var(--line)',
                  background: 'rgba(255,255,255,0.05)', 
                  color: 'var(--text)',
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--pink)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--line)'}
              />
            </div>

            {/* НОВАЯ КНОПКА: Вызов оплаты */}
            <button 
              type="button" 
              className="btn btn-primary" 
              style={{ width: '100%', justifyContent: 'center', fontSize: '17px', padding: '18px 32px' }}
              onClick={handlePay}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Переход к оплате...' : `Оплатить ${formatMoney(weeks * PRICE_PER_WEEK)}`}
            </button>
            
            <div className="modal-note">
              <strong>Как это работает:</strong> после оплаты донат и роль начислятся автоматически в течение 1-2 минут. Игрок должен быть в сети.
            </div>
          </div>
        </div>
      )}

      <div className={`toast ${toastMessage ? 'show' : ''}`} role="status" aria-live="polite">
        {toastMessage}
      </div>
    </>
  );
}
