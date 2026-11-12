// ===== Контент приложения «Türkçe Quest» =====
// tr — турецкий, ru — перевод, ph — подсказка произношения русскими буквами

const CORE_LESSONS = [
  {
    id: 'hello', emoji: '👋', title: 'Привет!', subtitle: 'Приветствия и прощания',
    items: [
      { tr: 'Merhaba', ru: 'Привет / Здравствуйте', ph: 'мерхаба' },
      { tr: 'Günaydın', ru: 'Доброе утро', ph: 'гюнайдын' },
      { tr: 'İyi akşamlar', ru: 'Добрый вечер', ph: 'ийи акшамлар' },
      { tr: 'Nasılsın?', ru: 'Как ты?', ph: 'насылсын' },
      { tr: 'İyiyim, teşekkürler', ru: 'Хорошо, спасибо', ph: 'ийийим, тешеккюрлер' },
      { tr: 'Hoşça kal', ru: 'Пока (говорит уходящий)', ph: 'хошча кал' },
      { tr: 'Görüşürüz', ru: 'Увидимся', ph: 'гёрюшюрюз' },
    ],
  },
  {
    id: 'polite', emoji: '🙏', title: 'Вежливость', subtitle: 'Спасибо, пожалуйста, да, нет',
    items: [
      { tr: 'Teşekkür ederim', ru: 'Спасибо', ph: 'тешеккюр эдерим' },
      { tr: 'Lütfen', ru: 'Пожалуйста (просьба)', ph: 'лютфен' },
      { tr: 'Rica ederim', ru: 'Не за что', ph: 'риджа эдерим' },
      { tr: 'Evet', ru: 'Да', ph: 'эвет' },
      { tr: 'Hayır', ru: 'Нет', ph: 'хайыр' },
      { tr: 'Özür dilerim', ru: 'Прошу прощения', ph: 'ёзюр дилерим' },
      { tr: 'Affedersiniz', ru: 'Извините (привлечь внимание)', ph: 'аффедерсиниз' },
    ],
  },
  {
    id: 'meet', emoji: '🤝', title: 'Знакомство', subtitle: 'Имя, откуда ты, работа',
    items: [
      { tr: 'Adın ne?', ru: 'Как тебя зовут?', ph: 'адын нэ' },
      { tr: 'Benim adım Saşa', ru: 'Меня зовут Саша', ph: 'беним адым саша' },
      { tr: 'Memnun oldum', ru: 'Приятно познакомиться', ph: 'мемнун олдум' },
      { tr: 'Nerelisin?', ru: 'Откуда ты?', ph: 'нерелисин' },
      { tr: 'Rusyalıyım', ru: 'Я из России', ph: 'русьялыйым' },
      { tr: "Moskova'da yaşıyorum", ru: 'Я живу в Москве', ph: 'московада яшыйорум' },
      { tr: 'Ne iş yapıyorsun?', ru: 'Кем ты работаешь?', ph: 'нэ иш япыйорсун' },
    ],
  },
  {
    id: 'numbers', emoji: '🔢', title: 'Числа', subtitle: 'Считаем от 1 до 10',
    items: [
      { tr: 'Bir', ru: 'Один (1)', ph: 'бир' },
      { tr: 'İki', ru: 'Два (2)', ph: 'ики' },
      { tr: 'Üç', ru: 'Три (3)', ph: 'юч' },
      { tr: 'Dört', ru: 'Четыре (4)', ph: 'дёрт' },
      { tr: 'Beş', ru: 'Пять (5)', ph: 'беш' },
      { tr: 'Altı', ru: 'Шесть (6)', ph: 'алты' },
      { tr: 'Yedi', ru: 'Семь (7)', ph: 'еди' },
      { tr: 'Sekiz', ru: 'Восемь (8)', ph: 'секиз' },
      { tr: 'Dokuz', ru: 'Девять (9)', ph: 'докуз' },
      { tr: 'On', ru: 'Десять (10)', ph: 'он' },
    ],
  },
  {
    id: 'cafe', emoji: '☕', title: 'В кафе', subtitle: 'Заказываем чай и просим счёт',
    items: [
      { tr: 'Su', ru: 'Вода', ph: 'су' },
      { tr: 'Çay', ru: 'Чай', ph: 'чай' },
      { tr: 'Kahve', ru: 'Кофе', ph: 'кахве' },
      { tr: 'Ekmek', ru: 'Хлеб', ph: 'экмек' },
      { tr: 'Bir çay, lütfen', ru: 'Один чай, пожалуйста', ph: 'бир чай, лютфен' },
      { tr: 'Çok lezzetli', ru: 'Очень вкусно', ph: 'чок леззетли' },
      { tr: 'Hesap, lütfen', ru: 'Счёт, пожалуйста', ph: 'хесап, лютфен' },
    ],
  },
  {
    id: 'city', emoji: '🏙️', title: 'В городе', subtitle: 'Где? Куда? Сколько стоит?',
    items: [
      { tr: 'Tuvalet nerede?', ru: 'Где туалет?', ph: 'туалет нереде' },
      { tr: 'Otel nerede?', ru: 'Где отель?', ph: 'отель нереде' },
      { tr: 'Sağa', ru: 'Направо', ph: 'саа' },
      { tr: 'Sola', ru: 'Налево', ph: 'сола' },
      { tr: 'Dümdüz', ru: 'Прямо', ph: 'дюмдюз' },
      { tr: 'Ne kadar?', ru: 'Сколько стоит?', ph: 'нэ кадар' },
      { tr: 'Çok pahalı', ru: 'Очень дорого', ph: 'чок пахалы' },
    ],
  },
  {
    id: 'family', emoji: '👨‍👩‍👧', title: 'Семья и друзья', subtitle: 'Близкие люди',
    items: [
      { tr: 'Anne', ru: 'Мама', ph: 'аннэ' },
      { tr: 'Baba', ru: 'Папа', ph: 'баба' },
      { tr: 'Kardeş', ru: 'Брат / сестра', ph: 'кардеш' },
      { tr: 'Arkadaş', ru: 'Друг', ph: 'аркадаш' },
      { tr: 'Çocuk', ru: 'Ребёнок', ph: 'чоджук' },
      { tr: 'Bu benim arkadaşım', ru: 'Это мой друг', ph: 'бу беним аркадашым' },
      { tr: 'Ailem çok büyük', ru: 'Моя семья очень большая', ph: 'айлем чок бююк' },
    ],
  },
  {
    id: 'time', emoji: '⏰', title: 'Время', subtitle: 'Сегодня, завтра, который час',
    items: [
      { tr: 'Bugün', ru: 'Сегодня', ph: 'бугюн' },
      { tr: 'Yarın', ru: 'Завтра', ph: 'ярын' },
      { tr: 'Dün', ru: 'Вчера', ph: 'дюн' },
      { tr: 'Şimdi', ru: 'Сейчас', ph: 'шимди' },
      { tr: 'Saat kaç?', ru: 'Который час?', ph: 'саат кач' },
      { tr: 'Hafta sonu', ru: 'Выходные', ph: 'хафта сону' },
      { tr: 'Yarın görüşürüz', ru: 'Увидимся завтра', ph: 'ярын гёрюшюрюз' },
    ],
  },
  {
    id: 'feelings', emoji: '😊', title: 'Чувства', subtitle: 'Как ты себя чувствуешь',
    items: [
      { tr: 'Mutluyum', ru: 'Я счастлив', ph: 'мутлуюм' },
      { tr: 'Yorgunum', ru: 'Я устал', ph: 'йоргунум' },
      { tr: 'Açım', ru: 'Я голоден', ph: 'ачым' },
      { tr: 'Susadım', ru: 'Я хочу пить', ph: 'сусадым' },
      { tr: 'Üzgünüm', ru: 'Мне грустно / Мне жаль', ph: 'юзгюнюм' },
      { tr: 'Çok güzel!', ru: 'Очень красиво!', ph: 'чок гюзель' },
      { tr: 'Merak etme', ru: 'Не волнуйся', ph: 'мерак этме' },
    ],
  },
  {
    id: 'food', emoji: '🍽️', title: 'Еда и продукты', subtitle: 'Что купить и съесть',
    items: [
      { tr: 'Ekmek', ru: 'Хлеб', ph: 'экмек' },
      { tr: 'Peynir', ru: 'Сыр', ph: 'пейнир' },
      { tr: 'Yumurta', ru: 'Яйцо', ph: 'юмурта' },
      { tr: 'Meyve', ru: 'Фрукты', ph: 'мейве' },
      { tr: 'Sebze', ru: 'Овощи', ph: 'себзе' },
      { tr: 'Et', ru: 'Мясо', ph: 'эт' },
      { tr: 'Balık', ru: 'Рыба', ph: 'балык' },
      { tr: 'Tavuk', ru: 'Курица', ph: 'тавук' },
      { tr: 'Süt', ru: 'Молоко', ph: 'сют' },
      { tr: 'Tatlı', ru: 'Десерт / сладкое', ph: 'татлы' },
    ],
  },
  {
    id: 'shopping', emoji: '🛍️', title: 'Покупки', subtitle: 'Цены, размеры, оплата',
    items: [
      { tr: 'Mağaza', ru: 'Магазин', ph: 'мааза' },
      { tr: 'Market', ru: 'Продуктовый', ph: 'маркет' },
      { tr: 'Para', ru: 'Деньги', ph: 'пара' },
      { tr: 'Ucuz', ru: 'Дёшево', ph: 'уджуз' },
      { tr: 'Pahalı', ru: 'Дорого', ph: 'пахалы' },
      { tr: 'Kaça?', ru: 'Почём?', ph: 'кача' },
      { tr: 'Beden', ru: 'Размер', ph: 'беден' },
      { tr: 'Poşet', ru: 'Пакет', ph: 'пошет' },
      { tr: 'Kartla', ru: 'Картой', ph: 'картла' },
      { tr: 'İndirim', ru: 'Скидка', ph: 'индирим' },
    ],
  },
  {
    id: 'transport', emoji: '🚌', title: 'Транспорт', subtitle: 'Автобус, билет, остановка',
    items: [
      { tr: 'Otobüs', ru: 'Автобус', ph: 'отобюс' },
      { tr: 'Metro', ru: 'Метро', ph: 'метро' },
      { tr: 'Taksi', ru: 'Такси', ph: 'такси' },
      { tr: 'Bilet', ru: 'Билет', ph: 'билет' },
      { tr: 'Durak', ru: 'Остановка', ph: 'дурак' },
      { tr: 'Tren', ru: 'Поезд', ph: 'трен' },
      { tr: 'Havalimanı', ru: 'Аэропорт', ph: 'хавалиманы' },
      { tr: 'Nereye?', ru: 'Куда?', ph: 'нерее' },
      { tr: 'Ne zaman?', ru: 'Когда?', ph: 'нэ заман' },
      { tr: 'Burada ineceğim', ru: 'Я выйду здесь', ph: 'бурада инеджеим' },
    ],
  },
  {
    id: 'weather', emoji: '🌦️', title: 'Погода и природа', subtitle: 'Солнце, дождь, море',
    items: [
      { tr: 'Hava', ru: 'Погода', ph: 'хава' },
      { tr: 'Güneşli', ru: 'Солнечно', ph: 'гюнешли' },
      { tr: 'Yağmur', ru: 'Дождь', ph: 'яамур' },
      { tr: 'Kar', ru: 'Снег', ph: 'кар' },
      { tr: 'Rüzgar', ru: 'Ветер', ph: 'рюзгяр' },
      { tr: 'Sıcak', ru: 'Жарко', ph: 'сыджак' },
      { tr: 'Soğuk', ru: 'Холодно', ph: 'соук' },
      { tr: 'Deniz', ru: 'Море', ph: 'дениз' },
      { tr: 'Güneş', ru: 'Солнце', ph: 'гюнеш' },
      { tr: 'Bugün hava güzel', ru: 'Сегодня хорошая погода', ph: 'бугюн хава гюзель' },
    ],
  },
  {
    id: 'colors', emoji: '🎨', title: 'Цвета', subtitle: 'Основные цвета',
    items: [
      { tr: 'Kırmızı', ru: 'Красный', ph: 'кырмызы' },
      { tr: 'Mavi', ru: 'Синий', ph: 'мави' },
      { tr: 'Yeşil', ru: 'Зелёный', ph: 'ешиль' },
      { tr: 'Sarı', ru: 'Жёлтый', ph: 'сары' },
      { tr: 'Siyah', ru: 'Чёрный', ph: 'сиях' },
      { tr: 'Beyaz', ru: 'Белый', ph: 'беяз' },
      { tr: 'Turuncu', ru: 'Оранжевый', ph: 'турунджу' },
      { tr: 'Pembe', ru: 'Розовый', ph: 'пембе' },
      { tr: 'Mor', ru: 'Фиолетовый', ph: 'мор' },
      { tr: 'Gri', ru: 'Серый', ph: 'гри' },
    ],
  },
];

