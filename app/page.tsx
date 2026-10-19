'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [ipCopied, setIpCopied] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [weeks, setWeeks] = useState(1);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Цена: 99 руб за 50 SP
  const PRICE_PER_WEEK = 99;
  const SP_PER_WEEK = 50;

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

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

  const screenshots = ['/screen1.jpg', '/screen2.jpg', '/screen3.jpg', '/screen4.jpg'];

  return (
    <>
      <a className="skip-link" href="#main">К содержанию</a>

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
          <button 
            type="button" 
            className="burger" 
            aria-label="Открыть меню" 
            aria-expanded={isMobileMenuOpen} 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
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
        <header className="hero">
          <div className="container">
            <div className="hero-badge">Только для девушек</div>
            <div className="online-badge" data-state="online" aria-live="polite" aria-atomic="true">
              <span className="dot" aria-hidden="true"></span>
              <span>Сервер работает 24/7</span>
            </div>
            
            <h1>Уютный Minecraft<br/>только для нас</h1>
            <p className="subtitle">Girls Civilization — сообщество девушек, где можно строить, дружить и отдыхать. Косметика, NPC-жительницы, аукцион, приваты, гильдии. Без pay-to-win.</p>
            
            <button 
              type="button" 
              className={`ip-box ${ipCopied ? 'copied' : ''}`} 
              onClick={copyIp} 
              aria-label="Скопировать IP сервера mc.girlsciv.run.place"
            >
              <span>mc.girlsciv.run.place</span>
              <span className="copy-hint" aria-hidden="true">{ipCopied ? '✓ скопировано!' : 'нажми, чтобы скопировать'}</span>
            </button>
            
            <div className="hero-buttons">
              <button type="button" className="btn btn-primary" onClick={() => setIsModalOpen(true)}>Поддержать сервер</button>
              <a href="https://t.me/girlsciv" target="_blank" rel="noopener noreferrer" className="btn btn-tg">Telegram-канал</a>
              <a href="#start" className="btn btn-ghost">Как начать</a>
            </div>
          </div>
        </header>

        <section id="shots" className="shots">
          <div className="container">
            <h2 className="section-title reveal">Как у нас выглядит</h2>
            <p className="section-sub reveal">Немного атмосферы — чтобы ты почувствовала, каково это, ещё до входа.</p>
          </div>
          <div className="shots-wrap reveal">
            <div className="shots-viewport" style={{ position: 'relative', overflow: 'hidden', borderRadius: '24px', border: '1px solid #4a2e63' }}>
              <div style={{ display: 'flex', transition: 'transform 0.5s ease', transform: `translateX(-${currentSlide * 100}%)` }}>
                {screenshots.map((src, i) => (
                  <img key={i} src={src} alt={`Скриншот ${i + 1}`} style={{ width: '100%', flexShrink: 0, objectFit: 'cover', aspectRatio: '16/9' }} />
                ))}
              </div>
              <button onClick={() => setCurrentSlide((prev) => (prev === 0 ? screenshots.length - 1 : prev - 1))} style={{ position: 'absolute', top: '50%', left: '20px', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', fontSize: '20px' }}>‹</button>
              <button onClick={() => setCurrentSlide((prev) => (prev === screenshots.length - 1 ? 0 : prev + 1))} style={{ position: 'absolute', top: '50%', right: '20px', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', fontSize: '20px' }}>›</button>
            </div>
          </div>
        </section>

        <section id="about">
          <div className="container">
            <h2 className="section-title reveal">Что у нас есть</h2>
            <p className="section-sub reveal">Мы создали место, где девушки могут спокойно играть, строить и общаться.</p>
            <div className="features">
              <div className="feature reveal"><span className="emoji" aria-hidden="true">🌸</span><h3>Только для девушек</h3><p>Уютное комьюнити без токсичности и лишнего шума. Здесь только девушки — и это чувствуется.</p></div>
              <div className="feature reveal"><span className="emoji" aria-hidden="true">⚖️</span><h3>0% pay-to-win</h3><p>Поддержка сервера даёт только косметику и статус. Никаких преимуществ в игре.</p></div>
              <div className="feature reveal"><span className="emoji" aria-hidden="true">🏰</span><h3>Гильдии</h3><p>Создавай свою гильдию, приглашай подруг, копите в общую казну.</p></div>
              <div className="feature reveal"><span className="emoji" aria-hidden="true">💰</span><h3>Экономика и банк</h3><p>Зарабатывай монеты, открывай вклады, вкладывай в проекты.</p></div>
              <div className="feature reveal"><span className="emoji" aria-hidden="true">🛒</span><h3>Аукцион</h3><p>Предметы, приваты и услуги. Продавай и покупай у других девушек.</p></div>
              <div className="feature reveal"><span className="emoji" aria-hidden="true">🎀</span><h3>Женский род везде</h3><p>Все NPC, предметы и переводы — в женском роде. Мы говорим о себе в женском роде — и нам так уютнее.</p></div>
              <div className="feature reveal"><span className="emoji" aria-hidden="true">👩‍🌾</span><h3>NPC-жительницы</h3><p>Добрячка, Настройщица, Аукционистка и другие. У каждой — своё дело.</p></div>
              <div className="feature reveal"><span className="emoji" aria-hidden="true">🎨</span><h3>Косметика</h3><p>Ауры, следы, цвета ников, эффекты за снарядами. Всё — за SP или за игру.</p></div>
              <div className="feature reveal"><span className="emoji" aria-hidden="true">🛡️</span><h3>Приваты</h3><p>Защити свою территорию. Настрой флаги, добавь подруг, продай участок через аукцион.</p></div>
            </div>
          </div>
        </section>

        <section id="start">
          <div className="container">
            <h2 className="section-title reveal">Как начать играть</h2>
            <p className="section-sub reveal">Четыре шага — и ты в уютном мире.</p>
            <div className="steps">
              <div className="step reveal"><span className="num" aria-hidden="true">1</span><h3>Открой Minecraft 1.20.1</h3><p>Подойдёт лицензия на Ely.by или Mojang — главное версия 1.20.1.</p></div>
              <div className="step reveal"><span className="num" aria-hidden="true">2</span><h3>Добавь сервер</h3><p>Впиши адрес <strong>mc.girlsciv.run.place</strong> и подключись.</p></div>
              <div className="step reveal"><span className="num" aria-hidden="true">3</span><h3>Пройди проверку аккаунта</h3><p>При первом входе система проверит ваш аккаунт. Это займёт пару секунд.</p></div>
              <div className="step reveal"><span className="num" aria-hidden="true">4</span><h3>Загрузи ресурспак</h3><p>Появится окно — нажми «Да». В паке красивые мобихи, текстуры и озвучка.</p></div>
            </div>
            <div className="step-note reveal"><strong>Важно:</strong> для корректной работы нейросети требуется лицензионный Minecraft или аккаунт Ely.by (https://ely.by/) (для пираток).</div>
          </div>
        </section>

        <section id="guard">
          <div className="container">
            <div className="guard-block reveal">
              <h2>Только для девушек — по-настоящему</h2>
              <p className="lead">Мы серьёзно следим за тем, чтобы сервер оставался уютным и безопасным. При первом входе твой аккаунт проходит проверку, а ресурспак — обязателен для всех.</p>
              <div className="guard-grid">
                <div className="guard-item"><span className="gi-icon" aria-hidden="true">🔍</span><h4>Проверка аккаунта</h4><p>При первом входе нейросеть анализирует данные вашего аккаунта. Проверка быстрая и проходит один раз.</p></div>
                <div className="guard-item"><span className="gi-icon" aria-hidden="true">💌</span><h4>Если ошиблась — пиши</h4><p>Если проверка не пропустила, напиши на почту themepyshow@gmail.com — модераторша разберётся вручную.</p></div>
                <div className="guard-item"><span className="gi-icon" aria-hidden="true">🎀</span><h4>Ресурспак обязателен</h4><p>Без него на сервер не попасть. Пак скачается один раз, обновляется автоматически.</p></div>
                <div className="guard-item"><span className="gi-icon" aria-hidden="true">🚪</span><h4>Случайных людей нет</h4><p>Без пройденной проверки и без ресурспака на сервер не попасть. Мы не пропускаем «на авось».</p></div>
                <div className="guard-item"><span className="gi-icon" aria-hidden="true">📜</span><h4>Доверие и репутация</h4><p>Активные девушки получают очки доверия и могут стать частью команды.</p></div>
                <div className="guard-item"><span className="gi-icon" aria-hidden="true">🌙</span><h4>Комфорт и безопасность</h4><p>Мобы не агрятся на девушек, а PvP отключён. Мы делаем всё, чтобы каждая чувствовала себя спокойно.</p></div>
              </div>
            </div>
          </div>
        </section>

        <section id="rules">
          <div className="container">
            <div className="rules-block reveal">
              <h2>Правила</h2>
              <p className="lead">Немного, но по делу. Всё ради того, чтобы всем было уютно.</p>
              <ul className="rules-list">
                <li><span><strong>Уважение прежде всего.</strong> Никакой токсичности, травли и грубости.</span></li>
                <li><span><strong>Только девушки.</strong> Проверка при входе — вручную при спорных случаях.</span></li>
                <li><span><strong>Без NSFW и пошлости.</strong> Ни в скинах, ни в чате, ни в постройках.</span></li>
                <li><span><strong>Не гриферь.</strong> Чужие приваты неприкосновенны.</span></li>
                <li><span><strong>Без читов и дюпов.</strong> Играем честно.</span></li>
                <li><span><strong>Реклама — только с разрешения.</strong> Спроси у модераторши.</span></li>
                <li><span><strong>Жалобы — через доску.</strong> Не разбирайся сама, мы поможем.</span></li>
              </ul>
            </div>
          </div>
        </section>

        {/* ЗДЕСЬ БУДЕТ БЮДЖЕТ (см. отдельный файл) */}
        <section id="budget">
          <div className="container">
            <div className="budget-block reveal">
              <h2>Прозрачный бюджет</h2>
              <p className="lead">Мы показываем, куда идёт ваша поддержка. Все суммы — только на сервер: хостинг, домен, реклама, разработка. Никаких личных трат.</p>
              <div style={{ textAlign: 'center', padding: '20px', color: '#c9b3d9' }}>
                <p>Загрузка бюджета... (создайте файл budget.txt в папке public)</p>
              </div>
            </div>
          </div>
        </section>

        <section id="sponsor">
          <div className="container">
            <div className="sponsor-block reveal">
              <h2>Поддержи сервер</h2>
              <p className="lead">Получи косметику, статус и спонсорские очки. Без pay-to-win. Всё купленное — навсегда.</p>
              <div className="perks-list">
                <div className="perk"><span className="icon" aria-hidden="true">💫</span><div className="text"><strong>Ауры</strong><span>Сакура, звёзды, искры, магия</span></div></div>
                <div className="perk"><span className="icon" aria-hidden="true">👣</span><div className="text"><strong>Следы шагов</strong><span>Красивые частицы за тобой</span></div></div>
                <div className="perk"><span className="icon" aria-hidden="true">🏹</span><div className="text"><strong>Следы снарядов</strong><span>Огненные, ледяные, магические</span></div></div>
                <div className="perk"><span className="icon" aria-hidden="true">🎨</span><div className="text"><strong>Цвета ников</strong><span>16 базовых, радужный, градиенты</span></div></div>
                <div className="perk"><span className="icon" aria-hidden="true">💎</span><div className="text"><strong>SP навсегда</strong><span>Купленное не сгорает</span></div></div>
                <div className="perk"><span className="icon" aria-hidden="true">🏆</span><div className="text"><strong>Топ спонсорш</strong><span>Признание и место в топе</span></div></div>
              </div>
              <button type="button" className="btn btn-primary" onClick={() => setIsModalOpen(true)}>Поддержать сервер</button>
              <div className="no-p2w"><strong>Мы принципиально без pay-to-win.</strong> Поддержка не даёт ни монет, ни вещей, ни силы, ни скорости, ни приватов. Только косметика и статус. 1 неделя поддержки = 50 SP.</div>
            </div>
          </div>
        </section>

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
                  <button 
                    type="button" 
                    className="faq-q" 
                    aria-expanded={activeFaq === index}
                    onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  >
                    {item.q} <span className="toggle" aria-hidden="true">+</span>
                  </button>
                  <div className="faq-a" role="region">
                    <div>{item.a}</div>
                  </div>
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
            <span aria-hidden="true">©</span> 2026 Girls Civilization. Minecraft — торговая марка Mojang AB.
          </div>
        </div>
      </footer>

      {/* Модальное окно доната */}
      {isModalOpen && (
        <div className="modal-overlay show" onClick={() => setIsModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <button type="button" className="modal-close" onClick={() => setIsModalOpen(false)} aria-label="Закрыть окно">×</button>
            <h3>Поддержать сервер</h3>
            <p className="modal-sub">Выбери количество недель. Роль и SP начислим автоматически после оплаты.</p>
            
            <div className="weeks-row">
              <button type="button" className="weeks-btn" onClick={() => changeWeeks(-1)} disabled={weeks <= 1} aria-label="Меньше недель">−</button>
              <div className="weeks-num" aria-live="polite">{weeks}</div>
              <button type="button" className="weeks-btn" onClick={() => changeWeeks(1)} disabled={weeks >= 52} aria-label="Больше недель">+</button>
            </div>
            <div className="weeks-label">{weeks} {weeks === 1 ? 'неделя' : (weeks < 5 ? 'недели' : 'недель')} поддержки</div>
            
            <div className="price-display">
              <div className="price-total">₽ {weeks * PRICE_PER_WEEK}</div>
              <div className="price-detail">{weeks} недель × {PRICE_PER_WEEK} ₽</div>
              <div className="sp-total">+{weeks * SP_PER_WEEK} SP</div>
            </div>
            
            {/* ЗДЕСЬ БУДЕТ КНОПКА ЮKASSA */}
            <button className="btn btn-primary" style={{width: '100%', justifyContent: 'center', opacity: 0.7, cursor: 'not-allowed'}} disabled>
              Оплата через ЮKassa (скоро)
            </button>
            <div className="modal-note"><strong>Как это работает:</strong> оплата и выдача роли — автоматически через ЮKassa.</div>
          </div>
        </div>
      )}

      {/* Тост (уведомление) */}
      <div className={`toast ${toastMessage ? 'show' : ''}`} role="status" aria-live="polite">
        {toastMessage}
      </div>
    </>
  );
}
