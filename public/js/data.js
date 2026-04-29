'use strict';

const SPICE = {
  id:'spice', name:'Острота', name_en:'Spice level',
  required:true, defaultOption:'medium',
  options:[
    {id:'mild',   name:'Не острый',   name_en:'Mild',   priceAdj:0},
    {id:'medium', name:'Средний 🌶',  name_en:'Medium 🌶', priceAdj:0},
    {id:'hot',    name:'Острый 🌶🌶', name_en:'Hot 🌶🌶',  priceAdj:0}
  ]
};

const CHEESE = (p) => ({
  id:'cheese', name:'Добавить сыр', name_en:'Add cheese',
  required:false, defaultOption:'no',
  options:[
    {id:'no',  name:'Без сыра',   name_en:'Without cheese', priceAdj:0},
    {id:'yes', name:'С сыром 🧀', name_en:'With cheese 🧀', priceAdj:p}
  ]
});

const DEFAULT_DATA = {

  categories:[
    // ── ЕДА ──
    {id:'bbq',        type:'food', nameShort:'BBQ',    nameShort_en:'BBQ',      name:'Korean BBQ',        name_en:'Korean BBQ',        desc:'Мясо на угольном гриле · Подаётся с гарнирами и соусами', desc_en:'Charcoal grilled meat · Served with side dishes and sauces', order:0},
    {id:'prime',      type:'food', nameShort:'Prime',  nameShort_en:'Prime',    name:'Prime Beef BBQ',    name_en:'Prime Beef BBQ',    desc:'Мраморная говядина · Премиальный выбор',                  desc_en:'Marbled beef · Premium selection',                          order:1},
    {id:'appetizers', type:'food', nameShort:'Закуски',nameShort_en:'Starters', name:'Appetizers',        name_en:'Appetizers',        desc:'Закуски · Снеки · Лёгкие блюда',                          desc_en:'Snacks · Light bites',                                      order:2},
    {id:'dishes',     type:'food', nameShort:'Блюда',  nameShort_en:'Dishes',   name:'Korean Dishes',     name_en:'Korean Dishes',     desc:'Горячие блюда корейской кухни',                           desc_en:'Hot Korean cuisine',                                        order:3},
    {id:'ramen',      type:'food', nameShort:'Рамён',  nameShort_en:'Ramen',    name:'Ramen',             name_en:'Ramen',             desc:'Классический корейский рамён',                            desc_en:'Classic Korean ramen',                                      order:4},
    {id:'kimbap',     type:'food', nameShort:'Кимпаб', nameShort_en:'Kimbap',   name:'Kimbap & Bibimbap', name_en:'Kimbap & Bibimbap', desc:'Корейские роллы и рис с начинками',                       desc_en:'Korean rolls and rice bowls',                               order:5},
    {id:'soups',      type:'food', nameShort:'Супы',   nameShort_en:'Soups',    name:'Soups',             name_en:'Soups',             desc:'Традиционные корейские супы',                             desc_en:'Traditional Korean soups',                                  order:6},
    {id:'noodles',    type:'food', nameShort:'Лапша',  nameShort_en:'Noodles',  name:'Noodles',           name_en:'Noodles',           desc:'Лапша · Горячая и холодная',                              desc_en:'Noodles · Hot and cold',                                    order:7},
    {id:'kids',       type:'food', nameShort:'Детям',  nameShort_en:'Kids',     name:'For Kids',          name_en:'For Kids',          desc:'Детское меню',                                            desc_en:'Children\'s menu',                                          order:8},
    // ── ДЕСЕРТЫ ──
    {id:'desserts',   type:'desserts', nameShort:'Десерты', nameShort_en:'Desserts', name:'Desserts', name_en:'Desserts', desc:'Сладкие завершения вашего ужина', desc_en:'Sweet endings to your meal', order:9},
    // ── БАР ──
    {id:'bar_soft',   type:'bar', nameShort:'Безалк.', nameShort_en:'Soft',     name:'Безалкогольные напитки', name_en:'Soft Drinks',     desc:'', desc_en:'', order:10},
    {id:'bar_coffee', type:'bar', nameShort:'Кофе',    nameShort_en:'Coffee',   name:'Кофе и чай',             name_en:'Coffee & Tea',    desc:'', desc_en:'', order:11},
    {id:'bar_alcohol',type:'bar', nameShort:'Бар',     nameShort_en:'Bar',      name:'Алкогольные напитки',    name_en:'Alcoholic Drinks',desc:'', desc_en:'', order:12}
  ],

  items:[
    // ── BBQ ──
    {id:'b1',cat:'bbq',sub:'Говядина',sub_en:'Beef',name:'Чадольбаги',name_en:'Chadolbaegi',desc:'Тонко нарезанная филейная часть говядины',desc_en:'Thinly sliced beef brisket',price:8000,weight:'200 г',img:null,badges:[],mods:[],isPrime:false},
    {id:'b2',cat:'bbq',sub:'Говядина',sub_en:'Beef',name:'Яннём чадольбаги',name_en:'Yangnyeom Chadolbaegi',desc:'Тонко нарезанная филейная часть говядины в особом соусе',desc_en:'Thinly sliced marinated beef brisket in special sauce',price:8000,weight:'200 г',img:null,badges:['spicy'],mods:[],isPrime:false},
    {id:'b3',cat:'bbq',sub:'Говядина',sub_en:'Beef',name:'Пулькоги',name_en:'Bulgogi',desc:'Маринованная говяжья вырезка в грушево-соевом соусе',desc_en:'Marinated beef tenderloin in pear-soy sauce',price:9000,weight:'250 г',img:null,badges:[],mods:[],isPrime:false},
    {id:'b4',cat:'bbq',sub:'Говядина',sub_en:'Beef',name:'Чумулёк',name_en:'Chumeolleok',desc:'Маринованные говяжьи медальоны в соево-чесночном соусе',desc_en:'Marinated beef medallions in soy-garlic sauce',price:9000,weight:'200 г',img:null,badges:[],mods:[],isPrime:false},
    {id:'b5',cat:'bbq',sub:'Свинина',sub_en:'Pork',name:'Моксаль',name_en:'Moksal',desc:'Свиная шейка, нарезанная слайсами',desc_en:'Sliced pork neck',price:5700,weight:'200 г',img:null,badges:['pork'],mods:[],isPrime:false},
    {id:'b6',cat:'bbq',sub:'Свинина',sub_en:'Pork',name:'Яннём моксаль',name_en:'Yangnyeom Moksal',desc:'Свиная шейка в особом соусе',desc_en:'Marinated pork neck in special sauce',price:6000,weight:'200 г',img:null,badges:['spicy','pork'],mods:[],isPrime:false},
    {id:'b7',cat:'bbq',sub:'Свинина',sub_en:'Pork',name:'Самгепсаль',name_en:'Samgyeopsal',desc:'Свиная корейка, нарезанная слайсами',desc_en:'Sliced pork belly',price:5700,weight:'200 г',img:null,badges:['pork'],mods:[],isPrime:false},
    {id:'b8',cat:'bbq',sub:'Свинина',sub_en:'Pork',name:'Яннём самгепсаль',name_en:'Yangnyeom Samgyeopsal',desc:'Свиная корейка в особом соусе',desc_en:'Marinated pork belly in special sauce',price:5700,weight:'200 г',img:null,badges:['spicy','pork'],mods:[],isPrime:false},
    // ── PRIME ──
    {id:'p1',cat:'prime',sub:'',sub_en:'',name:'Кальби',name_en:'Galbi',desc:'Мраморное говяжье филе, маринованное в грушево-имбирном соусе',desc_en:'Marbled beef fillet marinated in pear-ginger sauce',price:14500,weight:'200 г',img:null,badges:[],mods:[],isPrime:true},
    {id:'p2',cat:'prime',sub:'',sub_en:'',name:'L.A. Кальби',name_en:'L.A. Galbi',desc:'Мраморные маринованные говяжьи рёбра',desc_en:'Marbled marinated beef ribs',price:13500,weight:'300 г',img:null,badges:[],mods:[],isPrime:true},
    {id:'p3',cat:'prime',sub:'',sub_en:'',name:'Кальбисаль',name_en:'Galbissal',desc:'Мраморное немаринованное говяжье филе',desc_en:'Unmarinated marbled beef fillet',price:14000,weight:'200 г',img:null,badges:[],mods:[],isPrime:true},
    // ── APPETIZERS ──
    {id:'a1',cat:'appetizers',sub:'',sub_en:'',name:'Покымпаб',name_en:'Pokkeumbap',desc:'Жареный рис · выберите вариант',desc_en:'Fried rice · choose your variant',price:1700,weight:'',img:null,badges:['spicy'],isPrime:false,mods:[{id:'variant',name:'Вариант',name_en:'Variant',required:true,defaultOption:'kimchi_cheese',options:[{id:'plain',name:'Покым паб',name_en:'Plain fried rice',priceAdj:0},{id:'kimchi',name:'Кимчи покым паб 🌶',name_en:'Kimchi fried rice 🌶',priceAdj:800},{id:'kimchi_cheese',name:'Чиз кимчи покым паб 🌶🧀',name_en:'Cheese kimchi fried rice 🌶🧀',priceAdj:1300}]},SPICE]},
    {id:'a2',cat:'appetizers',sub:'',sub_en:'',name:'Токпокки',name_en:'Tteokbokki',desc:'Рисовые палочки с овощами в остро-сладком соусе кочуджан',desc_en:'Rice cakes with vegetables in sweet-spicy gochujang sauce',price:4000,weight:'',img:null,badges:['spicy'],isPrime:false,mods:[SPICE,CHEESE(500)]},
    {id:'a3',cat:'appetizers',sub:'',sub_en:'',name:'Омрайс',name_en:'Omurice',desc:'Яичный омлет с начинкой из жареного риса с овощами',desc_en:'Egg omelette with fried rice and vegetable filling',price:3000,weight:'',img:null,badges:['new'],mods:[],isPrime:false},
    {id:'a4',cat:'appetizers',sub:'',sub_en:'',name:'Сеу кирим',name_en:'Saewoo Gireum',desc:'Креветки в кляре, в карамельно-сливочном соусе',desc_en:'Battered shrimp in caramel-cream sauce',price:6500,weight:'',img:null,badges:['new'],mods:[],isPrime:false},
    {id:'a5',cat:'appetizers',sub:'',sub_en:'',name:'Манду гуи',name_en:'Mandu Gui',desc:'Жареные корейские пельмени с говядиной',desc_en:'Pan-fried Korean dumplings with beef',price:3700,weight:'',img:null,badges:[],mods:[],isPrime:false},
    {id:'a6',cat:'appetizers',sub:'',sub_en:'',name:'Сеу твигим',name_en:'Saewoo Twigim',desc:'Креветки в темпуре с соусом васаби',desc_en:'Tempura shrimp with wasabi sauce',price:7500,weight:'',img:null,badges:[],mods:[],isPrime:false},
    {id:'a7',cat:'appetizers',sub:'',sub_en:'',name:'Кукуруза с сырным соусом',name_en:'Corn with Cheese Sauce',desc:'Поджаренные зёрна кукурузы с густым сливочным соусом',desc_en:'Roasted corn kernels with rich creamy sauce',price:3500,weight:'',img:null,badges:[],mods:[],isPrime:false},
    // ── DISHES ──
    {id:'d1',cat:'dishes',sub:'',sub_en:'',name:'Пулькоги тукпеги',name_en:'Bulgogi Ttukbaegi',desc:'Говяжья вырезка с грибами и крахмальной лапшой в соусе терияки. Подаётся с Пабом (рис)',desc_en:'Beef tenderloin with mushrooms and glass noodles in teriyaki sauce. Served with steamed rice',price:9000,weight:'',img:null,badges:['new'],mods:[],isPrime:false},
    {id:'d2',cat:'dishes',sub:'',sub_en:'',name:'Джеюк покым',name_en:'Jeyuk Bokkeum',desc:'Свинина, жареная с овощами в остром соусе кочудан. Подаётся с Пабом (рис)',desc_en:'Stir-fried pork with vegetables in spicy gochujang sauce. Served with steamed rice',price:5500,weight:'',img:null,badges:['new','spicy'],mods:[],isPrime:false},
    {id:'d3',cat:'dishes',sub:'',sub_en:'',name:'Сокоги покым',name_en:'Sogogi Bokkeum',desc:'Говядина, жареная с овощами в остром соусе кочудан. Подаётся с Пабом (рис)',desc_en:'Stir-fried beef with vegetables in spicy gochujang sauce. Served with steamed rice',price:7500,weight:'',img:null,badges:['new','spicy'],mods:[],isPrime:false},
    {id:'d4',cat:'dishes',sub:'',sub_en:'',name:'Яннём чиккен',name_en:'Yangnyeom Chicken',desc:'Куриное филе в кляре в традиционном корейском соусе',desc_en:'Battered chicken fillet in traditional Korean sauce',price:4700,weight:'',img:null,badges:['spicy'],mods:[],isPrime:false},
    {id:'d6',cat:'dishes',sub:'',sub_en:'',name:'Чано гуи',name_en:'Jangeo Gui',desc:'Нежный маринованный угорь',desc_en:'Tender marinated eel',price:7000,weight:'',img:null,badges:[],mods:[],isPrime:false},
    {id:'d7',cat:'dishes',sub:'',sub_en:'',name:'Сеу покым',name_en:'Saewoo Bokkeum',desc:'Жареные креветки с овощами',desc_en:'Stir-fried shrimp with vegetables',price:6500,weight:'',img:null,badges:['spicy'],mods:[SPICE],isPrime:false},
    {id:'d8',cat:'dishes',sub:'',sub_en:'',name:'Пултак покым',name_en:'Buldak Bokkeum',desc:'Куриное филе в панировке, обжаренное в соусе кочудан с овощами. Подаётся с Пабом (рис)',desc_en:'Breaded chicken in gochujang sauce with vegetables. Served with steamed rice',price:4500,weight:'',img:null,badges:['new','spicy'],mods:[],isPrime:false},
    {id:'d9',cat:'dishes',sub:'',sub_en:'',name:'Фрайд чиккен',name_en:'Fried Chicken',desc:'Острая курица в панировке, подаётся с ореховым соусом',desc_en:'Spicy breaded chicken with peanut sauce',price:3700,weight:'',img:null,badges:['new','spicy'],mods:[],isPrime:false},
    {id:'d10',cat:'dishes',sub:'',sub_en:'',name:'Чиккен Касс',name_en:'Chicken Katsu',desc:'Хрустящая куриная грудка в панировке, подаётся с сырным соусом',desc_en:'Crispy breaded chicken breast with cheese sauce',price:3700,weight:'',img:null,badges:['new'],mods:[],isPrime:false},
    // ── RAMEN ──
    {id:'r1',cat:'ramen',sub:'',sub_en:'',name:'Рамён',name_en:'Ramen',desc:'Классический рамён',desc_en:'Classic ramen',price:3000,weight:'',img:null,badges:[],isPrime:false,mods:[SPICE,CHEESE(1000)]},
    {id:'r2',cat:'ramen',sub:'',sub_en:'',name:'Рамён с курицей',name_en:'Chicken Ramen',desc:'',desc_en:'',price:3200,weight:'',img:null,badges:[],isPrime:false,mods:[SPICE,CHEESE(1000)]},
    {id:'r3',cat:'ramen',sub:'',sub_en:'',name:'Рамён с говядиной',name_en:'Beef Ramen',desc:'',desc_en:'',price:3500,weight:'',img:null,badges:[],isPrime:false,mods:[SPICE,CHEESE(1000)]},
    {id:'r5',cat:'ramen',sub:'',sub_en:'',name:'Рамён с сыром',name_en:'Cheese Ramen',desc:'Классический рамён с плавленым сыром',desc_en:'Classic ramen with melted cheese',price:4000,weight:'',img:null,badges:[],isPrime:false,mods:[SPICE]},
    {id:'r4',cat:'ramen',sub:'',sub_en:'',name:'Жареный рамён с курицей',name_en:'Fried Chicken Ramen',desc:'Лапша с кусочками курицы, грибами и густым сырным соусом',desc_en:'Noodles with chicken, mushrooms and rich cheese sauce',price:4500,weight:'',img:null,badges:[],isPrime:true,mods:[SPICE]},
    // ── KIMBAP ──
    {id:'k1',cat:'kimbap',sub:'Кимпаб',sub_en:'Kimbap',name:'Кимпаб с мясом',name_en:'Beef Kimbap',desc:'Корейские роллы с говядиной и овощами',desc_en:'Korean rolls with beef and vegetables',price:3500,weight:'',img:null,badges:[],mods:[],isPrime:false},
    {id:'k2',cat:'kimbap',sub:'Кимпаб',sub_en:'Kimbap',name:'Кимпаб с лососем',name_en:'Salmon Kimbap',desc:'Корейские роллы с лососем и овощами',desc_en:'Korean rolls with salmon and vegetables',price:3800,weight:'',img:null,badges:[],mods:[],isPrime:false},
    {id:'k3',cat:'kimbap',sub:'Кимпаб',sub_en:'Kimbap',name:'Кимпаб с угрём',name_en:'Eel Kimbap',desc:'Корейские роллы с угрём и овощами',desc_en:'Korean rolls with eel and vegetables',price:3800,weight:'',img:null,badges:[],mods:[],isPrime:false},
    {id:'k4',cat:'kimbap',sub:'Кимпаб',sub_en:'Kimbap',name:'Чиз кимпаб с тунцом',name_en:'Tuna Cheese Kimbap',desc:'Корейские роллы с тунцом и сыром',desc_en:'Korean rolls with tuna and cheese',price:4000,weight:'',img:null,badges:[],mods:[],isPrime:false},
    {id:'k5',cat:'kimbap',sub:'Пибимпаб',sub_en:'Bibimbap',name:'Пибимпаб с мясом',name_en:'Beef Bibimbap',desc:'Рис с овощами, мясом и соусом кочуджан',desc_en:'Rice with vegetables, beef and gochujang sauce',price:4500,weight:'',img:null,badges:[],mods:[],isPrime:false},
    {id:'k6',cat:'kimbap',sub:'Пибимпаб',sub_en:'Bibimbap',name:'Пибимпаб с лососем',name_en:'Salmon Bibimbap',desc:'Рис с овощами, лососем и соусом кочуджан',desc_en:'Rice with vegetables, salmon and gochujang sauce',price:5000,weight:'',img:null,badges:[],mods:[],isPrime:false},
    {id:'k7',cat:'kimbap',sub:'Пибимпаб',sub_en:'Bibimbap',name:'Пибимпаб с угрём',name_en:'Eel Bibimbap',desc:'Рис с овощами, угрём и соусом кочуджан',desc_en:'Rice with vegetables, eel and gochujang sauce',price:5000,weight:'',img:null,badges:[],mods:[],isPrime:false},
    {id:'k8',cat:'kimbap',sub:'Пибимпаб',sub_en:'Bibimbap',name:'Пибимпаб с тунцом',name_en:'Tuna Bibimbap',desc:'Рис с овощами, тунцом и соусом кочуджан',desc_en:'Rice with vegetables, tuna and gochujang sauce',price:5000,weight:'',img:null,badges:[],mods:[],isPrime:false},
    // ── SOUPS ──
    {id:'s1',cat:'soups',sub:'',sub_en:'',name:'Кальбитан',name_en:'Galbitang',desc:'Суп из говяжьих рёбрышек. Подаётся с Пабом (рис)',desc_en:'Beef rib soup. Served with steamed rice',price:4400,weight:'',img:null,badges:[],isPrime:false,mods:[]},
    {id:'s2',cat:'soups',sub:'',sub_en:'',name:'Кимчи-чигэ',name_en:'Kimchi Jjigae',desc:'Суп на основе кимчи с тобу. Подаётся с Пабом (рис)',desc_en:'Kimchi soup with tofu. Served with steamed rice',price:3500,weight:'',img:null,badges:['spicy'],isPrime:false,mods:[SPICE,{id:'filling',name:'Мясо',name_en:'Protein',required:true,defaultOption:'beef',options:[{id:'beef',name:'Говядина',name_en:'Beef',priceAdj:0},{id:'pork',name:'Свинина',name_en:'Pork',priceAdj:0},{id:'tuna',name:'Тунец',name_en:'Tuna',priceAdj:900}]}]},
    {id:'s3',cat:'soups',sub:'',sub_en:'',name:'Твенджан чигэ',name_en:'Doenjang Jjigae',desc:'Суп из соевой пасты с мясом, тобу и овощами. Подаётся с Пабом (рис)',desc_en:'Soybean paste soup with meat, tofu and vegetables. Served with steamed rice',price:3300,weight:'',img:null,badges:['spicy'],isPrime:false,mods:[SPICE]},
    {id:'s4',cat:'soups',sub:'',sub_en:'',name:'Юккеджан',name_en:'Yukgaejang',desc:'Острый суп из говядины с проросшими бобами, грибами и яйцом. Подаётся с Пабом (рис)',desc_en:'Spicy beef soup with bean sprouts, mushrooms and egg. Served with steamed rice',price:3500,weight:'',img:null,badges:['spicy'],isPrime:false,mods:[SPICE]},
    {id:'s5',cat:'soups',sub:'',sub_en:'',name:'Хемуль твенджан чигэ',name_en:'Haemul Doenjang Jjigae',desc:'Острый соевый суп из морепродуктов с тобу и овощами. Подаётся с Пабом (рис)',desc_en:'Spicy seafood soybean paste soup with tofu and vegetables. Served with steamed rice',price:5500,weight:'',img:null,badges:['spicy'],isPrime:false,mods:[SPICE]},
    {id:'s6',cat:'soups',sub:'',sub_en:'',name:'Хемультан',name_en:'Haemultang',desc:'Суп с морепродуктами на основе куриного бульона. Подаётся с Пабом (рис)',desc_en:'Seafood soup in chicken broth. Served with steamed rice',price:4500,weight:'',img:null,badges:[],isPrime:false,mods:[SPICE]},
    {id:'s7',cat:'soups',sub:'',sub_en:'',name:'Том Ям',name_en:'Tom Yum',desc:'Тайский кисло-острый суп. Подаётся с Пабом (рис)',desc_en:'Thai sour-spicy soup. Served with steamed rice',price:3700,weight:'',img:null,badges:['new','spicy'],isPrime:false,mods:[SPICE,{id:'type',name:'Вид',name_en:'Type',required:true,defaultOption:'chicken',options:[{id:'chicken',name:'С курицей',name_en:'With chicken',priceAdj:0},{id:'seafood',name:'С морепродуктами',name_en:'With seafood',priceAdj:1300}]}]},
    // ── NOODLES ──
    {id:'n1',cat:'noodles',sub:'',sub_en:'',name:'Нэнмён',name_en:'Naengmyeon',desc:'Гречневая лапша в холодном бульоне с мясом, грушей и яйцом',desc_en:'Buckwheat noodles in cold broth with meat, pear and egg',price:5000,weight:'',img:null,badges:[],mods:[],isPrime:false},
    {id:'n3',cat:'noodles',sub:'',sub_en:'',name:'Чачжанмён',name_en:'Jjajangmyeon',desc:'Яичная лапша с мясом и овощами в соевой пасте чачжан',desc_en:'Egg noodles with meat and vegetables in black bean paste',price:4200,weight:'',img:null,badges:[],mods:[],isPrime:false},
    {id:'n4',cat:'noodles',sub:'',sub_en:'',name:'Чампон',name_en:'Jjamppong',desc:'Яичная лапша с овощами и морепродуктами в остром бульоне',desc_en:'Egg noodles with vegetables and seafood in spicy broth',price:5000,weight:'',img:null,badges:['spicy'],mods:[SPICE],isPrime:false},
    {id:'n5',cat:'noodles',sub:'',sub_en:'',name:'Чапчхэ',name_en:'Japchae',desc:'Горячая фунчоза с мясом и овощами',desc_en:'Glass noodles with meat and vegetables',price:3700,weight:'',img:null,badges:[],mods:[],isPrime:false},
    {id:'n6',cat:'noodles',sub:'',sub_en:'',name:'Куксу',name_en:'Guksu',desc:'',desc_en:'',price:3300,weight:'',img:null,badges:[],mods:[],isPrime:false},
    // ── KIDS ──
    {id:'c1',cat:'kids',sub:'',sub_en:'',name:'Детские котлетки с пюре',name_en:'Kids Cutlets with Mash',desc:'',desc_en:'',price:2700,weight:'',img:null,badges:[],mods:[],isPrime:false},
    {id:'c2',cat:'kids',sub:'',sub_en:'',name:'Суп лапша',name_en:'Noodle Soup',desc:'',desc_en:'',price:2000,weight:'',img:null,badges:[],mods:[],isPrime:false},
    {id:'c3',cat:'kids',sub:'',sub_en:'',name:'Картошка фри',name_en:'French Fries',desc:'',desc_en:'',price:1500,weight:'',img:null,badges:[],mods:[],isPrime:false},
    // ── DESSERTS ──
    {id:'ds1',cat:'desserts',sub:'',sub_en:'',name:'Хотток',name_en:'Hotteok',desc:'Корейский сладкий блин с начинкой из коричневого сахара и орехов',desc_en:'Korean sweet pancake filled with brown sugar and nuts',price:1500,weight:'',img:null,badges:[],mods:[],isPrime:false},
    {id:'ds2',cat:'desserts',sub:'',sub_en:'',name:'Бинсу',name_en:'Bingsu',desc:'Корейский десерт из тёртого льда с красной фасолью и сиропом',desc_en:'Korean shaved ice dessert with red beans and syrup',price:2500,weight:'',img:null,badges:[],mods:[],isPrime:false},
    // ── BAR: SOFT ──
    {id:'br1',cat:'bar_soft',sub:'',sub_en:'',name:'Кола / Спрайт / Фанта',name_en:'Cola / Sprite / Fanta',desc:'',desc_en:'',price:700,weight:'330 мл',img:null,badges:[],mods:[],isPrime:false},
    {id:'br2',cat:'bar_soft',sub:'',sub_en:'',name:'Сок апельсиновый',name_en:'Orange Juice',desc:'',desc_en:'',price:900,weight:'200 мл',img:null,badges:[],mods:[],isPrime:false},
    {id:'br3',cat:'bar_soft',sub:'',sub_en:'',name:'Вода минеральная',name_en:'Mineral Water',desc:'',desc_en:'',price:500,weight:'500 мл',img:null,badges:[],mods:[],isPrime:false},
    // ── BAR: COFFEE ──
    {id:'bc1',cat:'bar_coffee',sub:'',sub_en:'',name:'Эспрессо',name_en:'Espresso',desc:'',desc_en:'',price:800,weight:'30 мл',img:null,badges:[],mods:[],isPrime:false},
    {id:'bc2',cat:'bar_coffee',sub:'',sub_en:'',name:'Американо',name_en:'Americano',desc:'',desc_en:'',price:1000,weight:'200 мл',img:null,badges:[],mods:[],isPrime:false},
    {id:'bc3',cat:'bar_coffee',sub:'',sub_en:'',name:'Латте',name_en:'Latte',desc:'',desc_en:'',price:1200,weight:'300 мл',img:null,badges:[],mods:[],isPrime:false},
    {id:'bc4',cat:'bar_coffee',sub:'',sub_en:'',name:'Зелёный чай',name_en:'Green Tea',desc:'',desc_en:'',price:900,weight:'400 мл',img:null,badges:[],mods:[],isPrime:false},
    // ── BAR: ALCOHOL ──
    {id:'ba1',cat:'bar_alcohol',sub:'Пиво',sub_en:'Beer',name:'Hite (Корея)',name_en:'Hite (Korea)',desc:'',desc_en:'',price:2500,weight:'500 мл',img:null,badges:[],mods:[],isPrime:false},
    {id:'ba2',cat:'bar_alcohol',sub:'Пиво',sub_en:'Beer',name:'Cass (Корея)',name_en:'Cass (Korea)',desc:'',desc_en:'',price:2500,weight:'500 мл',img:null,badges:[],mods:[],isPrime:false},
    {id:'ba3',cat:'bar_alcohol',sub:'Соджу',sub_en:'Soju',name:'Чамисуль',name_en:'Chamisul',desc:'Классическое корейское соджу',desc_en:'Classic Korean soju',price:3500,weight:'360 мл',img:null,badges:[],mods:[],isPrime:false},
    {id:'ba4',cat:'bar_alcohol',sub:'Соджу',sub_en:'Soju',name:'Сонбури Соджу',name_en:'Sunbury Soju',desc:'Фруктовый соджу',desc_en:'Fruit soju',price:3500,weight:'360 мл',img:null,badges:[],mods:[],isPrime:false},
    {id:'ba5',cat:'bar_alcohol',sub:'Вино',sub_en:'Wine',name:'Вино красное / белое',name_en:'Red / White Wine',desc:'',desc_en:'',price:2000,weight:'150 мл',img:null,badges:[],mods:[],isPrime:false}
  ],

  settings:{
    adminPassword: 'SM2025',
    complimentText: '🥗 В качестве комплимента — безлимитные корейские салаты',
    complimentText_en: '🥗 Complimentary unlimited Korean side dishes',
    allergenText: 'Если у вас имеется аллергия на определённые продукты или особые диетические требования, пожалуйста, сообщите вашему официанту перед заказом.\n\nНаши блюда могут содержать: глютен, молоко, яйца, рыбу, морепродукты, соевые бобы, кунжут.',
    allergenText_en: 'If you have any food allergies or special dietary requirements, please inform your waiter before ordering.\n\nOur dishes may contain: gluten, milk, eggs, fish, shellfish, soybeans, sesame.',
    workingHours: '12:00 – 00:00',
    workingHours_en: '12:00 – 00:00'
  }
};