// ===== ПРЕМИУМ-УРОКИ =====
// Открываются промокодом (продаются через каналы автора). rub — рекомендованная цена.
const PREMIUM_LESSONS = [
  {
    id: 'realty', emoji: '🏠', title: 'Турецкий для недвижимости', subtitle: 'Аренда, покупка, осмотр объекта', price: 500,
    items: [
      { tr: 'Daire kiralamak istiyorum', ru: 'Хочу снять квартиру', ph: 'даирэ кираламак истийорум' },
      { tr: 'Satılık mı, kiralık mı?', ru: 'Продаётся или сдаётся?', ph: 'сатылык мы, кьиралык мы' },
      { tr: 'Metrekaresi ne kadar?', ru: 'Какая площадь в кв. метрах?', ph: 'метрекареси нэ кадар' },
      { tr: 'Aidat ne kadar?', ru: 'Сколько коммунальные взносы?', ph: 'аидат нэ кадар' },
      { tr: 'Tapu hazır mı?', ru: 'Документы на собственность готовы?', ph: 'тапу хазыр мы' },
      { tr: 'Deniz manzaralı', ru: 'С видом на море', ph: 'дениз манзаралы' },
      { tr: 'Pazarlık payı var mı?', ru: 'Есть возможность торга?', ph: 'пазарлык пайы вар мы' },
    ],
  },
  {
    id: 'business', emoji: '💼', title: 'Деловые переговоры', subtitle: 'Встречи, договоры, сделки', price: 500,
    items: [
      { tr: 'Toplantı ne zaman?', ru: 'Когда встреча?', ph: 'топланты нэ заман' },
      { tr: 'Teklifinizi bekliyorum', ru: 'Жду ваше предложение', ph: 'теклифинизи беклийорум' },
      { tr: 'Sözleşme imzalayalım', ru: 'Давайте подпишем договор', ph: 'сёзлешме имзалаялым' },
      { tr: 'Fiyat üzerinde anlaşalım', ru: 'Давайте договоримся о цене', ph: 'фият юзеринде анлашалым' },
      { tr: 'Ödeme koşulları neler?', ru: 'Какие условия оплаты?', ph: 'ёдеме кошуллары нелер' },
      { tr: 'Beraber çalışmak isteriz', ru: 'Мы хотим работать вместе', ph: 'берабер чалышмак истериз' },
      { tr: 'Bu benim kartvizitim', ru: 'Это моя визитка', ph: 'бу беним картвизитим' },
    ],
  },
  {
    id: 'emergency', emoji: '🚑', title: 'Экстренные ситуации', subtitle: 'Здоровье, помощь, безопасность', price: 400,
    items: [
      { tr: 'Yardım edin!', ru: 'Помогите!', ph: 'ярдым эдин' },
      { tr: 'Doktora ihtiyacım var', ru: 'Мне нужен врач', ph: 'доктора ихтияджым вар' },
      { tr: 'Ambulans çağırın', ru: 'Вызовите скорую', ph: 'амбуланс чаырын' },
      { tr: 'Eczane nerede?', ru: 'Где аптека?', ph: 'эджзане нереде' },
      { tr: 'Alerjim var', ru: 'У меня аллергия', ph: 'алержим вар' },
      { tr: 'Pasaportumu kaybettim', ru: 'Я потерял паспорт', ph: 'пасапортуму кайбеттим' },
      { tr: 'Polisi arayın', ru: 'Позвоните в полицию', ph: 'полиси арайын' },
    ],
  },
  {
    id: 'bank', emoji: '🏦', title: 'Банк и документы', subtitle: 'Счёт, карта, оплата', price: 500,
    items: [
      { tr: 'Banka', ru: 'Банк', ph: 'банка' },
      { tr: 'Hesap açmak istiyorum', ru: 'Хочу открыть счёт', ph: 'хесап ачмак истийорум' },
      { tr: 'Para çekmek', ru: 'Снять деньги', ph: 'пара чекмек' },
      { tr: 'Kredi kartı', ru: 'Кредитная карта', ph: 'креди карты' },
      { tr: 'Kimlik', ru: 'Удостоверение личности', ph: 'кимлик' },
      { tr: 'İmza', ru: 'Подпись', ph: 'имза' },
      { tr: 'Döviz', ru: 'Валюта / обмен', ph: 'дёвиз' },
      { tr: 'Fatura', ru: 'Счёт / квитанция', ph: 'фатура' },
      { tr: 'Randevu almak', ru: 'Записаться на приём', ph: 'рандеву алмак' },
    ],
  },
  {
    id: 'tech', emoji: '💻', title: 'Технологии и интернет', subtitle: 'Телефон, приложения, сеть', price: 450,
    items: [
      { tr: 'İnternet', ru: 'Интернет', ph: 'интернет' },
      { tr: 'Şifre', ru: 'Пароль', ph: 'шифре' },
      { tr: 'Bağlantı', ru: 'Соединение', ph: 'баланты' },
      { tr: 'Uygulama', ru: 'Приложение', ph: 'уйгулама' },
      { tr: 'İndir', ru: 'Скачать', ph: 'индир' },
      { tr: 'Güncelle', ru: 'Обновить', ph: 'гюнджелле' },
      { tr: 'Ekran', ru: 'Экран', ph: 'экран' },
      { tr: 'Şarj', ru: 'Зарядка', ph: 'шарж' },
      { tr: 'Mesaj gönder', ru: 'Отправить сообщение', ph: 'месаж гёндер' },
    ],
  },
  {
    id: 'idioms', emoji: '🧠', title: 'Пословицы и идиомы', subtitle: 'Звучи как местный', price: 600,
    items: [
      { tr: 'Güle güle kullan', ru: 'Носи/пользуйся с удовольствием', ph: 'гюле гюле куллан' },
      { tr: 'Eline sağlık', ru: 'Спасибо за труд (здоровья рукам)', ph: 'элине саалык' },
      { tr: 'Maşallah', ru: 'Молодец! / Как хорошо!', ph: 'машаллах' },
      { tr: 'İnşallah', ru: 'Если даст Бог / Надеюсь', ph: 'иншаллах' },
      { tr: 'Geçmiş olsun', ru: 'Выздоравливай', ph: 'гечмиш олсун' },
      { tr: 'Hayırlı olsun', ru: 'В добрый час / Поздравляю', ph: 'хайырлы олсун' },
      { tr: 'Kolay gelsin', ru: 'Лёгкой работы', ph: 'колай гельсин' },
      { tr: 'Afiyet olsun', ru: 'Приятного аппетита', ph: 'афиет олсун' },
      { tr: 'Gözün aydın', ru: 'Поздравляю с радостью', ph: 'гёзюн айдын' },
    ],
  },
];

