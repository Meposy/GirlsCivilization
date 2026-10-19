export default function Privacy() {
  return (
    <div className="container" style={{ padding: '100px 24px', maxWidth: '800px', margin: '0 auto', color: '#fbeaff' }}>
      <h1 style={{ fontFamily: 'Unbounded', fontSize: '36px', marginBottom: '24px' }}>Политика конфиденциальности</h1>
      <p style={{ marginBottom: '16px' }}>Мы уважаем вашу приватность. Данная политика описывает, какие данные мы собираем.</p>
      
      <h2 style={{ fontSize: '24px', marginTop: '32px', marginBottom: '16px' }}>1. Какие данные мы собираем</h2>
      <p style={{ marginBottom: '16px' }}>1.1. При оплате через ЮKassa мы получаем ваш никнейм в Minecraft и сумму платежа.</p>
      <p style={{ marginBottom: '16px' }}>1.2. Мы не храним данные ваших банковских карт.</p>

      <a href="/" style={{ display: 'inline-block', marginTop: '40px', color: '#ff8ec7', textDecoration: 'underline' }}>← Вернуться на главную</a>
    </div>
  );
}
