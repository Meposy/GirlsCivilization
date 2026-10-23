import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { Rcon } from 'rcon-client';

export async function POST(request: NextRequest) {
  try {
    // 1. Защита: FreeKassa присылает form-data, а не JSON
    const contentType = request.headers.get('content-type') || '';
    if (
      !contentType.includes('application/x-www-form-urlencoded') &&
      !contentType.includes('multipart/form-data')
    ) {
      console.warn('Webhook: Неверный Content-Type:', contentType);
      return new NextResponse('bad content-type', { status: 400 });
    }

    // 2. Читаем данные от FreeKassa
    const formData = await request.formData();
    const data: Record<string, string> = {};
    formData.forEach((value, key) => {
      data[key] = String(value);
    });

    const {
      MERCHANT_ID,
      AMOUNT,
      intid,
      MERCHANT_ORDER_ID,
      SIGN,
      us_weeks,
      us_player_name,
    } = data;

    if (!MERCHANT_ID || !AMOUNT || !MERCHANT_ORDER_ID || !SIGN) {
      return new NextResponse('bad request', { status: 400 });
    }

    // 3. Проверка подписи (СЕКРЕТНОЕ СЛОВО 2!)
    const merchantId = process.env.FK_MERCHANT_ID;
    const secret2 = process.env.FK_SECRET_2;

    if (!merchantId || !secret2) {
      console.error('Webhook: Не заданы переменные окружения');
      return new NextResponse('config error', { status: 500 });
    }

    const expectedSign = crypto
      .createHash('md5')
      .update(`${MERCHANT_ID}:${AMOUNT}:${secret2}:${MERCHANT_ORDER_ID}`)
      .digest('hex');

    if (expectedSign !== SIGN) {
      console.warn('FreeKassa webhook: Неверная подпись');
      return new NextResponse('wrong sign', { status: 403 });
    }

    if (MERCHANT_ID !== merchantId) {
      return new NextResponse('wrong merchant', { status: 403 });
    }

    if (!us_player_name) {
      return new NextResponse('no player name', { status: 400 });
    }

    // 4. ВЫДАЧА ДОНАТА ЧЕРЕЗ RCON
    const weeks = parseInt(us_weeks || '0', 10);
    const seconds = weeks * 7 * 24 * 60 * 60;
    
    console.log(`[FreeKassa] Успешная оплата! Игрок: ${us_player_name}, Недель: ${weeks} (${seconds} сек.)`);

    try {
      const rcon = await Rcon.connect({
        host: process.env.MC_HOST || '127.0.0.1',
        port: parseInt(process.env.MC_RCON_PORT || '25575'),
        password: process.env.MC_RCON_PASSWORD || '',
      });

      const response = await rcon.send(`givetempdonate ${us_player_name} ${seconds}`);
      console.log(`[RCON] Ответ сервера: ${response}`);
      
      await rcon.end();
    } catch (rconError) {
      console.error('[FreeKassa] Ошибка RCON:', rconError);
    }

    // 5. Возвращаем YES, чтобы FreeKassa поняла, что мы получили уведомление
    return new NextResponse('YES', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });

  } catch (e) {
    console.error('Критическая ошибка FreeKassa webhook:', e);
    return new NextResponse('error', { status: 500 });
  }
}