// Бонусные паки — открываются в магазине за монеты
const BONUS_LESSONS = [
  {
    id: 'taxi', emoji: '🚕', title: 'Такси и дорога', subtitle: 'Для тех, кто за рулём', price: 350,
    items: [
      { tr: 'Taksi çağırır mısınız?', ru: 'Вызовите такси?', ph: 'такси чаырыр мысыныз' },
      { tr: 'Havalimanına, lütfen', ru: 'В аэропорт, пожалуйста', ph: 'хавалиманына, лютфен' },
      { tr: 'Burada durun', ru: 'Остановитесь здесь', ph: 'бурада дурун' },
      { tr: 'Trafik çok yoğun', ru: 'Очень плотное движение', ph: 'трафик чок йоун' },
      { tr: 'Emniyet kemeri', ru: 'Ремень безопасности', ph: 'эмниет кемери' },
      { tr: 'Benzin istasyonu', ru: 'Заправка', ph: 'бензин истасьону' },
      { tr: 'Yavaş, lütfen', ru: 'Помедленнее, пожалуйста', ph: 'яваш, лютфен' },
    ],
  },
  {
    id: 'bazaar', emoji: '🛍️', title: 'Базар и торг', subtitle: 'Сбиваем цену как местный', price: 350,
    items: [
      { tr: 'İndirim var mı?', ru: 'Есть скидка?', ph: 'индирим вар мы' },
      { tr: 'Biraz indirim yapar mısınız?', ru: 'Сделаете небольшую скидку?', ph: 'бираз индирим япар мысыныз' },
      { tr: 'Bunu alıyorum', ru: 'Беру это', ph: 'буну алыйорум' },
      { tr: 'Kartla ödeyebilir miyim?', ru: 'Можно оплатить картой?', ph: 'картла ёдейебилир мийим' },
      { tr: 'Nakit', ru: 'Наличные', ph: 'накит' },
      { tr: 'Çok pahalı, abi!', ru: 'Очень дорого, брат!', ph: 'чок пахалы, аби' },
      { tr: 'Sadece bakıyorum', ru: 'Я просто смотрю', ph: 'садедже бакыйорум' },
    ],
  },
  {
    id: 'slang', emoji: '🔥', title: 'Сленг и эмоции', subtitle: 'Звучи как турок', price: 300,
    items: [
      { tr: 'Harika!', ru: 'Супер!', ph: 'харика' },
      { tr: 'Aynen', ru: 'Точно! / Ага', ph: 'айнен' },
      { tr: 'Hadi!', ru: 'Давай! / Ну же!', ph: 'хади' },
      { tr: 'Yok artık!', ru: 'Да ладно!', ph: 'йок артык' },
      { tr: 'Kolay gelsin', ru: 'Лёгкой работы', ph: 'колай гельсин' },
      { tr: 'Afiyet olsun', ru: 'Приятного аппетита', ph: 'афиет олсун' },
      { tr: 'Geçmiş olsun', ru: 'Выздоравливай / Сочувствую', ph: 'гечмиш олсун' },
    ],
  },
  {
    id: 'creator', emoji: '🎬', title: 'AI-креатор и бизнес', subtitle: 'Контент, соцсети, сделки', price: 350,
    items: [
      { tr: 'Yapay zeka', ru: 'Искусственный интеллект', ph: 'япай зека' },
      { tr: 'Video çekiyorum', ru: 'Я снимаю видео', ph: 'видео чекийорум' },
      { tr: 'İş birliği yapalım', ru: 'Давайте сотрудничать', ph: 'иш бирлии япалым' },
      { tr: 'Fiyat teklifi', ru: 'Коммерческое предложение', ph: 'фият теклифи' },
      { tr: 'Takip et', ru: 'Подпишись (в соцсетях)', ph: 'такип эт' },
      { tr: 'Kanalıma abone ol', ru: 'Подпишись на мой канал', ph: 'каналыма абоне ол' },
      { tr: 'Harika bir fikir', ru: 'Отличная идея', ph: 'харика бир фикир' },
    ],
  },
  {
    id: 'romance', emoji: '💘', title: 'Комплименты', subtitle: 'Растопить сердце', price: 300,
    items: [
      { tr: 'Çok güzelsin', ru: 'Ты очень красивая', ph: 'чок гюзельсин' },
      { tr: 'Gülüşün çok tatlı', ru: 'У тебя милая улыбка', ph: 'гюлюшюн чок татлы' },
      { tr: 'Kahve içelim mi?', ru: 'Выпьем кофе?', ph: 'кахве ичелим ми' },
      { tr: 'Seni özledim', ru: 'Я скучаю по тебе', ph: 'сени ёзледим' },
      { tr: 'Seni seviyorum', ru: 'Я тебя люблю', ph: 'сени севийорум' },
      { tr: 'Canım', ru: 'Дорогая / Дорогой (душа моя)', ph: 'джаным' },
      { tr: 'Numaranı alabilir miyim?', ru: 'Можно твой номер?', ph: 'нумараны алабилир мийим' },
    ],
  },
];

