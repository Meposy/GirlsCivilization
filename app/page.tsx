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

// Плюрализация: 1 неделя / 2 недели / 5 недель (учитывает 21, 22, 23, 24)
const pluralizeWeeks = (n: number) => {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'неделя';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'недели';
  return 'недель';
};

// Красивый тултип графика
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  // Бюджет
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
  const IP = 'mc.girlsciv.run.place';
  const screenshots = [
    { src: '/screen1.png', alt: 'Уютная деревня на сервере Girls Civilization' },
    { src: '/screen2.png', alt: 'Гильдейский замок на закате' },
    { src: '/screen3.png', alt: 'NPC-жительница в цветущем саду' },
    { src: '/screen4.png', alt: 'Аукцион и торговые лавки' },
    { src: '/screen5.png', alt: 'Косметические ауры у игроков' },
    { src: '/screen6.png', alt: 'Защищённый приват с флагами' },
    { src: '/screen7.png', alt: 'Банк и вклады в экономике сервера' },
    { src: '/screen8.png', alt: 'Следы шагов и частицы' },
    { src: '/screen9.png', alt: 'Цветные ники и статусы' },
    { src: '/screen10.png', alt: 'Гильдейская казна' },
    { src: '/screen11.png', alt: 'Ночной вид на спавн' },
  ];

  // Reveal-анимация
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

  // Загрузка бюджета
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

          // Если число с минусом — это расход. Если без — доход.
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

        // Итоги
        let totalIncome = 0;
        let totalExpense = 0;
        parsedOps.forEach((op) => {
          if (op.type === 'income') totalIncome += op.amount;
          else totalExpense += op.amount;
        });
        setTotals({ income: totalIncome, expense: totalExpense, balance: totalIncome - totalExpense });

        // Группировка по дате для графика
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

        setOperations([...parsedOps].reverse()); // свежие сверху
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

  // Фильтр графика по реальным датам, а не по количеству точек
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

  // Escape + фокус-трап для модалки
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
      {/* Встроенные стили — без создания новых файлов */}
      <style jsx global>{`
        @media (max-width: 640px) {
          .ops-table thead { display: none; }
          .ops-table,
          .ops-table tbody,
          .ops-table tr,
          .ops-table td { display: block; width: 100%; }
          .ops-table tr {
            border: 1px solid #4a2e63;
            border-radius: 12px;
            padding: 12px;
            margin-bottom: 12px;
            background: rgba(255, 255, 255, 0.03);
          }
          .ops-table td {
            padding: 6px 0 !important;
            text-align: left !important;
            border: none !important;
          }
          .ops-table td::before {
            content: attr(data-label) ': ';
            color: #c9b3d9;
            font-weight: normal;
            margin-right: 6px;
          }
          .ops-table td[data-label='Сумма'] {
            text-align: right !important;
            font-size: 16px;
            margin-top: 6px;
          }
          .ops-table td[data-label='Сумма']::before { content: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .shots-viewport [style*='transition'] { transition: none !important; }
          .reveal { transition: none !important; }
        }
        button:focus-visible,
        a:focus-visible,
        [tabindex]:focus-visible {
          outline: 2px solid #ff8ec7;
          outline-offset: 3px;
        }
      `}</style>

      <a className="skip-link" href="#main">К содержанию</a>

      {/* НАВИГАЦИЯ */}
      <nav aria-label="Основная навигация">
        <div className="container nav-inner">
          <div className="logo">Girls Civilization</div>
          <div className="nav-links">
            <a href="#about">О сервере</a>
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
              style={{ marginTop: '8px' }}
            >
              <span>Поддержать</span>
            </button>
          </div>
        </div>
      </nav>

      <main id="main">
        {/* ГЕРОЙ */}
        <header className="hero">
          <div className="container">
            <div className="hero-badge" style={{ marginBottom: '16px' }}>Только для девушек</div>
            <div className="online-badge" data-state="online">
              <span className="dot"></span>
              <span>Сервер работает 24/7</span>
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

        {/* СКРИНШОТЫ */}
        <section id="shots" className="shots" aria-labelledby="shots-title">
          <div className="container">
            <h2 id="shots-title" className="section-title reveal">Наш мир</h2>
            <p className="section-sub reveal">
              Немного атмосферы — чтобы ты почувствовала, каково это, ещё до входа.
            </p>
          </div>
          <div className="shots-wrap reveal">
            <div
              className="shots-viewport"
              style={{ position: 'relative', overflow: 'hidden', borderRadius: '24px', border: '1px solid #4a2e63' }}
            >
              <div
                style={{
                  display: 'flex',
                  transition: 'transform 0.5s ease',
                  transform: `translateX(-${currentSlide * 100}%)`,
                }}
              >
                {screenshots.map((s, i) => (
                  <img
                    key={s.src}
                    src={s.src}
                    alt={s.alt}
                    loading={i === 0 ? 'eager' : 'lazy'}
                    width={1280}
                    height={720}
                    style={{ width: '100%', flexShrink: 0, objectFit: 'cover', aspectRatio: '16/9' }}
                  />
                ))}
              </div>
              <button
                type="button"
                aria-label="Предыдущий скриншот"
                onClick={() => goToSlide(-1)}
                style={{
                  position: 'absolute', top: '50%', left: '20px', transform: 'translateY(-50%)',
                  background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none',
                  borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', fontSize: '20px',
                }}
              >
                ‹
              </button>
              <button
                type="button"
                aria-label="Следующий скриншот"
                onClick={() => goToSlide(1)}
                style={{
                  position: 'absolute', top: '50%', right: '20px', transform: 'translateY(-50%)',
                  background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none',
                  borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', fontSize: '20px',
                }}
              >
                ›
              </button>
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)',
                  display: 'flex', gap: '6px',
                }}
              >
                {screenshots.map((_, i) => (
                  <span
                    key={i}
                    style={{
                      width: i === currentSlide ? '20px' : '8px',
                      height: '8px',
                      borderRadius: '4px',
                      background: i === currentSlide ? '#ff8ec7' : 'rgba(255,255,255,0.4)',
                      transition: 'all 0.3s ease',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* О СЕРВЕРЕ */}
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

        {/* КАК НАЧАТЬ */}
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

        {/* ПРОВЕРКА */}
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

        {/* ПРАВИЛА */}
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

        {/* БЮДЖЕТ */}
        <section id="budget" aria-labelledby="budget-title">
          <div className="container">
            <div className="budget-block reveal">
              <h2 id="budget-title">Прозрачный бюджет</h2>
              <p className="lead">
                Мы открыто показываем, как развивается проект. Все средства идут на развитие сервера и его инфраструктуру.
              </p>

              {budgetLoading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#c9b3d9' }}>Загрузка бюджета…</div>
              ) : budgetError ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#ff8e8e' }}>{budgetError}</div>
              ) : operations.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#c9b3d9' }}>Пока нет операций для отображения.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
                      gap: '16px',
                    }}
                  >
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '16px', border: '1px solid #4a2e63', textAlign: 'center' }}>
                      <div style={{ fontSize: '14px', color: '#c9b3d9', marginBottom: '8px' }}>Получено</div>
                      <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#7be0a0' }}>{formatMoney(totals.income)}</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '16px', border: '1px solid #4a2e63', textAlign: 'center' }}>
                      <div style={{ fontSize: '14px', color: '#c9b3d9', marginBottom: '8px' }}>Потрачено</div>
                      <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#ff8e8e' }}>{formatMoney(totals.expense)}</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '16px', border: '1px solid #4a2e63', textAlign: 'center' }}>
                      <div style={{ fontSize: '14px', color: '#c9b3d9', marginBottom: '8px' }}>В запасе</div>
                      <div style={{ fontSize: '28px', fontWeight: 'bold', color: totals.balance >= 0 ? '#ffd76e' : '#ff8e8e' }}>
                        {formatMoney(totals.balance)}
                      </div>
                    </div>
                  </div>

                  {totals.balance < 0 && (
                    <div
                      style={{
                        background: 'rgba(255,142,142,0.1)',
                        padding: '16px',
                        borderRadius: '12px',
                        border: '1px solid rgba(255,142,142,0.3)',
                        color: '#ff8e8e',
                        textAlign: 'center',
                      }}
                    >
                      Сейчас баланс отрицательный — помоги серверу остаться онлайн.
                    </div>
                  )}

                  {/* ГРАФИК */}
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px', border: '1px solid #4a2e63' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '16px',
                        flexWrap: 'wrap',
                        gap: '10px',
                      }}
                    >
                      <div>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#fbeaff', margin: 0 }}>График баланса</h3>
                        {budgetDate && (
                          <div style={{ fontSize: '12px', color: '#c9b3d9', marginTop: '4px' }}>
                            данные на {budgetDate}
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => setTimeRange('month')}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            border: '1px solid #4a2e63',
                            background: timeRange === 'month' ? '#ff8ec7' : 'transparent',
                            color: timeRange === 'month' ? '#fff' : '#c9b3d9',
                            cursor: 'pointer',
                          }}
                        >
                          Месяц
                        </button>
                        <button
                          type="button"
                          onClick={() => setTimeRange('all')}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            border: '1px solid #4a2e63',
                            background: timeRange === 'all' ? '#ff8ec7' : 'transparent',
                            color: timeRange === 'all' ? '#fff' : '#c9b3d9',
                            cursor: 'pointer',
                          }}
                        >
                          Всё время
                        </button>
                      </div>
                    </div>
                    {filteredChartData.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '40px', color: '#c9b3d9' }}>
                        За выбранный период операций нет.
                      </div>
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
                            <XAxis
                              dataKey="date"
                              stroke="#c9b3d9"
                              fontSize={12}
                              tickFormatter={(val) => val.slice(5)}
                            />
                            <YAxis
                              stroke="#c9b3d9"
                              fontSize={12}
                              tickFormatter={(val) => new Intl.NumberFormat('ru-RU').format(val)}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                              type="linear"
                              dataKey="balance"
                              stroke="#ff8ec7"
                              fillOpacity={1}
                              fill="url(#colorBalance)"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>

                  {/* ТАБЛИЦА ОПЕРАЦИЙ */}
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px', border: '1px solid #4a2e63' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#fbeaff' }}>
                      Последние операции
                    </h3>
                    <table className="ops-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #4a2e63', color: '#c9b3d9', textAlign: 'left' }}>
                          <th style={{ padding: '10px' }}>Дата</th>
                          <th style={{ padding: '10px' }}>Категория</th>
                          <th style={{ padding: '10px' }}>Описание</th>
                          <th style={{ padding: '10px', textAlign: 'right' }}>Сумма</th>
                        </tr>
                      </thead>
                      <tbody>
                        {operations.slice(0, 10).map((op, i) => (
                          <tr key={`${op.date}-${op.category}-${i}`} style={{ borderBottom: '1px solid #362148', color: '#fbeaff' }}>
                            <td data-label="Дата" style={{ padding: '10px', color: '#c9b3d9' }}>{op.date}</td>
                            <td data-label="Категория" style={{ padding: '10px', fontWeight: 'bold' }}>{op.category}</td>
                            <td data-label="Описание" style={{ padding: '10px', color: '#c9b3d9' }}>{op.description}</td>
                            <td
                              data-label="Сумма"
                              style={{
                                padding: '10px',
                                textAlign: 'right',
                                fontWeight: 'bold',
                                color: op.type === 'income' ? '#7be0a0' : '#ff8e8e',
                              }}
                            >
                              {op.type === 'income' ? '+' : '−'} {formatMoney(op.amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {operations.length > 10 && (
                      <div style={{ fontSize: '13px', color: '#c9b3d9', marginTop: '12px', textAlign: 'center' }}>
                        Показаны последние 10 из {operations.length} операций.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* СПОНСОР */}
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

        {/* FAQ */}
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
                    {item.q} <span className="toggle">{activeFaq === index ? '−' : '+'}</span>
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
            <span>©</span> {new Date().getFullYear()} Girls Civilization. Minecraft — торговая марка Mojang AB.
          </div>
        </div>
      </footer>

      {/* МОДАЛКА */}
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
            <button
              type="button"
              className="modal-close"
              onClick={() => setIsModalOpen(false)}
              aria-label="Закрыть"
            >
              ×
            </button>
            <h3 id="support-modal-title">Поддержать сервер</h3>
            <p className="modal-sub">
              Выбери количество недель. Роль и SP начислим автоматически после оплаты.
            </p>
            <div className="weeks-presets" style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
              {[1, 4, 12, 26].map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setWeeks(w)}
                  style={{
                    flex: '1 1 auto',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #4a2e63',
                    background: weeks === w ? '#ff8ec7' : 'transparent',
                    color: weeks === w ? '#fff' : '#c9b3d9',
                    cursor: 'pointer',
                    fontSize: '13px',
                  }}
                >
                  {w} {pluralizeWeeks(w)}
                </button>
              ))}
            </div>
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
            <a
              href="https://t.me/girlsciv"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', textDecoration: 'none', boxSizing: 'border-box' }}
            >
              Оплата скоро — написать в Telegram
            </a>
            <div className="modal-note">
              <strong>Как это работает:</strong> оплата и выдача роли — автоматически через ЮKassa. Пока оплата не подключена, напиши нам в Telegram, и мы поможем вручную.
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
