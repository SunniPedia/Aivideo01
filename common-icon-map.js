/* DATA ONLY: meaning keywords per icon. Format: icon: [english keywords, keywords of another language]; '|' separates keywords.
   Add a language by adding a table PV.iconWords.<lang>. Matching is substring, case-insensitive. */
(function () {
  var PV = window.PV;
  var EN = {
    crescent: 'crescent|hilal|ramadan|eid|islam|islamic', mosque: 'mosque|masjid|prayer|namaz|salah|jamaat', dome: 'dome|green dome|madinah|medina|rawza|nabawi',
    minaret: 'minaret|tower|azan|adhan|call to prayer|muezzin', 'cube-shrine': 'kaaba|cube|makkah|mecca|hajj|umrah|haramain', compass: 'compass|qibla|kibla|direction|navigate|bearing',
    'prayer-beads': 'tasbih|beads|dhikr|zikr|rosary|tally', clock: 'clock|time|hour|schedule|timing|watch|sehri|iftar', sun: 'sun|day|morning|fajr|dawn|sunrise',
    moon: 'moon|night|lunar|full moon|evening|isha', lantern: 'lantern|light|lamp|noor|illuminate|glow', star8: 'star|ornament|decor|pattern|geometry|art',
    floral: 'flower|floral|bloom|garden|rose|blossom', diamond: 'diamond|gem|jewel|precious|valuable|treasure', knot: 'knot|weave|unity|together|bond|tie',
    book: 'book|kitab|title|volume|publication|literature', 'open-book': 'read|reading|quran|study|learn|recite', 'library-shelf': 'library|collection|shelf|archive|encyclopedia|volumes',
    scroll: 'scroll|hadith|narration|manuscript|tradition|sunnah', pen: 'write|writer|author|pen|compose|edit', magnifier: 'search|find|look|explore|seek|discover',
    phone: 'phone|mobile|app|android|smartphone|device', 'download-arrow': 'download|install|get|save|fetch|offline', globe: 'world|global|online|web|internet|international',
    heart: 'love|heart|care|favorite|passion|mercy', 'open-hand': 'dua|pray|supplication|give|offer|opportunity', microphone: 'microphone|speech|speaker|lecture|bayan|sermon',
    headphones: 'audio|listen|hear|naat|nasheed|podcast', speaker: 'broadcast|sound|live|stream|voice|announce', 'play-arrow': 'play|start|begin|watch|run|launch',
    'video-frame': 'video|film|movie|clip|screen|visual', document: 'document|file|pdf|paper|text|page', list: 'list|items|index|contents|catalog|menu',
    grid: 'grid|category|categories|sections|organized|arranged', bookmark: 'bookmark|mark|remember|note|saved|pinned', 'name-tag': 'name|names|identity|badge|label|called',
    'map-pin': 'location|place|nearby|map|address|locate', shield: 'protect|safe|secure|guard|trust|authentic', 'ring-check': 'verified|correct|accurate|check|approved|valid',
    lightbulb: 'idea|knowledge|wisdom|insight|think|understand', gear: 'settings|setting|configure|system|option|preferences', bell: 'notification|alert|remind|reminder|alarm|notice',
    calendar: 'calendar|date|month|year|hijri|schedule', 'bar-chart': 'statistics|stats|chart|count|total|number', share: 'share|send|spread|pass on|invite|tell',
    link: 'link|connect|url|join|related|reference', house: 'home|house|family|household|main|domestic', key: 'key|access|unlock|secret|password|solution',
    leaf: 'leaf|nature|green|plant|fresh|organic', 'water-drop': 'water|drop|zamzam|wudu|rain|pure', flame: 'fire|flame|hot|energy|burn|heat',
    tree: 'tree|forest|growth|roots|wood|branch', mountain: 'mountain|hill|peak|summit|height|journey', cloud: 'cloud|sky|weather|storage|sync|backup',
    wifi: 'wifi|wireless|network|signal|connection|connected', battery: 'battery|power|charge|saving|low power|capacity', lock: 'lock|private|privacy|protected|password|locked',
    envelope: 'email|mail|letter|message|contact|inbox', 'chat-bubble': 'chat|talk|comment|discussion|question|reply', camera: 'camera|photo|picture|image|capture|snapshot',
    'music-note': 'music|melody|song|tune|rhythm|tone', cart: 'cart|shop|buy|store|market|order', wallet: 'wallet|money|payment|pay|cash|finance',
    coin: 'coin|charity|zakat|sadaqah|donation|price', trophy: 'trophy|win|winner|champion|best|achievement', medal: 'medal|award|honor|reward|prize|merit',
    'graduation-cap': 'education|school|student|course|scholar|academy', rocket: 'rocket|fast|speed|boost|quick|takeoff', wrench: 'tool|repair|fix|maintenance|utility|build',
    truck: 'delivery|transport|ship|cargo|truck|move', building: 'building|office|institution|organization|city|company', 'plus-badge': 'more|add|extra|plus|new|additional',
    'line-chart': 'trend|progress|increase|graph|analytics|growth chart', target: 'goal|target|aim|mission|focus|purpose', puzzle: 'puzzle|solution|piece|game|challenge|quiz',
    clipboard: 'clipboard|task|checklist|plan|report|form', folder: 'folder|directory|files|archive|binder|group', 'qr-code': 'qr|scan|barcode|code|scanner|tag', hourglass: 'wait|waiting|hourglass|deadline|duration|countdown'
  };
  var BN = {
    crescent: 'চাঁদ|হিলাল|রমজান|রমযান|ঈদ|ইসলাম', mosque: 'মসজিদ|নামাজ|নামায|সালাত|জামাত|ইবাদত', dome: 'গম্বুজ|মদিনা|মদীনা|রওজা|নববী|সবুজ',
    minaret: 'মিনার|আজান|আযান|মুয়াজ্জিন|মুআযযিন|আজানের', 'cube-shrine': 'কাবা|মক্কা|হজ|হজ্জ|ওমরা|হারামাইন', compass: 'কিবলা|কম্পাস|দিক|ক্বিবলা|দিশা|কিবলার',
    'prayer-beads': 'তাসবিহ|তাসবীহ|যিকির|জিকির|তসবি|গণনা', clock: 'ঘড়ি|সময়|ঘণ্টা|সেহরি|ইফতার|সূচি', sun: 'সূর্য|দিন|সকাল|ফজর|ভোর|সুবহে',
    moon: 'রাত|চন্দ্র|পূর্ণিমা|এশা|সন্ধ্যা|তারা', lantern: 'আলো|নূর|বাতি|প্রদীপ|আলোকিত|জ্যোতি', star8: 'তারা|নকশা|অলংকার|শোভা|সজ্জা|জ্যামিতি',
    floral: 'ফুল|গোলাপ|বাগান|পুষ্প|ফুলের|কুসুম', diamond: 'হীরা|মণি|রত্ন|মূল্যবান|গুপ্তধন|মুক্তা', knot: 'গিঁট|বন্ধন|ঐক্য|একতা|একসাথে|সংযুক্ত',
    book: 'বই|কিতাব|গ্রন্থ|পুস্তক|পিডিএফ|সাহিত্য', 'open-book': 'পড়|কুরআন|কোরআন|পাঠ|শিক্ষা|অধ্যয়ন', 'library-shelf': 'গ্রন্থাগার|সংগ্রহ|বিশ্বকোষ|লাইব্রেরি|সমগ্র|সংকলন',
    scroll: 'হাদিস|হাদীস|সুন্নাহ|বর্ণনা|পাণ্ডুলিপি|রেওয়ায়েত', pen: 'লেখক|লেখা|কলম|রচনা|সম্পাদনা|লিখ', magnifier: 'খুঁজি|খুঁজ|অনুসন্ধান|সন্ধান|আবিষ্কার|অন্বেষণ',
    phone: 'ফোন|মোবাইল|অ্যাপ|এন্ড্রয়েড|স্মার্টফোন|ডিভাইস', 'download-arrow': 'ইনস্টল|ডাউনলোড|অফলাইন|সংরক্ষণ|নামান|নামিয়ে', globe: 'বিশ্ব|অনলাইন|ওয়েব|ইন্টারনেট|আন্তর্জাতিক|পৃথিবী',
    heart: 'ভালোবাসা|হৃদয়|প্রিয়|রহমত|দয়া|মায়া', 'open-hand': 'দোয়া|মুনাজাত|দান|প্রার্থনা|সুযোগ|মাসনুন', microphone: 'বয়ান|বক্তা|ওয়াজ|বক্তৃতা|মাইক|খুতবা',
    headphones: 'নাত|নাশিদ|শুনুন|শোনা|অডিও|হামদ', speaker: 'সম্প্রচার|শব্দ|লাইভ|ধ্বনি|প্রচার|আওয়াজ', 'play-arrow': 'প্লে|শুরু|চালু|চালান|দেখুন|প্রদর্শন',
    'video-frame': 'ভিডিও|চলচ্চিত্র|দৃশ্য|পর্দা|ক্লিপ|ফিল্ম', document: 'নথি|ফাইল|কাগজ|পৃষ্ঠা|দলিল|ডকুমেন্ট', list: 'তালিকা|সূচিপত্র|ক্রম|সারি|বিষয়ভিত্তিক|বিষয়',
    grid: 'বিভাগ|শ্রেণি|সাজানো|সুবিন্যস্ত|ছক|শ্রেণী', bookmark: 'বুকমার্ক|চিহ্নিত|স্মরণ|নোট|সংরক্ষিত|পছন্দ', 'name-tag': 'নাম|নামসমূহ|পরিচয়|উপাধি|আসমা|নামকরণ',
    'map-pin': 'অবস্থান|স্থান|ঠিকানা|মানচিত্র|কাছাকাছি|জায়গা', shield: 'সুরক্ষা|নিরাপদ|বিশুদ্ধ|নির্ভরযোগ্য|সহীহ|প্রামাণ্য', 'ring-check': 'সঠিক|যাচাই|নির্ভুল|অনুমোদিত|বৈধ|সত্যায়িত',
    lightbulb: 'জ্ঞান|ইলম|ইলমে|প্রজ্ঞা|বুদ্ধি|উপলব্ধি', gear: 'সেটিংস|ব্যবস্থা|যন্ত্র|কনফিগার|অপশন|সিস্টেম', bell: 'নোটিফিকেশন|স্মারক|সতর্ক|অ্যালার্ম|বিজ্ঞপ্তি|ঘণ্টা',
    calendar: 'ক্যালেন্ডার|তারিখ|মাস|বছর|হিজরি|পঞ্জিকা', 'bar-chart': 'পরিসংখ্যান|সংখ্যা|মোট|হিসাব|চার্ট|গণনা', share: 'শেয়ার|ছড়ান|পাঠান|অন্যকে|বিতরণ|প্রচার',
    link: 'লিংক|সংযোগ|যুক্ত|সম্পর্কিত|রেফারেন্স|সূত্র', house: 'ঘর|বাড়ি|পরিবার|গৃহ|হোম|বাসা', key: 'চাবি|চাবিকাঠি|প্রবেশ|গোপন|পাসওয়ার্ড|সমাধান',
    leaf: 'পাতা|প্রকৃতি|সবুজ|উদ্ভিদ|সতেজ|তাজা', 'water-drop': 'পানি|জল|জমজম|অজু|ওযু|বৃষ্টি', flame: 'আগুন|শিখা|উত্তাপ|শক্তি|জ্বলন্ত|অগ্নি',
    tree: 'গাছ|বৃক্ষ|বন|বৃদ্ধি|শিকড়|ডালপালা', mountain: 'পাহাড়|পর্বত|চূড়া|উচ্চতা|সফর|যাত্রা', cloud: 'মেঘ|আকাশ|আবহাওয়া|ক্লাউড|ব্যাকআপ|সিঙ্ক',
    wifi: 'ওয়াইফাই|নেটওয়ার্ক|সিগন্যাল|সংযোগ|সংযুক্ত|তারহীন', battery: 'ব্যাটারি|চার্জ|বিদ্যুৎ|ক্ষমতা|পাওয়ার|সাশ্রয়', lock: 'তালা|গোপনীয়|নিরাপত্তা|বন্ধ|সুরক্ষিত|লক',
    envelope: 'ইমেইল|চিঠি|মেইল|বার্তা|যোগাযোগ|ডাক', 'chat-bubble': 'আলোচনা|কথা|মন্তব্য|প্রশ্ন|উত্তর|চ্যাট', camera: 'ক্যামেরা|ছবি|ফটো|চিত্র|তোলা|আলোকচিত্র',
    'music-note': 'সুর|গান|সঙ্গীত|সংগীত|ছন্দ|তাল', cart: 'কেনা|দোকান|বাজার|কার্ট|ক্রয়|অর্ডার', wallet: 'টাকা|অর্থ|পেমেন্ট|ওয়ালেট|আর্থিক|খরচ',
    coin: 'যাকাত|সদকা|মুদ্রা|সাদাকা|অনুদান|দাম', trophy: 'ট্রফি|বিজয়|সেরা|চ্যাম্পিয়ন|জয়|অর্জন', medal: 'পদক|পুরস্কার|সম্মান|মর্যাদা|সনদ|স্বীকৃতি',
    'graduation-cap': 'শিক্ষার্থী|বিদ্যালয়|মাদ্রাসা|আলেম|ছাত্র|কোর্স', rocket: 'গতি|দ্রুত|রকেট|উন্নতি|বেগ|উৎক্ষেপণ', wrench: 'সরঞ্জাম|মেরামত|টুল|রক্ষণাবেক্ষণ|যন্ত্রপাতি|বানান',
    truck: 'ডেলিভারি|পরিবহন|ট্রাক|মালামাল|বহন|সরবরাহ', building: 'ভবন|প্রতিষ্ঠান|অফিস|সংস্থা|শহর|কোম্পানি', 'plus-badge': 'আরও|আরো|অতিরিক্ত|যোগ|নতুন|সংযোজন',
    'line-chart': 'প্রবৃদ্ধি|অগ্রগতি|বৃদ্ধি|গ্রাফ|ট্রেন্ড|বিশ্লেষণ', target: 'লক্ষ্য|উদ্দেশ্য|টার্গেট|মিশন|মনোযোগ|উদ্দেশ', puzzle: 'ধাঁধা|খেলা|কুইজ|চ্যালেঞ্জ|প্রশ্নোত্তর|পাজল',
    clipboard: 'কাজ|পরিকল্পনা|প্রতিবেদন|ফর্ম|চেকলিস্ট|কার্যক্রম', folder: 'ফোল্ডার|নথিপত্র|আর্কাইভ|ডিরেক্টরি|ধরন|সংগ্রহশালা', 'qr-code': 'কিউআর|স্ক্যান|বারকোড|কোড|স্ক্যানার|সংকেত',
    hourglass: 'অপেক্ষা|সময়সীমা|মেয়াদ|কাউন্টডাউন|বিলম্ব|ক্ষণ'
  };
  function split(o) { var r = {}; Object.keys(o).forEach(function (k) { r[k] = o[k].split('|'); }); return r; }
  PV.iconWords = { en: split(EN), bn: split(BN) };
  /* sensitive contexts: only neutral icons (symbols, books, ornaments, shapes) */
  PV.iconNeutral = ['crescent', 'mosque', 'dome', 'minaret', 'cube-shrine', 'compass', 'prayer-beads', 'clock', 'sun', 'moon', 'lantern', 'star8', 'floral', 'diamond', 'knot', 'book', 'open-book',
    'library-shelf', 'scroll', 'pen', 'magnifier', 'phone', 'download-arrow', 'globe', 'open-hand', 'microphone', 'headphones', 'speaker', 'document', 'list', 'grid', 'bookmark', 'name-tag', 'map-pin',
    'shield', 'ring-check', 'lightbulb', 'calendar', 'share', 'link', 'leaf', 'water-drop', 'tree', 'mountain', 'cloud', 'building', 'plus-badge', 'target', 'folder', 'hourglass', 'bell', 'heart', 'video-frame', 'play-arrow', 'graduation-cap', 'trophy', 'medal', 'bar-chart', 'line-chart', 'gear'];
})();