// Карточки знаний — грамматика и культура, покупаются за монеты
// ===== БОЛЬШОЙ УРОК «ТУРЦИЯ ПО ОБЪЯВЛЕНИЯМ» (sahibinden) =====
// Коллекция: один большой урок, разбитый на категории. Каждая категория
// проходится как обычный урок (произношение, монеты, звёзды). Бесплатно.
const CLASSIFIEDS = {
  id: 'sahibinden', emoji: '📣', title: 'Турция по объявлениям',
  subtitle: 'Язык сайтов объявлений: категории, жильё, авто, товары',
  sections: [
    {
      id: 'cls_cats', emoji: '🗂️', title: 'Категории сайта', subtitle: 'Разделы объявлений',
      items: [
        { tr: 'Emlak', ru: 'Недвижимость', ph: 'эмлак' },
        { tr: 'Vasıta', ru: 'Транспорт', ph: 'васыта' },
        { tr: 'Yedek parça', ru: 'Запчасти', ph: 'едек парча' },
        { tr: 'İkinci el', ru: 'Б/у (вторые руки)', ph: 'икинджи эль' },
        { tr: 'İş makineleri', ru: 'Спецтехника', ph: 'иш макинелери' },
        { tr: 'Usta ve hizmetler', ru: 'Мастера и услуги', ph: 'уста ве хизметлер' },
        { tr: 'Özel ders', ru: 'Частные уроки', ph: 'ёзель дерс' },
        { tr: 'İş ilanları', ru: 'Вакансии', ph: 'иш иланлары' },
        { tr: 'Evde bakım', ru: 'Уход на дому', ph: 'эвде бакым' },
        { tr: 'Hayvanlar alemi', ru: 'Животные', ph: 'хайванлар алеми' },
        { tr: 'Elektronik', ru: 'Электроника', ph: 'электроник' },
        { tr: 'Ev ve bahçe', ru: 'Дом и сад', ph: 'эв ве бахче' },
        { tr: 'Moda ve giyim', ru: 'Мода и одежда', ph: 'мода ве гийим' },
      ],
    },
    {
      id: 'cls_realty', emoji: '🏠', title: 'Недвижимость', subtitle: 'Жильё: от комнат до м²',
      items: [
        { tr: 'Kiralık', ru: 'Сдаётся в аренду', ph: 'кьиралык' },
        { tr: 'Satılık', ru: 'Продаётся', ph: 'сатылык' },
        { tr: 'Daire', ru: 'Квартира', ph: 'даирэ' },
        { tr: 'Villa', ru: 'Вилла', ph: 'вилла' },
        { tr: 'Müstakil ev', ru: 'Отдельный дом', ph: 'мюстакиль эв' },
        { tr: 'Stüdyo', ru: 'Студия', ph: 'стюдьо' },
        { tr: 'İki artı bir', ru: '2 комнаты + гостиная (2+1)', ph: 'ики арты бир' },
        { tr: 'Metrekare', ru: 'Квадратный метр (м²)', ph: 'метрекаре' },
        { tr: 'Kat', ru: 'Этаж', ph: 'кат' },
        { tr: 'Bina yaşı', ru: 'Возраст здания', ph: 'бина яшы' },
        { tr: 'Eşyalı', ru: 'С мебелью', ph: 'эшьялы' },
        { tr: 'Eşyasız', ru: 'Без мебели', ph: 'эшьясыз' },
        { tr: 'Aidat', ru: 'Коммунальные взносы', ph: 'аидат' },
        { tr: 'Depozito', ru: 'Залог (депозит)', ph: 'депозито' },
        { tr: 'Asansör', ru: 'Лифт', ph: 'асансёр' },
        { tr: 'Otopark', ru: 'Парковка', ph: 'отопарк' },
        { tr: 'Deniz manzaralı', ru: 'С видом на море', ph: 'дениз манзаралы' },
      ],
    },
    {
      id: 'cls_auto', emoji: '🚗', title: 'Авто и транспорт', subtitle: 'Параметры машины',
      items: [
        { tr: 'Otomobil', ru: 'Автомобиль', ph: 'отомобиль' },
        { tr: 'Arazi aracı', ru: 'Внедорожник (SUV)', ph: 'арази араджы' },
        { tr: 'Motosiklet', ru: 'Мотоцикл', ph: 'мотосиклет' },
        { tr: 'Model yılı', ru: 'Год выпуска', ph: 'модель йылы' },
        { tr: 'Kilometre', ru: 'Пробег (км)', ph: 'километре' },
        { tr: 'Yakıt', ru: 'Топливо', ph: 'якыт' },
        { tr: 'Benzin', ru: 'Бензин', ph: 'бензин' },
        { tr: 'Dizel', ru: 'Дизель', ph: 'дизель' },
        { tr: 'Otomatik vites', ru: 'Автоматическая коробка', ph: 'отоматик витес' },
        { tr: 'Manuel vites', ru: 'Механика', ph: 'мануэль витес' },
        { tr: 'Hasar kaydı', ru: 'История повреждений', ph: 'хасар кайды' },
        { tr: 'Değişen yok', ru: 'Без замен деталей', ph: 'дейишен йок' },
        { tr: 'Sahibinden', ru: 'От собственника', ph: 'сахибинден' },
        { tr: 'Takas', ru: 'Обмен (трейд-ин)', ph: 'такас' },
        { tr: 'Muayene', ru: 'Техосмотр', ph: 'муайене' },
      ],
    },
    {
      id: 'cls_goods', emoji: '🛒', title: 'Товары', subtitle: 'Б/у и новое, доставка',
      items: [
        { tr: 'Sıfır', ru: 'Новый (нулёвый)', ph: 'сыфыр' },
        { tr: 'İkinci el', ru: 'Б/у', ph: 'икинджи эль' },
        { tr: 'Garantili', ru: 'С гарантией', ph: 'гарантили' },
        { tr: 'Faturalı', ru: 'С чеком', ph: 'фатуралы' },
        { tr: 'Kutusunda', ru: 'В коробке', ph: 'кутусунда' },
        { tr: 'Kargo', ru: 'Доставка', ph: 'карго' },
        { tr: 'Ücretsiz kargo', ru: 'Бесплатная доставка', ph: 'юджретсиз карго' },
        { tr: 'Kapıda ödeme', ru: 'Оплата при получении', ph: 'капыда ёдеме' },
        { tr: 'Pazarlık payı var', ru: 'Торг уместен', ph: 'пазарлык пайы вар' },
        { tr: 'Pazarlık yok', ru: 'Без торга', ph: 'пазарлык йок' },
        { tr: 'Elden teslim', ru: 'Из рук в руки', ph: 'эльден теслим' },
        { tr: 'Stokta var', ru: 'Есть в наличии', ph: 'стокта вар' },
        { tr: 'Tükendi', ru: 'Закончился', ph: 'тюкенди' },
      ],
    },
    {
      id: 'cls_terms', emoji: '💬', title: 'Слова объявления', subtitle: 'Цена, описание, контакты',
      items: [
        { tr: 'İlan', ru: 'Объявление', ph: 'илан' },
        { tr: 'İlan no', ru: 'Номер объявления', ph: 'илан но' },
        { tr: 'Fiyat', ru: 'Цена', ph: 'фият' },
        { tr: 'Lira', ru: 'Лира (TL)', ph: 'лира' },
        { tr: 'Açıklama', ru: 'Описание', ph: 'ачыклама' },
        { tr: 'Konum', ru: 'Локация', ph: 'конум' },
        { tr: 'İletişim', ru: 'Контакты', ph: 'илетишим' },
        { tr: 'Telefon', ru: 'Телефон', ph: 'телефон' },
        { tr: 'Mesaj', ru: 'Сообщение', ph: 'месаж' },
        { tr: 'Acil', ru: 'Срочно', ph: 'аджиль' },
        { tr: 'Ücretsiz', ru: 'Бесплатно', ph: 'юджретсиз' },
        { tr: 'Rezerve', ru: 'Забронировано', ph: 'резерве' },
        { tr: 'Güncel', ru: 'Актуально', ph: 'гюнджель' },
        { tr: 'Favorilere ekle', ru: 'Добавить в избранное', ph: 'фаворилере экле' },
      ],
    },
    {
      id: 'cls_services', emoji: '🛠️', title: 'Услуги и работа', subtitle: 'Мастера, вакансии',
      items: [
        { tr: 'Usta', ru: 'Мастер', ph: 'уста' },
        { tr: 'Nakliyat', ru: 'Переезд (перевозка)', ph: 'наклият' },
        { tr: 'Tadilat', ru: 'Ремонт', ph: 'тадилат' },
        { tr: 'Tesisatçı', ru: 'Сантехник', ph: 'тесисатчы' },
        { tr: 'Elektrikçi', ru: 'Электрик', ph: 'электрикчи' },
        { tr: 'Boyacı', ru: 'Маляр', ph: 'бояджы' },
        { tr: 'Temizlik', ru: 'Уборка', ph: 'темизлик' },
        { tr: 'Özel ders', ru: 'Частные уроки', ph: 'ёзель дерс' },
        { tr: 'İş ilanı', ru: 'Вакансия', ph: 'иш иланы' },
        { tr: 'Maaş', ru: 'Зарплата', ph: 'мааш' },
        { tr: 'Tam zamanlı', ru: 'Полная занятость', ph: 'там заманлы' },
        { tr: 'Yarı zamanlı', ru: 'Частичная занятость', ph: 'яры заманлы' },
        { tr: 'Bakıcı', ru: 'Няня / сиделка', ph: 'бакыджы' },
      ],
    },
    {
      id: 'cls_account', emoji: '📱', title: 'Аккаунт и приложение', subtitle: 'Вход, настройки, уведомления',
      items: [
        { tr: 'Ayarlar', ru: 'Настройки', ph: 'айарлар' },
        { tr: 'Profil', ru: 'Профиль', ph: 'профиль' },
        { tr: 'Hesabım', ru: 'Мой аккаунт', ph: 'хесабым' },
        { tr: 'Giriş yap', ru: 'Войти', ph: 'гириш яп' },
        { tr: 'Kayıt ol', ru: 'Зарегистрироваться', ph: 'кайыт ол' },
        { tr: 'Çıkış yap', ru: 'Выйти', ph: 'чыкыш яп' },
        { tr: 'Şifre', ru: 'Пароль', ph: 'шифре' },
        { tr: 'Şifremi unuttum', ru: 'Я забыл пароль', ph: 'шифреми унуттум' },
        { tr: 'Bildirimler', ru: 'Уведомления', ph: 'бильдиримлер' },
        { tr: 'Dil', ru: 'Язык', ph: 'диль' },
        { tr: 'Güvenlik', ru: 'Безопасность', ph: 'гювенлик' },
        { tr: 'Gizlilik', ru: 'Конфиденциальность', ph: 'гизлилик' },
        { tr: 'Konum izni', ru: 'Доступ к геолокации', ph: 'конум изни' },
        { tr: 'Kamera izni', ru: 'Доступ к камере', ph: 'камера изни' },
        { tr: 'Yardım', ru: 'Помощь', ph: 'ярдым' },
      ],
    },
  ],
  dialogs: [
    {
      id: 'dlg_rent', emoji: '🏠', title: 'Снимаю квартиру', subtitle: 'Диалог с арендодателем',
      lines: [
        { who: 'them', tr: 'Buyurun, nasıl yardımcı olabilirim?', ru: 'Здравствуйте, чем могу помочь?', ph: 'буюрун, насыл ярдымджы олабилирим' },
        { who: 'you', tr: 'Kiralık daire arıyorum', ru: 'Ищу квартиру в аренду', ph: 'кьиралык даирэ арыйорум', blank: 'Kiralık', opts: ['Kiralık', 'Satılık', 'Eşyalı'] },
        { who: 'them', tr: 'Kaç oda istiyorsunuz?', ru: 'Сколько комнат хотите?', ph: 'кач ода истийорсунуз' },
        { who: 'you', tr: 'Eşyalı bir daire olsun', ru: 'Пусть будет с мебелью', ph: 'эшьялы бир даирэ олсун', blank: 'Eşyalı', opts: ['Eşyalı', 'Kiralık', 'Faturalı'] },
        { who: 'them', tr: 'Aidat ayda beş yüz lira', ru: 'Коммуналка 500 лир в месяц', ph: 'аидат айда беш юз лира' },
        { who: 'you', tr: 'Depozito ne kadar?', ru: 'Сколько залог?', ph: 'депозито нэ кадар', blank: 'Depozito', opts: ['Depozito', 'Kargo', 'Maaş'] },
        { who: 'them', tr: 'Bir kira depozito', ru: 'Залог — одна аренда', ph: 'бир кира депозито' },
        { who: 'you', tr: 'Anlaştık, teşekkürler', ru: 'Договорились, спасибо', ph: 'анлаштык, тешеккюрлер' },
      ],
    },
    {
      id: 'dlg_car', emoji: '🚗', title: 'Смотрю машину', subtitle: 'Диалог с продавцом авто',
      lines: [
        { who: 'them', tr: 'Araç sahibinden satılık', ru: 'Машина продаётся от собственника', ph: 'арач сахибинден сатылык' },
        { who: 'you', tr: 'Kilometre kaç?', ru: 'Какой пробег?', ph: 'километре кач', blank: 'Kilometre', opts: ['Kilometre', 'Fiyat', 'Maaş'] },
        { who: 'them', tr: 'Seksen bin kilometre', ru: '80 тысяч км', ph: 'сексен бин километре' },
        { who: 'you', tr: 'Hasar kaydı var mı?', ru: 'Есть история ДТП?', ph: 'хасар кайды вар мы', blank: 'Hasar', opts: ['Hasar', 'Kargo', 'Daire'] },
        { who: 'them', tr: 'Hayır, değişen yok', ru: 'Нет, без замен', ph: 'хайыр, дейишен йок' },
        { who: 'you', tr: 'Takas olur mu?', ru: 'Обмен возможен?', ph: 'такас олур му', blank: 'Takas', opts: ['Takas', 'Aidat', 'Fiyat'] },
        { who: 'them', tr: 'Olur, fark alırım', ru: 'Можно, с доплатой', ph: 'олур, фарк алырым' },
        { who: 'you', tr: 'Yarın bakmaya geleyim', ru: 'Приду посмотреть завтра', ph: 'ярын бакмая гелейим' },
      ],
    },
    {
      id: 'dlg_deal', emoji: '🛒', title: 'Торгуюсь по объявлению', subtitle: 'Сбиваем цену и доставку',
      lines: [
        { who: 'them', tr: 'İlan hâlâ güncel', ru: 'Объявление ещё актуально', ph: 'илан халя гюнджель' },
        { who: 'you', tr: 'Fiyat son mu?', ru: 'Цена окончательная?', ph: 'фият сон му', blank: 'Fiyat', opts: ['Fiyat', 'Konum', 'Şifre'] },
        { who: 'them', tr: 'Biraz pazarlık payı var', ru: 'Небольшой торг есть', ph: 'бираз пазарлык пайы вар' },
        { who: 'you', tr: 'İndirim yapar mısınız?', ru: 'Сделаете скидку?', ph: 'индирим япар мысыныз', blank: 'İndirim', opts: ['İndirim', 'Kargo', 'Aidat'] },
        { who: 'them', tr: 'Elden teslim olsun', ru: 'Давайте из рук в руки', ph: 'эльден теслим олсун' },
        { who: 'you', tr: 'Kargo mümkün mü?', ru: 'Доставка возможна?', ph: 'карго мюмкюн мю', blank: 'Kargo', opts: ['Kargo', 'Depozito', 'Maaş'] },
        { who: 'them', tr: 'Tabii, kapıda ödeme', ru: 'Конечно, оплата при получении', ph: 'таби, капыда ёдеме' },
        { who: 'you', tr: 'Harika, alıyorum', ru: 'Отлично, беру', ph: 'харика, алыйорум' },
      ],
    },
    {
      id: 'dlg_signup', emoji: '📱', title: 'Регистрация в приложении', subtitle: 'Вход, пароль, настройки',
      lines: [
        { who: 'them', tr: 'Uygulamaya hoş geldiniz', ru: 'Добро пожаловать в приложение', ph: 'уйгуламая хош гельдиниз' },
        { who: 'you', tr: 'Kayıt olmak istiyorum', ru: 'Хочу зарегистрироваться', ph: 'кайыт олмак истийорум', blank: 'Kayıt', opts: ['Kayıt', 'Çıkış', 'Konum'] },
        { who: 'them', tr: 'Şifrenizi oluşturun', ru: 'Создайте пароль', ph: 'шифренизи олуштурун' },
        { who: 'you', tr: 'Şifremi unuttum', ru: 'Я забыл пароль', ph: 'шифреми унуттум', blank: 'Şifremi', opts: ['Şifremi', 'Profil', 'Dil'] },
        { who: 'them', tr: 'Bildirimlere izin verin', ru: 'Разрешите уведомления', ph: 'бильдиримлере изин верин' },
        { who: 'you', tr: 'Ayarlar nerede?', ru: 'Где настройки?', ph: 'айарлар нереде', blank: 'Ayarlar', opts: ['Ayarlar', 'Takas', 'Kiralık'] },
        { who: 'them', tr: 'Profil sayfasında', ru: 'На странице профиля', ph: 'профиль сайфасында' },
        { who: 'you', tr: 'Teşekkürler, giriş yaptım', ru: 'Спасибо, я вошёл', ph: 'тешеккюрлер, гириш яптым' },
      ],
    },
  ],
};

