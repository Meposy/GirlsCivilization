export default function Privacy() {
  return (
    <div className="container" style={{ padding: '100px 24px', maxWidth: '800px', margin: '0 auto', color: '#fbeaff', lineHeight: '1.6' }}>
      <h1 style={{ fontFamily: 'Unbounded', fontSize: '36px', marginBottom: '24px' }}>Политика конфиденциальности</h1>
      
      <p style={{ marginBottom: '16px' }}>Настоящая Политика конфиденциальности (далее — «Политика») действует в отношении всей информации, которую сайт «Girls Civilization» может получить о Пользователе во время использования сайта.</p>

      <h2 style={{ fontSize: '24px', marginTop: '32px', marginBottom: '16px', fontFamily: 'Unbounded' }}>1. Какие данные мы собираем</h2>
      <p style={{ marginBottom: '16px' }}>1.1. При использовании сайта мы можем собирать следующие данные:</p>
      <ul style={{ marginBottom: '16px', paddingLeft: '20px' }}>
        <li style={{ marginBottom: '8px' }}>Никнейм в Minecraft (при оплате услуг).</li>
        <li style={{ marginBottom: '8px' }}>Сумма платежа.</li>
        <li style={{ marginBottom: '8px' }}>Адрес электронной почты (если вы связываетесь с нами).</li>
        <li>Технические данные (IP-адрес, тип браузера, файлы cookie).</li>
      </ul>
      <p style={{ marginBottom: '16px' }}>1.2. Мы **не храним** и не обрабатываем данные ваших банковских карт. Все платежи проходят через защищенные страницы платежных систем (ЮKassa, DonationAlerts).</p>

      <h2 style={{ fontSize: '24px', marginTop: '32px', marginBottom: '16px', fontFamily: 'Unbounded' }}>2. Цели сбора данных</h2>
      <p style={{ marginBottom: '16px' }}>2.1. Ваши данные используются исключительно для:</p>
      <ul style={{ marginBottom: '16px', paddingLeft: '20px' }}>
        <li style={{ marginBottom: '8px' }}>Идентификации вас как игрока и выдачи оплаченных услуг (роли, косметики).</li>
        <li style={{ marginBottom: '8px' }}>Ответа на ваши вопросы и обращения в поддержку.</li>
        <li>Улучшения работы сайта и сервера.</li>
      </ul>

      <h2 style={{ fontSize: '24px', marginTop: '32px', marginBottom: '16px', fontFamily: 'Unbounded' }}>3. Передача данных третьим лицам</h2>
      <p style={{ marginBottom: '16px' }}>3.1. Мы не продаем и не передаем ваши персональные данные третьим лицам, за исключением случаев, предусмотренных законодательством РФ.</p>
      <p style={{ marginBottom: '16px' }}>3.2. Для проведения платежей мы используем платежные системы (ЮKassa, DonationAlerts). Они получают только необходимую для транзакции информацию (сумма, никнейм).</p>

      <h2 style={{ fontSize: '24px', marginTop: '32px', marginBottom: '16px', fontFamily: 'Unbounded' }}>4. Ваши права</h2>
      <p style={{ marginBottom: '16px' }}>4.1. Вы имеете право запросить информацию о том, какие ваши данные мы храним, а также потребовать их удаления. Для этого свяжитесь с нами по электронной почте.</p>
      <p style={{ marginBottom: '16px' }}>4.2. Вы можете отказаться от использования файлов cookie в настройках вашего браузера.</p>

      <h2 style={{ fontSize: '24px', marginTop: '32px', marginBottom: '16px', fontFamily: 'Unbounded' }}>5. Контакты</h2>
      <p style={{ marginBottom: '16px' }}>По всем вопросам, связанным с обработкой данных, вы можете обратиться по электронной почте: <strong>themepyshow@gmail.com</strong></p>

      <a href="/" style={{ display: 'inline-block', marginTop: '40px', color: '#ff8ec7', textDecoration: 'underline' }}>← Вернуться на главную</a>
    </div>
  );
}
