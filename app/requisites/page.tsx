export default function Requisites() {
  return (
    <div className="container" style={{ padding: '100px 24px', maxWidth: '800px', margin: '0 auto', color: '#fbeaff' }}>
      <h1 style={{ fontFamily: 'Unbounded', fontSize: '36px', marginBottom: '24px' }}>Реквизиты</h1>
      
      <div style={{ background: '#2b1a3d', padding: '24px', borderRadius: '16px', border: '1px solid #4a2e63' }}>
        <p style={{ marginBottom: '8px' }}><strong>Исполнитель:</strong> [Твои ФИО]</p>
        <p style={{ marginBottom: '8px' }}><strong>ИНН:</strong> [Твой ИНН самозанятого]</p>
        <p style={{ marginBottom: '8px' }}><strong>Email:</strong> hello@girlscivilization.ru</p>
        <p><strong>Telegram:</strong> @girlsciv</p>
      </div>

      <a href="/" style={{ display: 'inline-block', marginTop: '40px', color: '#ff8ec7', textDecoration: 'underline' }}>← Вернуться на главную</a>
    </div>
  );
}
