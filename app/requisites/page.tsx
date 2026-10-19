export default function Requisites() {
  return (
    <div className="container" style={{ padding: '100px 24px', maxWidth: '800px', margin: '0 auto', color: '#fbeaff', lineHeight: '1.6' }}>
      <h1 style={{ fontFamily: 'Unbounded', fontSize: '36px', marginBottom: '24px' }}>Реквизиты</h1>
      
      <div style={{ background: '#2b1a3d', padding: '24px', borderRadius: '16px', border: '1px solid #4a2e63' }}>
        <p style={{ marginBottom: '12px' }}>
          <strong style={{ color: '#ff8ec7' }}>Исполнитель:</strong> Петухов В. С.
        </p>
        <p style={{ marginBottom: '12px' }}>
          <strong style={{ color: '#ff8ec7' }}>Статус:</strong> Самозанятый (плательщик НПД)
        </p>
        <p style={{ marginBottom: '12px' }}>
          <strong style={{ color: '#ff8ec7' }}>ИНН:</strong> 544601923000
        </p>
        <p style={{ marginBottom: '12px' }}>
          <strong style={{ color: '#ff8ec7' }}>Email:</strong> themepyshow@gmail.com
        </p>
      </div>

      <p style={{ marginTop: '24px', fontSize: '14px', color: '#c9b3d9' }}>
        * Данная страница предназначена для предоставления платежной информации в соответствии с требованиями законодательства РФ. Все услуги оказываются на игровом сервере Minecraft «Girls Civilization».
      </p>

      <a href="/" style={{ display: 'inline-block', marginTop: '40px', color: '#ff8ec7', textDecoration: 'underline' }}>← Вернуться на главную</a>
    </div>
  );
}
