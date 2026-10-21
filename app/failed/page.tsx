'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function FailedPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div 
        className="sponsor-block" 
        style={{ 
          maxWidth: '600px', 
          width: '100%', 
          textAlign: 'center', 
          borderColor: 'rgba(255, 142, 142, 0.4)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
        }}
      >
        
        <div style={{ fontSize: '64px', marginBottom: '16px', lineHeight: 1 }}>😕</div>
        
        <h2 style={{ fontFamily: 'Unbounded, sans-serif', fontSize: '28px', marginBottom: '16px', color: 'var(--red)' }}>
          Оплата не прошла
        </h2>
        
        <p className="lead" style={{ marginBottom: '24px' }}>
          Что-то пошло не так. Возможно, на карте недостаточно средств или произошёл сбой на стороне банка.
        </p>

        <div className="no-p2w" style={{ textAlign: 'left', marginBottom: '32px' }}>
          <strong>Что делать?</strong>
          <ul style={{ marginTop: '12px', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li>Попробуй провести оплату ещё раз.</li>
            <li>Если деньги списались, но ты попала на эту страницу — не волнуйся, они вернутся на карту автоматически в течение 1-3 дней.</li>
            <li>Если возникла странная ошибка — напиши нам на почту <a href="mailto:themepyshow@gmail.com">themepyshow@gmail.com</a>.</li>
          </ul>
        </div>

        <Link href="/#sponsor" className="btn btn-primary" style={{ display: 'inline-flex', width: '100%', justifyContent: 'center' }}>
          Попробовать снова
        </Link>
        
        <div style={{ marginTop: '24px' }}>
          <Link href="/" style={{ color: 'var(--text-soft)', textDecoration: 'underline' }}>
            Вернуться на главную
          </Link>
        </div>

      </div>
    </main>
  );
}
