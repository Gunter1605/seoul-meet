/**
 * Seoul Meet — Menu Data
 * Все данные меню по умолчанию. При изменении через Admin Panel
 * данные сохраняются в localStorage и этот файл не трогается.
 */

'use strict';

/* ── Модификатор: Острота (дефолт — Средний) ── */
const SPICE = {
  id: 'spice',
  name: 'Острота',
  required: true,
  defaultOption: 'medium',
  options: [
    { id: 'mild',   name: 'Не острый',    priceAdj: 0 },
    { id: 'medium', name: 'Средний 🌶',   priceAdj: 0 },
    { id: 'hot',    name: 'Острый 🌶🌶',  priceAdj: 0 }
  ]
};

/* ── Модификатор: Добавить сыр (с ценой p тенге) ── */
const CHEESE = (p) => ({
  id: 'cheese',
  name: 'Добавить сыр',
  required: false,
  defaultOption: 'no',
  options: [
    { id: 'no',  name: 'Без сыра',    priceAdj: 0 },
    { id: 'yes', name: 'С сыром 🧀',  priceAdj: p }
  ]
});

const DEFAULT_DATA = {

  /* ── КАТЕГОРИИ ── */
  categories: [
    { id: 'bbq',        nameShort: 'BBQ',      name: 'Korean BBQ',        desc: 'Мясо на угольном гриле · Подаётся с гарнирами и соусами', order: 0 },
    { id: 'prime',      nameShort: 'Prime',     name: 'Prime Beef BBQ',    desc: 'Мраморная говядина · Премиальный выбор',                  order: 1 },
    { id: 'appetizers', nameShort: 'Закуски',   name: 'Appetizers',        desc: 'Закуски · Снеки · Лёгкие блюда',                          order: 2 },
    { id: 'dishes',     nameShort: 'Блюда',     name: 'Korean Dishes',     desc: 'Горячие блюда корейской кухни',                           order: 3 },
    { id: 'ramen',      nameShort: 'Рамён',     name: 'Ramen',             desc: 'Классический корейский рамён',                            order: 4 },
    { id: 'kimbap',     nameShort: 'Кимпаб',    name: 'Kimbap & Bibimbap', desc: 'Корейские роллы и рис с начинками',                       order: 5 },
    { id: 'soups',      nameShort: 'Супы',      name: 'Soups',             desc: 'Традиционные корейские супы',                             order: 6 },
    { id: 'noodles',    nameShort: 'Лапша',     name: 'Noodles',           desc: 'Лапша · Горячая и холодная',                              order: 7 },
    { id: 'kids',       nameShort: 'Детям',     name: 'For Kids',          desc: 'Детское меню · специально для маленьких гостей',          order: 8 }
  ],

  /* ── БЛЮДА ── */
  items: [

    // ───────── KOREAN BBQ ─────────
    { id: 'b1', cat: 'bbq', sub: 'Говядина', name: 'Чадольбаги',        desc: 'Тонко нарезанная филейная часть говядины',                                  price: 7000, weight: '200 г', img: null, badges: [],              mods: [],                    isPrime: false },
    { id: 'b2', cat: 'bbq', sub: 'Говядина', name: 'Яннём чадольбаги',  desc: 'Тонко нарезанная филейная часть говядины, маринованная в особом соусе',     price: 7000, weight: '200 г', img: null, badges: ['spicy'],       mods: [],                    isPrime: false },
    { id: 'b3', cat: 'bbq', sub: 'Говядина', name: 'Пулькоги',          desc: 'Маринованная говяжья вырезка в грушево-соевом соусе',                       price: 7000, weight: '250 г', img: null, badges: [],              mods: [],                    isPrime: false },
    { id: 'b4', cat: 'bbq', sub: 'Говядина', name: 'Чумулёк',           desc: 'Маринованные говяжьи медальоны в соево-чесночном соусе',                    price: 7000, weight: '200 г', img: null, badges: [],              mods: [],                    isPrime: false },
    { id: 'b5', cat: 'bbq', sub: 'Свинина',  name: 'Моксаль',           desc: 'Свиная шейка, нарезанная слайсами',                                         price: 5000, weight: '200 г', img: null, badges: ['pork'],        mods: [],                    isPrime: false },
    { id: 'b6', cat: 'bbq', sub: 'Свинина',  name: 'Яннём моксаль',     desc: 'Свиная шейка, нарезанная слайсами в особом соусе',                          price: 5500, weight: '200 г', img: null, badges: ['spicy'],       mods: [],                    isPrime: false },
    { id: 'b7', cat: 'bbq', sub: 'Свинина',  name: 'Самгепсаль',        desc: 'Свиная корейка, нарезанная слайсами',                                       price: 4500, weight: '200 г', img: null, badges: ['pork'],        mods: [],                    isPrime: false },
    { id: 'b8', cat: 'bbq', sub: 'Свинина',  name: 'Яннём самгепсаль',  desc: 'Свиная корейка, нарезанная слайсами в особом соусе',                        price: 5000, weight: '200 г', img: null, badges: ['spicy'],       mods: [],                    isPrime: false },

    // ───────── PRIME BBQ ─────────
    { id: 'p1', cat: 'prime', sub: '', name: 'Кальби',       desc: 'Мраморное говяжье филе, маринованное в грушево-имбирном соусе',         price: 13500, weight: '200 г', img: null, badges: [], mods: [], isPrime: true },
    { id: 'p2', cat: 'prime', sub: '', name: 'L.A. Кальби',  desc: 'Мраморные маринованные во фруктовом соусе говяжьи рёбра',               price: 12000, weight: '300 г', img: null, badges: [], mods: [], isPrime: true },
    { id: 'p3', cat: 'prime', sub: '', name: 'Кальбисаль',   desc: 'Мраморное немаринованное говяжье филе',                                  price: 12000, weight: '200 г', img: null, badges: [], mods: [], isPrime: true },

    // ───────── APPETIZERS ─────────
    {
      id: 'a1', cat: 'appetizers', sub: '', name: 'Покымпаб',
      desc: 'Жареный рис · выберите вариант',
      price: 2300, weight: '', img: null, badges: ['spicy'], isPrime: false,
      mods: [
        {
          id: 'variant', name: 'Вариант', required: true, defaultOption: 'kimchi_cheese',
          options: [
            { id: 'plain',        name: 'Покым паб',               priceAdj: 0   },
            { id: 'kimchi',       name: 'Кимчи покым паб 🌶',      priceAdj: 0   },
            { id: 'kimchi_cheese',name: 'Чиз кимчи покым паб 🌶🧀', priceAdj: 400 }
          ]
        },
        SPICE
      ]
    },
    {
      id: 'a2', cat: 'appetizers', sub: '', name: 'Токпокки',
      desc: 'Рисовые палочки с овощами в остро-сладком соусе кочуджан',
      price: 3500, weight: '', img: null, badges: ['spicy'], isPrime: false,
      mods: [ SPICE, CHEESE(200) ]
    },
    { id: 'a3', cat: 'appetizers', sub: '', name: 'Омрайс',              desc: 'Яичный омлет с начинкой из жареного риса с овощами',                price: 2300, weight: '', img: null, badges: ['new'],         mods: [],              isPrime: false },
    { id: 'a4', cat: 'appetizers', sub: '', name: 'Сеу кирим',           desc: 'Креветки в кляре, в карамельно-сливочном соусе',                    price: 6000, weight: '', img: null, badges: ['new'],         mods: [],              isPrime: false },
    { id: 'a5', cat: 'appetizers', sub: '', name: 'Манду гуи',           desc: 'Жареные корейские пельмени с говядиной',                            price: 3000, weight: '', img: null, badges: [],             mods: [],              isPrime: false },
    { id: 'a6', cat: 'appetizers', sub: '', name: 'Сеу твигим',          desc: 'Креветки в темпуре с соусом васаби',                                price: 6500, weight: '', img: null, badges: [],             mods: [],              isPrime: false },
    { id: 'a7', cat: 'appetizers', sub: '', name: 'Кукуруза с сырным соусом', desc: 'Поджаренные зёрна кукурузы с густым сливочным соусом',          price: 2900, weight: '', img: null, badges: [],             mods: [],              isPrime: false },

    // ───────── KOREAN DISHES ─────────
    { id: 'd1',  cat: 'dishes', sub: '', name: 'Пулькоги тукпеги',    desc: 'Говяжья вырезка, обжаренная с грибами и крахмальной лапшой в соусе терияки. Подаётся с Пабом (рис)',    price: 7000, weight: '', img: null, badges: ['new'],          mods: [],          isPrime: false },
    { id: 'd2',  cat: 'dishes', sub: '', name: 'Джеюк покым',         desc: 'Свинина, жареная с овощами в остром соусе кочудан. Подаётся с Пабом (рис)',                            price: 4500, weight: '', img: null, badges: ['new','spicy'],  mods: [],          isPrime: false },
    { id: 'd3',  cat: 'dishes', sub: '', name: 'Сокоги покым',        desc: 'Говядина, жареная с овощами в остром соусе кочудан. Подаётся с Пабом (рис)',                           price: 6500, weight: '', img: null, badges: ['new','spicy'],  mods: [],          isPrime: false },
    { id: 'd4',  cat: 'dishes', sub: '', name: 'Яннём чиккен',        desc: 'Куриное филе в кляре в традиционном корейском соусе',                                                  price: 4700, weight: '', img: null, badges: ['spicy'],         mods: [],          isPrime: false },
    { id: 'd5',  cat: 'dishes', sub: '', name: 'Яннём одыно',         desc: 'Кальмар в остром соусе',                                                                               price: 6000, weight: '', img: null, badges: ['spicy'],         mods: [],          isPrime: false },
    { id: 'd6',  cat: 'dishes', sub: '', name: 'Чано гуи',            desc: 'Нежный маринованный угорь',                                                                            price: 7000, weight: '', img: null, badges: [],              mods: [],          isPrime: false },
    { id: 'd7',  cat: 'dishes', sub: '', name: 'Сеу покым',           desc: 'Жареные креветки с овощами',                                                                           price: 6000, weight: '', img: null, badges: ['spicy'],         mods: [SPICE],     isPrime: false },
    { id: 'd8',  cat: 'dishes', sub: '', name: 'Пултак покым',        desc: 'Куриное филе в панировке, обжаренное в соусе кочудан вместе с овощами. Подаётся с Пабом (рис)',        price: 4500, weight: '', img: null, badges: ['new','spicy'],  mods: [],          isPrime: false },
    { id: 'd9',  cat: 'dishes', sub: '', name: 'Фрайд чиккен',        desc: 'Острая курица в панировке, подаётся с ореховым соусом',                                               price: 3700, weight: '', img: null, badges: ['new','spicy'],  mods: [],          isPrime: false },
    { id: 'd10', cat: 'dishes', sub: '', name: 'Чиккен Касс',         desc: 'Хрустящая куриная грудка в панировке, подаётся с сырным соусом',                                      price: 3700, weight: '', img: null, badges: ['new'],          mods: [],          isPrime: false },
    { id: 'd11', cat: 'dishes', sub: '', name: 'Чумулек из конины',   desc: 'Конина, маринованная в устричном соусе',                                                               price: 6500, weight: '', img: null, badges: ['new'],          mods: [],          isPrime: false },

    // ───────── RAMEN ─────────
    { id: 'r1', cat: 'ramen', sub: '', name: 'Рамён',                    desc: 'Классический рамён',                                              price: 3000, weight: '', img: null, badges: [],  isPrime: false, mods: [ SPICE, CHEESE(1000) ] },
    { id: 'r2', cat: 'ramen', sub: '', name: 'Рамён с курицей',          desc: '',                                                                price: 3200, weight: '', img: null, badges: [],  isPrime: false, mods: [ SPICE, CHEESE(1000) ] },
    { id: 'r3', cat: 'ramen', sub: '', name: 'Рамён с говядиной',        desc: '',                                                                price: 3500, weight: '', img: null, badges: [],  isPrime: false, mods: [ SPICE, CHEESE(1000) ] },
    { id: 'r5', cat: 'ramen', sub: '', name: 'Рамён с сыром',            desc: 'Классический рамён с плавленым сыром',                            price: 4000, weight: '', img: null, badges: [],  isPrime: false, mods: [ SPICE ] },
    { id: 'r4', cat: 'ramen', sub: '', name: 'Жареный рамён с курицей', desc: 'Лапша с кусочками курицы, грибами и густым сырным соусом',         price: 4000, weight: '', img: null, badges: [],  isPrime: true,  mods: [ SPICE ] },

    // ───────── KIMBAP & BIBIMBAP ─────────
    { id: 'k1', cat: 'kimbap', sub: 'Кимпаб',               name: 'Кимпаб с мясом',      desc: 'Корейские роллы с говядиной и овощами',                               price: 3000, weight: '', img: null, badges: [], mods: [], isPrime: false },
    { id: 'k2', cat: 'kimbap', sub: 'Кимпаб',               name: 'Кимпаб с лососем',    desc: 'Корейские роллы с лососем и овощами',                                 price: 3300, weight: '', img: null, badges: [], mods: [], isPrime: false },
    { id: 'k3', cat: 'kimbap', sub: 'Кимпаб',               name: 'Кимпаб с угрём',      desc: 'Корейские роллы с угрём и овощами',                                   price: 3300, weight: '', img: null, badges: [], mods: [], isPrime: false },
    { id: 'k4', cat: 'kimbap', sub: 'Кимпаб',               name: 'Чиз кимпаб с тунцом', desc: 'Корейские роллы с тунцом и сыром',                                    price: 3500, weight: '', img: null, badges: [], mods: [], isPrime: false },
    { id: 'k5', cat: 'kimbap', sub: 'Пибимпаб (Bibimbap)', name: 'Пибимпаб с мясом',     desc: 'Рис с разнообразными свежими овощами, мясом и соусом кочуджан',        price: 4000, weight: '', img: null, badges: [], mods: [], isPrime: false },
    { id: 'k6', cat: 'kimbap', sub: 'Пибимпаб (Bibimbap)', name: 'Пибимпаб с лососем',   desc: 'Рис с разнообразными свежими овощами, лососем и соусом кочуджан',      price: 4200, weight: '', img: null, badges: [], mods: [], isPrime: false },
    { id: 'k7', cat: 'kimbap', sub: 'Пибимпаб (Bibimbap)', name: 'Пибимпаб с угрём',     desc: 'Рис с разнообразными свежими овощами, угрём и соусом кочуджан',        price: 4200, weight: '', img: null, badges: [], mods: [], isPrime: false },
    { id: 'k8', cat: 'kimbap', sub: 'Пибимпаб (Bibimbap)', name: 'Пибимпаб с тунцом',    desc: 'Рис с разнообразными свежими овощами, тунцом и соусом кочуджан',       price: 4200, weight: '', img: null, badges: [], mods: [], isPrime: false },

    // ───────── SOUPS ─────────
    {
      id: 's1', cat: 'soups', sub: '', name: 'Кальбитан',
      desc: 'Суп из говяжьих рёбрышек. Подаётся с Пабом (рис)',
      price: 3700, weight: '', img: null, badges: [], isPrime: false, mods: []
    },
    {
      id: 's2', cat: 'soups', sub: '', name: 'Кимчи-чигэ',
      desc: 'Суп на основе кимчи с тобу. Подаётся с Пабом (рис)',
      price: 3200, weight: '', img: null, badges: ['spicy'], isPrime: false,
      mods: [
        SPICE,
        {
          id: 'filling', name: 'Мясо', required: true, defaultOption: 'beef',
          options: [
            { id: 'beef', name: 'Говядина', priceAdj: 0   },
            { id: 'pork', name: 'Свинина',  priceAdj: 0   },
            { id: 'tuna', name: 'Тунец',    priceAdj: 500 }
          ]
        }
      ]
    },
    { id: 's3', cat: 'soups', sub: '', name: 'Твенджан чигэ',       desc: 'Суп из соевой пасты с мясом, тобу и овощами. Подаётся с Пабом (рис)',                                            price: 3000, weight: '', img: null, badges: ['spicy'], isPrime: false, mods: [SPICE] },
    { id: 's4', cat: 'soups', sub: '', name: 'Юккеджан',            desc: 'Острый суп из говядины с проросшими бобами, грибами, папоротником и яйцом. Подаётся с Пабом (рис)',             price: 3200, weight: '', img: null, badges: ['spicy'], isPrime: false, mods: [SPICE] },
    { id: 's5', cat: 'soups', sub: '', name: 'Хемуль твенджан чигэ', desc: 'Острый соевый суп из морепродуктов с тобу и овощами. Подаётся с Пабом (рис)',                                  price: 4500, weight: '', img: null, badges: ['spicy'], isPrime: false, mods: [SPICE] },
    { id: 's6', cat: 'soups', sub: '', name: 'Хемультан',           desc: 'Суп с морепродуктами, проросшими бобами и тобу на основе куриного бульона. Подаётся с Пабом (рис)',             price: 4500, weight: '', img: null, badges: [],        isPrime: false, mods: [SPICE] },
    {
      id: 's7', cat: 'soups', sub: '', name: 'Том Ям',
      desc: 'Тайский кисло-острый суп. Подаётся с Пабом (рис)',
      price: 3500, weight: '', img: null, badges: ['new','spicy'], isPrime: false,
      mods: [
        SPICE,
        {
          id: 'type', name: 'Вид', required: true, defaultOption: 'chicken',
          options: [
            { id: 'chicken', name: 'С курицей',        priceAdj: 0    },
            { id: 'seafood', name: 'С морепродуктами', priceAdj: 1000 }
          ]
        }
      ]
    },

    // ───────── NOODLES ─────────
    { id: 'n1', cat: 'noodles', sub: '', name: 'Нэнмён',      desc: 'Гречневая лапша в холодном бульоне с мясом, грушей, дайконом, яйцом, украшается огурцом', price: 4500, weight: '', img: null, badges: [],        mods: [],      isPrime: false },
    { id: 'n2', cat: 'noodles', sub: '', name: 'Пибим нэнмён', desc: 'Холодная гречневая лапша в сладком перечном соусе пибим',                                price: 4500, weight: '', img: null, badges: ['spicy'], mods: [],      isPrime: false },
    { id: 'n3', cat: 'noodles', sub: '', name: 'Чачжанмён',   desc: 'Яичная лапша с мясом, овощами в соевой пасте чачжан',                                    price: 3500, weight: '', img: null, badges: [],        mods: [],      isPrime: false },
    { id: 'n4', cat: 'noodles', sub: '', name: 'Чампон',       desc: 'Яичная лапша с овощами и морепродуктами в остром бульоне',                               price: 4500, weight: '', img: null, badges: ['spicy'], mods: [SPICE], isPrime: false },
    { id: 'n5', cat: 'noodles', sub: '', name: 'Чапчхэ',       desc: 'Фунчоза с мясом и овощами',                                                             price: 3500, weight: '', img: null, badges: [],        mods: [],      isPrime: false },
    { id: 'n6', cat: 'noodles', sub: '', name: 'Куксу',         desc: '',                                                                                       price: 3000, weight: '', img: null, badges: [],        mods: [],      isPrime: false },

    // ───────── KIDS ─────────
    { id: 'c1', cat: 'kids', sub: '', name: 'Детские котлетки с пюре', desc: '', price: 2300, weight: '', img: null, badges: [], mods: [], isPrime: false },
    { id: 'c2', cat: 'kids', sub: '', name: 'Суп лапша',               desc: '', price: 1500, weight: '', img: null, badges: [], mods: [], isPrime: false },
    { id: 'c3', cat: 'kids', sub: '', name: 'Картошка фри',             desc: '', price: 1200, weight: '', img: null, badges: [], mods: [], isPrime: false }
  ],

  /* ── НАСТРОЙКИ ── */
  settings: {
    adminPassword: 'SM2025',
    complimentText: '🥗 В качестве комплимента — безлимитные корейские салаты',
    allergenText: 'Если у вас имеется аллергия на определённые продукты или особые диетические требования, пожалуйста, сообщите вашему официанту перед заказом.\n\nНаши блюда могут содержать: глютен, молоко, яйца, рыбу, морепродукты, соевые бобы, кунжут.'
  }
};
