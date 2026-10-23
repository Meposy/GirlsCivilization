import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { Rcon } from 'rcon-client';

// IP-адреса FreeKassa (из документации)
const FK_IPS = [
  '168.119.157.136',
  '168.119.60.227',
  '178.154.197.79',
  '51.250.54.238',
];

export async function POST(request: NextRequest) {
  try {
    // 1. Проверка IP-адреса (защита от подделки запроса)
    const ip =
      request.headers.get('x-real-ip') ||
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      '';

    // ВАЖНО: Пока тестируешь локально, оставь это закомментированным. 
    // Когда задеплоишь на реальный сервер (Vercel, VPS и т.д.) — раскомментируй!
    /*
    if (!FK_IPS.includes(ip)) {
      console.warn('FreeKassa webhook: Неизвестный IP', ip);
      return new NextResponse('hacking attempt', { status: 403 });
    }
    */

    // 2. FreeKassa присылает данные в формате form-data (а не JSON)
    const formData = await request.formData();
    const data: Record<string, string> = {};
    formData.forEach((value, key) => {
      data[key] = String(value);
    });

    const {
      MERCHANT_ID,
      AMOUNT,
      intid,             // Уникальный ID операции в FreeKassa
      MERCHANT_ORDER_ID, // ID заказа из твоего магазина
      SIGN,
      us_weeks,          // Наши доп. параметры (передаем при создании платежа)
      us_player_name,    // Ник игрока (передаем при создании платежа)
    } = data;

    // Проверка, что пришли все обязательные поля
    if (!MERCHANT_ID || !AMOUNT || !MERCHANT_ORDER_ID || !SIGN) {
      return new NextResponse('bad request', { status: 400 });
    }

    // 3. Проверка подписи (СЕКРЕТНОЕ СЛОВО 2!)
    const merchantId = process.env.FK_MERCHANT_ID;
    const secret2 = process.env.FK_SECRET_2;

    if (!merchantId || !secret2) {
      console.error('Webhook: Ошибка конфигурации, не заданы переменные окружения');
      return new NextResponse('config error', { status: 500 });
    }

    const expectedSign = crypto
      .createHash('md5')
      .update(`${MERCHANT_ID}:${AMOUNT}:${secret2}:${MERCHANT_ORDER_ID}`)
      .digest('hex');

    if (expectedSign !== SIGN) {
      console.warn('FreeKassa webhook: Неверная подпись', { expectedSign, SIGN });
      return new NextResponse('wrong sign', { status: 403 });
    }

    // 4. Проверка, что магазин совпадает
    if (MERCHANT_ID !== merchantId) {
      return new NextResponse('wrong merchant', { status: 403 });
    }

    // 5. Проверка ника игрока
    if (!us_player_name) {
       return new NextResponse('no player name', { status: 400 });
    }

    // 6. ВЫДАЧА ДОНАТА ЧЕРЕЗ RCON
    const weeks = parseInt(us_weeks || '0', 10);
    const seconds = weeks * 7 * 24 * 60 * 60; // Переводим недели в секунды
    
    console.log(`[FreeKassa] Успешная оплата! Игрок: ${us_player_name}, Недель: ${weeks} (${seconds} сек.)`);

    try {
      // Подключаемся к RCON (данные берем из .env)
      const rcon = await Rcon.connect({
        host: process.env.MC_HOST || '127.0.0.1',
        port: parseInt(process.env.MC_RCON_PORT || '25575'),
        password: process.env.MC_RCON_PASSWORD || '',
      });

      // Выполняем команду на сервере
      const response = await rcon.send(`givetempdonate ${us_player_name} ${seconds}`);
      console.log(`[RCON] Ответ сервера: ${response}`);

      // ЗАКОММЕНТИРОВАНО: Если у тебя есть плагин, выдающий SP (например, NpcCharm),
      // раскомментируй и поменяй команду на нужную.
      // const spToGive = weeks * 50;
      // await rcon.send(`give_sp ${us_player_name} ${spToGive}`);
      
      await rcon.end();

    } catch (rconError) {
      console.error('[FreeKassa] Ошибка RCON:', rconError);
      // Если игрок офлайн, RCON выдаст ошибку. 
      // Платеж прошел, но донат не выдан. 
      // В будущем тут можно сделать запись в файл pending_donates.json
    }

    // 7. ОБЯЗАТЕЛЬНО возвращаем "YES", чтобы FreeKassa перестала слать запросы
    return new NextResponse('YES', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });

  } catch (e) {
    console.error('Критическая ошибка FreeKassa webhook:', e);
    return new NextResponse('error', { status: 500 });
  }
}