const KNOWLEDGE = [
  {
    id: 'alphabet', emoji: '🔤', title: 'Алфавит и звуки', price: 60,
    html: `<p>Турецкий читается почти так, как пишется. Запомни особые буквы:</p>
<table><tr><td><b>Ç ç</b></td><td>ч — <i>çay</i> (чай)</td></tr>
<tr><td><b>Ş ş</b></td><td>ш — <i>şimdi</i> (шимди)</td></tr>
<tr><td><b>C c</b></td><td>дж — <i>cami</i> (джами, мечеть)</td></tr>
<tr><td><b>Ğ ğ</b></td><td>не читается, удлиняет гласную — <i>dağ</i> (даа, гора)</td></tr>
<tr><td><b>I ı</b></td><td>ы — <i>ılık</i> (ылык, тёплый)</td></tr>
<tr><td><b>İ i</b></td><td>и — <i>iki</i> (ики)</td></tr>
<tr><td><b>Ö ö</b></td><td>ё — <i>özür</i> (ёзюр)</td></tr>
<tr><td><b>Ü ü</b></td><td>ю — <i>üç</i> (юч)</td></tr>
<tr><td><b>Y y</b></td><td>й — <i>yok</i> (йок)</td></tr></table>
<p>💡 Ударение чаще всего падает на <b>последний слог</b>: merha<b>BA</b>, teşekkür<b>LER</b>.</p>`,
  },
  {
    id: 'harmony', emoji: '🎵', title: 'Гармония гласных', price: 80,
    html: `<p>Главный «закон» турецкого: гласные в окончании подстраиваются под последнюю гласную слова.</p>
<p><b>Задние:</b> a, ı, o, u &nbsp;→&nbsp; окончание с <b>a / ı</b><br>
<b>Передние:</b> e, i, ö, ü &nbsp;→&nbsp; окончание с <b>e / i</b></p>
<p>Пример с «-da/-de» (в, на):<br>
<i>Moskova<b>da</b></i> — в Москве<br>
<i>ev<b>de</b></i> — дома</p>
<p>💡 Слушай, как звучит: язык не прыгает «туда-сюда» — поэтому турецкий такой мелодичный.</p>`,
  },
  {
    id: 'plural', emoji: '➕', title: 'Множественное число', price: 60,
    html: `<p>Добавляем <b>-lar</b> или <b>-ler</b> по гармонии гласных:</p>
<p><i>kitap → kitap<b>lar</b></i> — книги<br>
<i>araba → araba<b>lar</b></i> — машины<br>
<i>ev → ev<b>ler</b></i> — дома<br>
<i>göz → göz<b>ler</b></i> — глаза</p>
<p>💡 После числительных множественное <b>не ставится</b>: <i>iki kitap</i> — две книги (дословно «две книга»).</p>`,
  },
  {
    id: 'wordorder', emoji: '🧩', title: 'Порядок слов', price: 70,
    html: `<p>В турецком глагол всегда <b>в конце</b>: Кто → Что → Делает.</p>
<p><i>Ben çay içiyorum.</i><br>Я чай пью.</p>
<p><i>Saşa video çekiyor.</i><br>Саша видео снимает.</p>
<p>💡 Местоимение часто опускают: окончание глагола уже говорит, кто действует. <i>İçiyorum</i> = «я пью».</p>`,
  },
  {
    id: 'questions', emoji: '❓', title: 'Вопросы с mı/mi', price: 80,
    html: `<p>Чтобы задать вопрос «да/нет», ставим частицу <b>mı / mi / mu / mü</b> после слова (по гармонии):</p>
<p><i>Güzel <b>mi</b>?</i> — Красиво?<br>
<i>Pahalı <b>mı</b>?</i> — Дорого?<br>
<i>Hazır <b>mısın</b>?</i> — Ты готов?<br>
<i>Kahve içelim <b>mi</b>?</i> — Выпьем кофе?</p>
<p>💡 Частица пишется <b>отдельно</b>, но произносится слитно с интонацией вверх.</p>`,
  },
  {
    id: 'negation', emoji: '🚫', title: 'Отрицание', price: 80,
    html: `<p>Отрицание вставляется <b>внутрь глагола</b>: -ma / -me (с -yor становится -mı/-mi/-mu/-mü).</p>
<p><i>Biliyorum</i> — знаю → <i>Bil<b>mi</b>yorum</i> — не знаю<br>
<i>Geliyorum</i> — иду → <i>Gel<b>mi</b>yorum</i> — не иду<br>
<i>Merak et</i> — волнуйся → <i>Merak et<b>me</b></i> — не волнуйся</p>
<p>💡 «Нет / не имеется» — отдельное слово <b>yok</b>: <i>Para yok</i> — денег нет.</p>`,
  },
  {
    id: 'iam', emoji: '🙋', title: '«Я — …»: личные окончания', price: 90,
    html: `<p>Слова «есть/являюсь» нет — вместо него окончание:</p>
<table><tr><td>я</td><td>-ım, -im, -um, -üm</td><td><i>Yorgun<b>um</b></i> — я устал</td></tr>
<tr><td>ты</td><td>-sın, -sin, -sun, -sün</td><td><i>Güzel<b>sin</b></i> — ты красивая</td></tr>
<tr><td>мы</td><td>-ız, -iz, -uz, -üz</td><td><i>Hazır<b>ız</b></i> — мы готовы</td></tr></table>
<p>После гласной добавляется <b>y</b>: <i>Rusyalı<b>y</b>ım</i> — я из России.</p>`,
  },
  {
    id: 'present', emoji: '⚡', title: 'Настоящее время -yor', price: 100,
    html: `<p>Основа глагола + <b>-(ı/i/u/ü)yor</b> + личное окончание:</p>
<p><i>gel</i> (приходить) → <i>gel<b>iyor</b>um</i> — я прихожу<br>
<i>yap</i> (делать) → <i>yap<b>ıyor</b>sun</i> — ты делаешь<br>
<i>çek</i> (снимать) → <i>çek<b>iyor</b></i> — он снимает<br>
<i>yaşa</i> (жить) → <i>yaş<b>ıyor</b>um</i> — я живу</p>
<p>💡 Это самое ходовое время — покрывает 70% разговорной речи.</p>`,
  },
  {
    id: 'culture', emoji: '🫖', title: 'Культурные лайфхаки', price: 50,
    html: `<ul>
<li>🫖 Чай (<i>çay</i>) — это религия. Отказаться от чая в гостях — почти обидеть.</li>
<li>👨 <b>Abi</b> (брат) и <b>abla</b> (сестра) — вежливое обращение к незнакомым старше тебя.</li>
<li>🛠️ Видишь, что человек работает, — скажи <i>Kolay gelsin</i>. Это мгновенно располагает.</li>
<li>👟 В доме разуваются — тебе дадут тапочки.</li>
<li>🍽️ Перед едой — <i>Afiyet olsun</i>, хозяйке после еды — <i>Elinize sağlık</i> («здоровья вашим рукам»).</li>
<li>🧿 Назар (синий глаз) — оберег от сглаза, а не просто сувенир.</li>
</ul>`,
  },
];

