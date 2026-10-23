import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { weeks, playerName } = await request.json();

    if (!playerName) {
      return NextResponse.json({ error: 'Укажи ник игрока' }, { status: 400 });
    }

    const merchantId = process.env.FK_MERCHANT_ID;
    const secret1 = process.env.FK_SECRET_1;

    if (!merchantId || !secret1) {
      console.error('Create payment error: Не заданы переменные окружения');
      return NextResponse.json({ error: 'config error' }, { status: 500 });
    }

    const amount = (weeks * 99).toFixed(2);
    const currency = 'RUB';
    const orderId = `gc_${Date.now()}`;

    // Подпись для формы оплаты FreeKassa (используем секретное слово 1)
    const sign = crypto
      .createHash('md5')
      .update(`${merchantId}:${amount}:${secret1}:${currency}:${orderId}`)
      .digest('hex');

    const params = new URLSearchParams({
      m: merchantId,
      oa: amount,
      o: orderId,
      s: sign,
      currency,
      i: '4', // VISA RUB
      lang: 'ru',
      us_weeks: String(weeks),
      us_player_name: playerName,
    });

    return NextResponse.json({
      url: `https://pay.fk.money/?${params.toString()}`,
    });
    
  } catch (error) {
    console.error('Критическая ошибка создания платежа:', error);
    return NextResponse.json({ error: 'internal error' }, { status: 500 });
  }
}
