'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  // Состояния для интерактивных элементов
  const [ipCopied, setIpCopied] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [weeks, setWeeks] = useState(1);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Константы для донатов
  const PRICE_PER_WEEK = 99;
  const SP_PER_WEEK = 10;

  // Эффект для анимации появления блоков (Reveal)
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Логика копирования IP
  const copyIp = () => {
    const ip = "mc.girlsciv.run.place";
    navigator.clipboard.writeText(ip).then(() => {
      setIpCopied(true);
      showToast(`IP скопирован: ${ip}`);
      setTimeout(() => setIpCopied(false), 2000);
    });
  };

  // Всплывающее уведомление
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  // Управление неделями доната
  const changeWeeks = (amount: number) => {
    setWeeks((prev) => Math.max(1, Math.min(52, prev + amount)));
  };

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

        {/* Секция скриншотов (пока статичная, карусель добавим позже) */}
        <section id="shots" className="shots">
          <div className="container">
            <h2 className="section-title reveal">Как у нас выглядит</h2>
            <p className="section-sub reveal">Немного атмосферы — чтобы ты почувствовала, каково это, ещё до входа.</p>
          </div>
          <div className="shots-wrap reveal">
            <div className="shots-viewport" style={{ background: '#2b1a3d', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
              <p style={{ color: '#c9b3d9' }}>Здесь будет галерея скриншотов (добавим позже)</p>
            </div>
          </div>
        </section>

        {/* Секция О сервере */}
        <section id="about">
          <div className="container">
            <h2 className="section-title reveal">Что у нас есть</h2>
            <p className="section-sub reveal">Мы создали место, где девушки могут спокойно играть, строить и общаться.</p>
            <div className="features">
              {/* Пример фичи - остальные добавь по аналогии */}
              <div className="feature reveal"><span className="emoji" aria-hidden="true">🌸</span><h3>Только для девушек</h3><p>Уютное комьюнити без токсичности и лишнего шума. Здесь только девушки — и это чувствуется.</p></div>
              <div className="feature reveal"><span className="emoji" aria-hidden="true">⚖️</span><h3>0% pay-to-win</h3><p>Поддержка сервера даёт только косметику и статус. Никаких преимуществ в игре.</p></div>
              <div className="feature reveal"><span className="emoji" aria-hidden="true">🏰</span><h3>Гильдии</h3><p>Создавай свою гильдию, приглашай подруг, копите в общую казну.</p></div>
              <div className="feature reveal"><span className="emoji" aria-hidden="true">💰</span><h3>Экономика и банк</h3><p>Зарабатывай монеты, открывай вклады, вкладывай в проекты.</p></div>
              <div className="feature reveal"><span className="emoji" aria-hidden="true">🛒</span><h3>Аукцион</h3><p>Предметы, приваты и услуги. Продавай и покупай у других девушек.</p></div>
              <div className="feature reveal"><span className="emoji" aria-hidden="true">👩‍🌾</span><h3>NPC-жительницы</h3><p>Добрячка, Настройщица, Аукционистка и другие.</p></div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq">
          <div className="container">
            <h2 className="section-title reveal">Частые вопросы</h2>
            <p className="section-sub reveal">Если что-то осталось непонятным — пиши в Telegram.</p>
            <div className="faq">
              {[
                { q: "Как зайти на сервер?", a: "Открой Minecraft 1.20.1, добавь сервер с адресом mc.girlsciv.run.place и заходи. При первом входе скин проверит нейросеть, затем загрузится ресурспак." },
                { q: "Как вы проверяете, что я девушка?", a: "При первом входе нейросеть смотрит твой скин и определяет, женский ли это персонаж. Если она ошиблась — напиши в Telegram с кодом проверки." },
                { q: "Что за ресурспак?", a: "Наш сборный ресурспак: модели, звуки и пастельные текстуры. Обязателен для игры, ставится в один клик." },
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
            <p className="modal-sub">Выбери количество недель. Роль и SP начислим вручную в Telegram.</p>
            
            <div className="weeks-row">
              <button type="button" className="weeks-btn" onClick={() => changeWeeks(-1)} disabled={weeks <= 1} aria-label="Меньше недель">−</button>
              <div className="weeks-num" aria-live="polite">{weeks}</div>
              <button type="button" className="weeks-btn" onClick={() => changeWeeks(1)} disabled={weeks >= 52} aria-label="Больше недель">+</button>
            </div>
            <div className="weeks-label">{weeks} недель поддержки</div>
            
            <div className="price-display">
              <div className="price-total">₽ {weeks * PRICE_PER_WEEK}</div>
              <div className="price-detail">{weeks} недель × {PRICE_PER_WEEK} ₽</div>
              <div className="sp-total">+{weeks * SP_PER_WEEK} SP</div>
            </div>
            
            <a href="https://t.me/girlsciv" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{width: '100%', justifyContent: 'center'}}>Написать в Telegram</a>
            <div className="modal-note"><strong>Как это работает:</strong> оплата и выдача роли — вручную через Telegram.</div>
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