// Бустеры
const BOOSTERS = [
  { id: 'freeze', emoji: '🧊', title: 'Заморозка серии', desc: 'Спасёт 🔥 серию, если пропустишь день', price: 80 },
  { id: 'double', emoji: '💰', title: 'Двойные монеты', desc: 'x2 монет на следующий урок', price: 100 },
];

const ACHIEVEMENTS = [
  { id: 'first_lesson', emoji: '🎓', title: 'Первый шаг', desc: 'Пройди первый урок', reward: 20 },
  { id: 'five_lessons', emoji: '🏅', title: 'В ритме', desc: 'Пройди 5 уроков', reward: 50 },
  { id: 'all_core', emoji: '👑', title: 'Султан основ', desc: 'Пройди все основные уроки', reward: 200 },
  { id: 'speech10', emoji: '🎙️', title: 'Чистый акцент', desc: '10 идеальных произношений', reward: 30 },
  { id: 'speech50', emoji: '🗣️', title: 'Как носитель', desc: '50 идеальных произношений', reward: 100 },
  { id: 'perfect', emoji: '💎', title: 'Без ошибок', desc: 'Пройди урок без единой ошибки', reward: 30 },
  { id: 'streak3', emoji: '🔥', title: 'Огонёк', desc: 'Серия 3 дня подряд', reward: 30 },
  { id: 'streak7', emoji: '☄️', title: 'Неделя огня', desc: 'Серия 7 дней подряд', reward: 100 },
  { id: 'buyer', emoji: '🛒', title: 'Инвестор в себя', desc: 'Купи что-нибудь в магазине', reward: 15 },
  { id: 'rich', emoji: '🪙', title: 'Копилка', desc: 'Заработай 1000 монет за всё время', reward: 50 },
];

