'use client';

import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type Operation = {
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: string;
  description: string;
};

export default function Home() {
  const [ipCopied, setIpCopied] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [weeks, setWeeks] = useState(1);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  // Состояния для бюджета
  const [operations, setOperations] = useState<Operation[]>([]);
  const [budgetLoading, setBudgetLoading] = useState(true);
  const [totals, setTotals] = useState({ income: 0, expense: 0, balance: 0 });
  const [chartData, setChartData] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState<'all' | 'month'>('all');

  const PRICE_PER_WEEK = 99;
  const SP_PER_WEEK = 50;
  const screenshots = ['/screen1.jpg', '/screen2.jpg', '/screen3.jpg', '/screen4.jpg'];

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

    fetch('/budget.txt')
      .then((res) => {
        if (!res.ok) throw new Error('Файл не найден');
        return res.text();
      })
      .then((text) => {
        const lines = text.split('\n').filter((line) => line.trim() !== '');
        const parsedOps: Operation[] = lines.map((line) => {
          const [category, amountStr, date, description] = line.split('|').map((s) => s.trim());
          const amount = parseInt(amountStr) || 0;
          const isExpense = category.toLowerCase().includes('оплата') || category.toLowerCase().includes('реклама') || category.toLowerCase().includes('хостинг') || category.toLowerCase().includes('домен');
          
          return { type: isExpense ? 'expense' : 'income', category, amount, date, description };
        });

        // Считаем общие итоги
        let totalIncome = 0;
        let totalExpense = 0;
        parsedOps.forEach((op) => {
          if (op.type === 'income') totalIncome += op.amount;
          else totalExpense += op.amount;
        });
        setTotals({ income: totalIncome, expense: totalExpense, balance: totalIncome - totalExpense });

        // Готовим данные для графика (группируем по датам)
        const grouped = parsedOps.reduce((acc, op) => {
          if (!acc[op.date]) acc[op.date] = { date: op.date, income: 0, expense: 0 };
          if (op.type === 'income') acc[op.date].income += op.amount;
          else acc[op.date].expense += op.amount;
          return acc;
        }, {} as Record<string, any>);

        const sortedDates = Object.keys(grouped).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
        let runningBalance = 0;
        
        const allChartData = sortedDates.map(date => {
          runningBalance += grouped[date].income - grouped[date].expense;
          return { ...grouped[date], balance: runningBalance };
        });

        setOperations(parsedOps.reverse());
        setChartData(allChartData);
        setBudgetLoading(false);
      })
      .catch((err) => {
        console.error('Ошибка бюджета:', err);
        setBudgetLoading(false);
      });

    return () => observer.disconnect();
  }, []);

  // Фильтрация графика по времени
  const filteredChartData = timeRange === 'month' 
    ? chartData.slice(-30) // Упрощенно берем последние 30 записей (дней с операциями)
    : chartData;

  const copyIp = () => {
    const ip = "mc.girlsciv.run.place";
    navigator.clipboard.writeText(ip).then(() => {
      setIpCopied(true);
      showToast(`IP скопирован: ${ip}`);
      setTimeout(() => setIpCopied(false), 2000);
    });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const changeWeeks = (amount: number) => {
    setWeeks((prev) => Math.max(1, Math.min(52, prev + amount)));
  };

  const formatMoney = (num: number) => new Intl.NumberFormat('ru-RU').format(num) + ' ₽';

  return (
    <>
      <a className="skip-link" href="#main">К содержанию</a>

      {/* ... НАВИГАЦИЯ ... */}
      <nav aria-label="Основная навигация" id="siteNav">
        <div className="container nav-inner">
          <div className="logo">Girls Civilization</div>
          <div className="nav-links">
            <a href="#about">О сервере</a>
            <a href="#shots">Скриншоты</a>
            <a href="#start">Как начать</a>
            <a href="#guard">Проверка</a>
            <a href="#rules">Правила</a>
            <a href="#budget">Бюджет</a>
            <a href="#sponsor">Поддержать</a>
            <a href="#faq">FAQ</a>
            <a href="https://t.me/girlsciv" target="_blank" rel="noopener noreferrer" className="nav-tg">Telegram</a>
            <button type="button" className="nav-cta" onClick={() => setIsModalOpen(true)}><span>Поддержать</span></button>
          </div>
          <button type="button" className="burger" aria-label="Открыть меню" aria-expanded={isMobileMenuOpen} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <span></span><span></span><span></span>
          </button>
        </div>
        <div className="container">
          <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
            <a href="#about" onClick={() => setIsMobileMenuOpen(false)}>О сервере</a>
            <a href="#shots" onClick={() => setIsMobileMenuOpen(false)}>Скриншоты</a>
            <a href="#start" onClick={() => setIsMobileMenuOpen(false)}>Как начать</a>
            <a href="#guard" onClick={() => setIsMobileMenuOpen(false)}>Проверка</a>
            <a href="#rules" onClick={() => setIsMobileMenuOpen(false)}>Правила</a>
            <a href="#budget" onClick={() => setIsMobileMenuOpen(false)}>Бюджет</a>
            <a href="#sponsor" onClick={() => setIsMobileMenuOpen(false)}>Поддержать</a>
            <a href="#faq" onClick={() => setIsMobileMenuOpen(false)}>FAQ</a>
            <a href="https://t.me/girlsciv" target="_blank" rel="noopener noreferrer">Telegram</a>
            <button type="button" className="nav-cta" onClick={() => { setIsModalOpen(true); setIsMobileMenuOpen(false); }} style={{marginTop: '8px'}}><span>Поддержать</span></button>
          </div>
        </div>
      </nav>

      <main id="main">
        {/* ... ГЕРОЙ ... */}
        <header className="hero">
          <div className="container">
            <div className="hero-badge">Только для девушек</div>
            <div className="online-badge" data-state="online"><span className="dot"></span><span>Сервер работает 24/7</span></div>
            <h1>Уютный Minecraft<br/>только для нас</h1>
            <p className="subtitle">Girls Civilization — сообщество девушек, где можно строить, дружить и отдыхать. Косметика, NPC-жительницы, аукцион, приваты, гильдии. Без pay-to-win.</p>
            <button type="button" className={`ip-box ${ipCopied ? 'copied' : ''}`} onClick={copyIp}>
              <span>mc.girlsciv.run.place</span>
              <span className="copy-hint">{ipCopied ? '✓ скопировано!' : 'нажми, чтобы скопировать'}</span>
            </button>
            <div className="hero-buttons">
              <button type="button" className="btn btn-primary" onClick={() => setIsModalOpen(true)}>Поддержать сервер</button>
              <a href="https://t.me/girlsciv" target="_blank" rel="noopener noreferrer" className="btn btn-tg">Telegram-канал</a>
              <a href="#start" className="btn btn-ghost">Как начать</a>
            </div>
          </div>
        </header>

        {/* ... СКРИНШОТЫ ... */}
        <section id="shots" className="shots">
          <div className="container"><h2 className="section-title reveal">Как у нас выглядит</h2><p className="section-sub reveal">Немного атмосферы — чтобы ты почувствовала, каково это, ещё до входа.</p></div>
          <div className="shots-wrap reveal">
            <div className="shots-viewport" style={{ position: 'relative', overflow: 'hidden', borderRadius: '24px', border: '1px solid #4a2e63' }}>
              <div style={{ display: 'flex', transition: 'transform 0.5s ease', transform: `translateX(-${currentSlide * 100}%)` }}>
                {screenshots.map((src, i) => <img key={i} src={src} alt={`Скриншот ${i + 1}`} style={{ width: '100%', flexShrink: 0, objectFit: 'cover', aspectRatio: '16/9' }} />)}
              </div>
              <button onClick={() => setCurrentSlide((prev) => (prev === 0 ? screenshots.length - 1 : prev - 1))} style={{ position: 'absolute', top: '50%', left: '20px', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', fontSize: '20px' }}>‹</button>
              <button onClick={() => setCurrentSlide((prev) => (prev === screenshots.length - 1 ? 0 : prev + 1))} style={{ position: 'absolute', top: '50%', right: '20px', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', fontSize: '20px' }}>›</button>
            </div>
          </div>
        </section>

        {/* ... О СЕРВЕРЕ ... */}
        <section id="about">
          <div className="container">
            <h2 className="section-title reveal">Что у нас есть</h2>
            <p className="section-sub reveal">Мы создали место, где девушки могут спокойно играть, строить и общаться.</p>
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

        {/* ... КАК НАЧАТЬ ... */}
        <section id="start">
          <div className="container">
            <h2 className="section-title reveal">Как начать играть</h2>
            <p className="section-sub reveal">Четыре шага — и ты в уютном мире.</p>
            <div className="steps">
              <div className="step reveal"><span className="num">1</span><h3>Открой Minecraft 1.20.1</h3><p>Подойдёт лицензия или аккаунт Ely.by — главное версия 1.20.1.</p></div>
              <div className="step reveal"><span className="num">2</span><h3>Добавь сервер</h3><p>Впиши адрес <strong>mc.girlsciv.run.place</strong>.</p></div>
              <div className="step reveal"><span className="num">3</span><h3>Проверка аккаунта</h3><p>При первом входе система проверит ваш аккаунт.</p></div>
              <div className="step reveal"><span className="num">4</span><h3>Загрузи ресурспак</h3><p>Появится окно — нажми «Да».</p></div>
            </div>
            <div className="step-note reveal"><strong>Важно:</strong> для корректной работы нейросети требуется лицензионный Minecraft или аккаунт Ely.by (https://ely.by/).</div>
          </div>
        </section>

        {/* ... ПРОВЕРКА ... */}
        <section id="guard">
          <div className="container">
            <div className="guard-block reveal">
              <h2>Только для девушек — по-настоящему</h2>
              <p className="lead">Мы серьёзно следим за тем, чтобы сервер оставался уютным и безопасным. При первом входе твой аккаунт проходит проверку, а ресурспак — обязателен для всех.</p>
              <div className="guard-grid">
                <div className="guard-item"><span className="gi-icon">🔍</span><h4>Проверка аккаунта</h4><p>При первом входе нейросеть анализирует данные вашего аккаунта. Проверка быстрая и проходит один раз.</p></div>
                <div className="guard-item"><span className="gi-icon">💌</span><h4>Если ошиблась — пиши</h4><p>Если проверка не пропустила, напиши на почту themepyshow@gmail.com — модераторша разберётся вручную.</p></div>
                <div className="guard-item"><span className="gi-icon">🎀</span><h4>Ресурспак обязателен</h4><p>Без него на сервер не попасть. Пак скачается один раз, обновляется автоматически.</p></div>
                <div className="guard-item"><span className="gi-icon">🚪</span><h4>Случайных людей нет</h4><p>Без пройденной проверки и без ресурспака на сервер не попасть. Мы не пропускаем «на авось».</p></div>
                <div className="guard-item"><span className="gi-icon">📜</span><h4>Доверие и репутация</h4><p>Активные девушки получают очки доверия и могут стать частью команды.</p></div>
                <div className="guard-item"><span className="gi-icon">🌙</span><h4>Комфорт и безопасность</h4><p>Мобы не агрятся на девушек, а PvP отключён. Мы делаем всё, чтобы каждая чувствовала себя спокойно.</p></div>
              </div>
            </div>
          </div>
        </section>

        {/* ... ПРАВИЛА (СОКРАЩЕНЫ ДО 3) ... */}
        <section id="rules">
          <div className="container">
            <div className="rules-block reveal">
              <h2>Правила</h2>
              <p className="lead">Всего три правила, которые делают наше комьюнити уютным.</p>
              <ul className="rules-list">
                <li><span><strong>Уважение прежде всего.</strong> Никакой токсичности, травли, грубости и NSFW.</span></li>
                <li><span><strong>Только для девушек.</strong> Проверка при входе — это наша безопасность.</span></li>
                <li><span><strong>Играй честно.</strong> Без читов, дюпов и гриффинга чужих приватов.</span></li>
              </ul>
            </div>
          </div>
        </section>

        {/* ... БЮДЖЕТ С ГРАФИКОМ ... */}
        <section id="budget">
          <div className="container">
            <div className="budget-block reveal">
              <h2>Прозрачный бюджет</h2>
              <p className="lead">Мы открыто показываем, как развивается проект. Все средства идут на развитие сервера и его инфраструктуру.</p>
              
              {budgetLoading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#c9b3d9' }}>Загрузка бюджета...</div>
              ) : operations.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#c9b3d9' }}>Пока нет операций для отображения.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  
                  {/* Карточки итогов */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
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
                      <div style={{ fontSize: '28px', fontWeight: 'bold', color: totals.balance >= 0 ? '#ffd76e' : '#ff8e8e' }}>{formatMoney(totals.balance)}</div>
                    </div>
                  </div>

                  {totals.balance < 0 && (
                    <div style={{ background: 'rgba(255,142,142,0.1)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,142,142,0.3)', color: '#ff8e8e', textAlign: 'center' }}>
                      К сожалению, сервер сейчас нуждается в поддержке :(
                    </div>
                  )}

                  {/* ГРАФИК */}
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px', border: '1px solid #4a2e63' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#fbeaff' }}>График баланса</h3>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => setTimeRange('month')} style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #4a2e63', background: timeRange === 'month' ? '#ff8ec7' : 'transparent', color: timeRange === 'month' ? '#fff' : '#c9b3d9', cursor: 'pointer' }}>Месяц</button>
                        <button onClick={() => setTimeRange('all')} style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #4a2e63', background: timeRange === 'all' ? '#ff8ec7' : 'transparent', color: timeRange === 'all' ? '#fff' : '#c9b3d9', cursor: 'pointer' }}>Всё время</button>
                      </div>
                    </div>
                    <div style={{ width: '100%', height: 300 }}>
                      <ResponsiveContainer>
                        <AreaChart data={filteredChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#ff8ec7" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#ff8ec7" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#362148" />
                          <XAxis dataKey="date" stroke="#c9b3d9" fontSize={12} tickFormatter={(val) => val.slice(5)} />
                          <YAxis stroke="#c9b3d9" fontSize={12} tickFormatter={(val) => `${val} ₽`} />
                          <Tooltip 
                            contentStyle={{ background: '#2b1a3d', border: '1px solid #4a2e63', borderRadius: '8px', color: '#fbeaff' }} 
                            formatter={(value: number) => [`${formatMoney(value)}`, 'Баланс']}
                            labelFormatter={(label) => `Дата: ${label}`}
                          />
                          <Area type="monotone" dataKey="balance" stroke="#ff8ec7" fillOpacity={1} fill="url(#colorBalance)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Таблица операций */}
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px', border: '1px solid #4a2e63', overflowX: 'auto' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#fbeaff' }}>Последние операции</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
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
                          <tr key={i} style={{ borderBottom: '1px solid #362148', color: '#fbeaff' }}>
                            <td style={{ padding: '10px', color: '#c9b3d9' }}>{op.date}</td>
                            <td style={{ padding: '10px', fontWeight: 'bold' }}>{op.category}</td>
                            <td style={{ padding: '10px', color: '#c9b3d9' }}>{op.description}</td>
                            <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold', color: op.type === 'income' ? '#7be0a0' : '#ff8e8e' }}>
                              {op.type === 'income' ? '+' : '−'} {formatMoney(op.amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ... СПОНСОР ... */}
        <section id="sponsor">
          <div className="container">
            <div className="sponsor-block reveal">
              <h2>Поддержи сервер</h2>
              <p className="lead">Получи косметику, статус и спонсорские очки. Без pay-to-win. Всё купленное — навсегда.</p>
              <div className="perks-list">
                <div className="perk"><span className="icon">💫</span><div className="text"><strong>Ауры</strong><span>Сакура, звёзды, искры, магия</span></div></div>
                <div className="perk"><span className="icon">👣</span><div className="text"><strong>Следы шагов</strong><span>Красивые частицы за тобой</span></div></div>
                <div className="perk"><span className="icon">🏹</span><div className="text"><strong>Следы снарядов</strong><span>Огненные, ледяные, магические</span></div></div>
                <div className="perk"><span className="icon">🎨</span><div className="text"><strong>Цвета ников</strong><span>16 базовых, радужный, градиенты</span></div></div>
                <div className="perk"><span className="icon">💎</span><div className="text"><strong>SP навсегда</strong><span>Купленное не сгорает</span></div></div>
                <div className="perk"><span className="icon">🏆</span><div className="text"><strong>Топ спонсорш</strong><span>Признание и место в топе</span></div></div>
              </div>
              <button type="button" className="btn btn-primary" onClick={() => setIsModalOpen(true)}>Поддержать сервер</button>
              <div className="no-p2w"><strong>Мы принципиально без pay-to-win.</strong> Поддержка не даёт ни монет, ни вещей, ни силы, ни скорости, ни приватов. Только косметика и статус. 1 неделя поддержки = 50 SP.</div>
            </div>
          </div>
        </section>

        {/* ... FAQ ... */}
        <section id="faq">
          <div className="container">
            <h2 className="section-title reveal">Частые вопросы</h2>
            <p className="section-sub reveal">Если что-то осталось непонятным — пиши на почту.</p>
            <div className="faq">
              {[
                { q: "Как зайти на сервер?", a: "Открой Minecraft 1.20.1, добавь сервер с адресом mc.girlsciv.run.place и заходи. При первом входе система проверит аккаунт, затем загрузится ресурспак." },
                { q: "Как вы проверяете, что я девушка?", a: "При первом входе нейросеть анализирует данные аккаунта и определяет, женский ли это персонаж. Если она ошиблась — напиши на почту themepyshow@gmail.com." },
                { q: "Что за ресурспак?", a: "Наш сборный ресурспак: красивые мобихи, звуки и текстуры. Обязателен для игры, ставится в один клик." },
                { q: "Нужна ли лицензия?", a: "Для корректной работы нейросети требуется лицензионный Minecraft или аккаунт Ely.by (для пираток)." },
              ].map((item, index) => (
                <div key={index} className={`faq-item reveal ${activeFaq === index ? 'open' : ''}`}>
                  <button type="button" className="faq-q" aria-expanded={activeFaq === index} onClick={() => setActiveFaq(activeFaq === index ? null : index)}>
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
          <div className="copyright"><span>©</span> 2026 Girls Civilization. Minecraft — торговая марка Mojang AB.</div>
        </div>
      </footer>

      {/* Модалка */}
      {isModalOpen && (
        <div className="modal-overlay show" onClick={() => setIsModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <button type="button" className="modal-close" onClick={() => setIsModalOpen(false)}>×</button>
            <h3>Поддержать сервер</h3>
            <p className="modal-sub">Выбери количество недель. Роль и SP начислим автоматически после оплаты.</p>
            <div className="weeks-row">
              <button type="button" className="weeks-btn" onClick={() => changeWeeks(-1)} disabled={weeks <= 1}>−</button>
              <div className="weeks-num">{weeks}</div>
              <button type="button" className="weeks-btn" onClick={() => changeWeeks(1)} disabled={weeks >= 52}>+</button>
            </div>
            <div className="weeks-label">{weeks} {weeks === 1 ? 'неделя' : (weeks < 5 ? 'недели' : 'недель')} поддержки</div>
            <div className="price-display">
              <div className="price-total">₽ {weeks * PRICE_PER_WEEK}</div>
              <div className="price-detail">{weeks} недель × {PRICE_PER_WEEK} ₽</div>
              <div className="sp-total">+{weeks * SP_PER_WEEK} SP</div>
            </div>
            <button className="btn btn-primary" style={{width: '100%', justifyContent: 'center', opacity: 0.7, cursor: 'not-allowed'}} disabled>
              Оплата через ЮKassa (скоро)
            </button>
            <div className="modal-note"><strong>Как это работает:</strong> оплата и выдача роли — автоматически через ЮKassa.</div>
          </div>
        </div>
      )}

      <div className={`toast ${toastMessage ? 'show' : ''}`} role="status">{toastMessage}</div>
    </>
  );
}
