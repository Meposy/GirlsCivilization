'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function SuccessPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      {/* Убрали любые opacity и анимации появления. Блок всегда виден. */}
      <div 
        className="sponsor-block" 
        style={{ 
          maxWidth: '600px', 
          width: '100%', 
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
        }}
      >
        
        <div style={{ fontSize: '64px', marginBottom: '16px', lineHeight: 1 }}>💖</div>
        
        <h2 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: '28px', marginBottom: '16px', color: 'var(--pink)' }}>
          Спасибо за поддержку!
        </h2>
        
        <p className="lead" style={{ marginBottom: '24px' }}>
          Твоя оплата успешно прошла. Спасибо, что поддерживаешь наш сервер и помогаешь ему развиваться!
        </p>

        <div className="no-p2w" style={{ textAlign: 'left', marginBottom: '32px' }}>
          <strong>Что дальше?</strong>
          <ul style={{ marginTop: '12px', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li>Статус спонсорши и SP будут начислены на сервере автоматически <b>в течение 1-2 минут</b>.</li>
            <li>Если ты сейчас онлайн — можешь проверить баланс через <code>/cosmetics sp</code> или в меню Чаровницы.</li>
            <li>Если SP не пришли через 5 минут — напиши нам на почту <a href="mailto:themepyshow@gmail.com">themepyshow@gmail.com</a>, приложив чек об оплате.</li>
          </ul>
        </div>

        <Link href="/" className="btn btn-primary" style={{ display: 'inline-flex', width: '100%', justifyContent: 'center' }}>
          Вернуться на главную
        </Link>
        
        <div style={{ marginTop: '24px' }}>
          <a href="https://t.me/girlsciv" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-soft)', textDecoration: 'underline' }}>
            Перейти в Telegram-канал
          </a>
        </div>

      </div>
    </main>
  );
}