const TURKISH_ALPHABET = [
  { l: 'A', n: 'а', ex: 'anne', exru: 'мама' },
  { l: 'B', n: 'бе', ex: 'baba', exru: 'папа' },
  { l: 'C', n: 'дже', ex: 'cam', exru: 'стекло' },
  { l: 'Ç', n: 'че', ex: 'çay', exru: 'чай' },
  { l: 'D', n: 'де', ex: 'deniz', exru: 'море' },
  { l: 'E', n: 'э', ex: 'ev', exru: 'дом' },
  { l: 'F', n: 'фе', ex: 'fil', exru: 'слон' },
  { l: 'G', n: 'ге', ex: 'gül', exru: 'роза' },
  { l: 'Ğ', n: 'мягкое г', ex: 'dağ', exru: 'гора (удлиняет гласную)' },
  { l: 'H', n: 'хе', ex: 'hava', exru: 'воздух' },
  { l: 'I', n: 'ы', ex: 'ılık', exru: 'тёплый' },
  { l: 'İ', n: 'и', ex: 'iki', exru: 'два' },
  { l: 'J', n: 'жэ', ex: 'jöle', exru: 'желе' },
  { l: 'K', n: 'ке', ex: 'kedi', exru: 'кошка' },
  { l: 'L', n: 'ле', ex: 'limon', exru: 'лимон' },
  { l: 'M', n: 'ме', ex: 'masa', exru: 'стол' },
  { l: 'N', n: 'не', ex: 'numara', exru: 'номер' },
  { l: 'O', n: 'о', ex: 'oda', exru: 'комната' },
  { l: 'Ö', n: 'ё', ex: 'göz', exru: 'глаз' },
  { l: 'P', n: 'пе', ex: 'para', exru: 'деньги' },
  { l: 'R', n: 'ре', ex: 'renk', exru: 'цвет' },
  { l: 'S', n: 'се', ex: 'su', exru: 'вода' },
  { l: 'Ş', n: 'ше', ex: 'şeker', exru: 'сахар' },
  { l: 'T', n: 'те', ex: 'tuz', exru: 'соль' },
  { l: 'U', n: 'у', ex: 'un', exru: 'мука' },
  { l: 'Ü', n: 'ю', ex: 'ütü', exru: 'утюг' },
  { l: 'V', n: 'ве', ex: 'vazo', exru: 'ваза' },
  { l: 'Y', n: 'йе', ex: 'yıl', exru: 'год' },
  { l: 'Z', n: 'зе', ex: 'zaman', exru: 'время' },
];

const RANKS = ['Турист', 'Гость', 'Путешественник', 'Местный', 'Знаток', 'Эфенди', 'Паша', 'Визирь', 'Султан'];
