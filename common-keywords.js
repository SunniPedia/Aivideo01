/* DATA ONLY: greeting, store, closing and list-separator words per language */
(function () {
  var PV = window.PV, K = PV.kw = {};
  K.greeting = {
    bn: [['আসসালামু আলাইকুম', 1], ['আস সালামু আলাইকুম', 1], ['আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহ', 1, 'full'], ['আসসালামু আলাইকুম ওয়া রহমাতুল্লাহ', 1, 'full'], ['নমস্কার', 0], ['স্বাগতম', 0], ['শুভ সকাল', 0], ['শুভ সন্ধ্যা', 0], ['হ্যালো', 0], ['সালাম', 1]],
    en: [['assalamu alaikum', 1], ['assalamualaikum', 1], ['as salamu alaykum', 1], ['salam', 1], ['hello', 0], ['hi', 0], ['hey', 0], ['hi everyone', 0], ['welcome', 0], ['good morning', 0], ['good evening', 0], ['greetings', 0]],
    ar: [['السلام عليكم', 1], ['السلام عليكم ورحمة الله', 1, 'full'], ['مرحبا', 0], ['أهلا', 0], ['اهلا وسهلا', 0], ['صباح الخير', 0]],
    ur: [['السلام علیکم', 1], ['اسلام علیکم', 1], ['السلام علیکم ورحمۃ اللہ', 1, 'full'], ['آداب', 0], ['خوش آمدید', 0]],
    fa: [['سلام', 0], ['درود', 0], ['السلام علیکم', 1], ['خوش آمدید', 0]],
    hi: [['नमस्ते', 0], ['नमस्कार', 0], ['स्वागत है', 0], ['सुप्रभात', 0], ['अस्सलामु अलैकुम', 1], ['हैलो', 0]],
    es: [['hola', 0], ['bienvenidos', 0], ['buenos días', 0], ['buenas tardes', 0], ['saludos', 0]],
    fr: [['bonjour', 0], ['salut', 0], ['bienvenue', 0], ['bonsoir', 0]],
    de: [['hallo', 0], ['guten tag', 0], ['willkommen', 0], ['guten morgen', 0]],
    id: [['halo', 0], ['selamat datang', 0], ['selamat pagi', 0], ['assalamualaikum', 1]],
    tr: [['merhaba', 0], ['selam', 0], ['hoş geldiniz', 0], ['selamünaleyküm', 1]],
    pt: [['olá', 0], ['bem-vindos', 0], ['bom dia', 0]],
    ru: [['привет', 0], ['здравствуйте', 0], ['добро пожаловать', 0]]
  };
  K.salaamAr = { base: '\u0627\u0644\u0633\u0644\u0627\u0645 \u0639\u0644\u064A\u0643\u0645', full: '\u0627\u0644\u0633\u0644\u0627\u0645 \u0639\u0644\u064A\u0643\u0645 \u0648\u0631\u062D\u0645\u0629 \u0627\u0644\u0644\u0647' };
  K.storeNames = {
    bn: ['প্লে স্টোর', 'প্লে-স্টোর', 'অ্যাপ স্টোর', 'গুগল প্লে', 'প্লেস্টোর'],
    en: ['play store', 'app store', 'google play', 'appstore'],
    ar: ['متجر جوجل بلاي', 'جوجل بلاي', 'آب ستور', 'متجر التطبيقات'], ur: ['پلے اسٹور', 'ایپ اسٹور', 'گوگل پلے'],
    hi: ['प्ले स्टोर', 'ऐप स्टोर', 'गूगल प्ले'], es: ['play store', 'app store', 'google play', 'tienda de aplicaciones'],
    fr: ['play store', 'app store', 'google play'], de: ['play store', 'app store', 'google play'], id: ['play store', 'app store', 'google play'],
    tr: ['play store', 'app store', 'google play'], pt: ['play store', 'app store', 'google play'], ru: ['play market', 'app store', 'google play']
  };
  K.installVerbs = {
    bn: ['ইনস্টল', 'ডাউনলোড'], en: ['install', 'download', 'get the app'], ar: ['ثبّت', 'حمّل', 'نزّل'], ur: ['انسٹال', 'ڈاؤن لوڈ'], hi: ['इंस्टॉल', 'डाउनलोड'],
    es: ['instala', 'descarga'], fr: ['installez', 'téléchargez'], de: ['installiere', 'lade'], id: ['instal', 'unduh'], tr: ['indir', 'yükle'], pt: ['instale', 'baixe'], ru: ['установите', 'скачайте']
  };
  K.separators = '\u002C\u060C\u3001\uFF0C\u003B\u061B\uFF1B';
  K.conjunctions = {
    bn: ['ও', 'এবং', 'আর'], en: ['and', '&'], hi: ['और', 'तथा'], ur: ['اور', 'و'], ar: ['و', 'وكذلك'], fa: ['و'], es: ['y', 'e'], fr: ['et'], de: ['und'], id: ['dan'], tr: ['ve'], pt: ['e'], ru: ['и']
  };
  K.norm = function (s) {
    return String(s).normalize('NFC').replace(/[\u200B-\u200D\uFEFF]/g, '').toLowerCase().replace(/[\p{P}\p{S}]/gu, ' ').replace(/\s+/g, ' ').trim();
  };
})();
