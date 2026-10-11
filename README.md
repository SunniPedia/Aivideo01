# ইসলামী বিশ্বকোষ ও আল হাদিস S2 — ভিডিও রিপোজিটরি

এই রিপোজিটরিতে বাংলা প্রচারমূলক ভিডিও রেন্ডার করার জন্য দুটি থিম আছে: 9:16 infographic এবং 16:9 podcast/studio। ভিডিও GitHub Actions-এ তৈরি হবে; Android ফোনে স্থানীয়ভাবে Node, Chromium বা FFmpeg ইনস্টল করার প্রয়োজন নেই।

## ফোন থেকে চালানোর নিয়ম
1. GitHub-এ নতুন repository তৈরি করুন।
2. ZIP extract করে সব root ফাইল এক বা একাধিক batch-এ আপলোড করুন। ফাইলগুলো main/root folder-এ রাখবেন।
3. `.github/workflows/render.yml` ফাইলটি ঠিক এই path-এ থাকতে হবে। GitHub-এর Add file → Create new file-এ সম্পূর্ণ path লিখে তৈরি করা যায়।
4. Actions → Render Video → Run workflow খুলুন। প্রথমে `preview`, তারপর চূড়ান্ত আউটপুটের জন্য `full` বেছে নিন। `both` দিলে দুই থিমই রেন্ডার হবে।
5. সফল workflow-এর `video` artifact ডাউনলোড করুন।

## ফাইল ম্যাপ
- `index-infographic.html`, `a-layout.css`, `a-main.js`, `a-logo-motion.js`: উল্লম্ব থিম।
- `index-podcast.html`, `b-layout.css`, `b-main.js`, `b-studio.js`, `b-host-config.js`, `b-host-svg.js`, `b-host-anim.js`, `b-logo-motion.js`: ল্যান্ডস্কেপ থিম ও হোস্ট-সংক্রান্ত ফাইল।
- `common-*.js`, `common-tokens.css`: shared parsing/style helpers।
- `tool-*.js`, `render.js`: environment, asset detection, render, validation and duration tests।
- `timestamps.txt`: ১৬টি বাংলা দৃশ্যের মূল টেক্সট ও টাইমিং।
- `project.json`: brand, language, palette, fonts and host configuration।
- `scenes.json`: timestamp লাইনের সঙ্গে যুক্ত scene metadata।
- `audio.mp3`, `logo.png`, `google-play-badge.png`: আপনার সরবরাহ করা assets।
- `.github/workflows/render.yml`: একমাত্র প্রয়োজনীয় subfolder path।

## বর্তমান ডিটেকশন
| ক্ষেত্র | ব্যবহৃত মান | উৎস |
|---|---|---|
| Theme | BOTH | master prompt default |
| Brand | ইসলামী বিশ্বকোষ ও আল হাদিস S2 | লোগো ও timestamp text |
| Language | Bengali | timestamps.txt |
| Direction | LTR (Bengali) | project setting |
| Digits/grouping | Bengali / lakh grouping | project setting |
| Palette | deep green, green, gold, cream | logo-inspired project setting |
| Font | SolaimanLipi with Noto Serif fallback | project setting/workflow |
| Store badge | Google Play official supplied image | uploaded asset |
| Audio | audio.mp3, 56.640 s | uploaded file / ffprobe |
| End pad | 2.0 s | project/workflow default |

## দৈর্ঘ্য
অডিও 56.640 সেকেন্ড, শেষ timestamp 56.000 সেকেন্ড। 2 সেকেন্ড tail হলে নির্ধারিত মোট দৈর্ঘ্য 58.640 সেকেন্ড। Renderer video frame-গুলো encode করে পরে অডিও একবার mux করে, এবং ভিডিওর দৈর্ঘ্য পর্যন্ত নীরবতা pad করে। START/END ব্যবহার করলে আংশিক render তৈরি হয়।

## পরবর্তী ভিডিও তৈরি
`timestamps.txt` ও root-এর assets বদলান। `project.json`-এ brand/language/colors/fonts আপডেট করুন। `scenes.json` বর্তমান text-এর সঙ্গে মিলিয়ে আপডেট করুন বা `{}` দিয়ে runtime classification ব্যবহার করুন।

## যাচাইয়ের সীমা ও আইকন নোট
`tool-check-repo.js` JavaScript syntax, JSON এবং প্রয়োজনীয় ফাইলের উপস্থিতি পরীক্ষা করে; `tool-test-duration.js` duration math পরীক্ষা করে। GitHub Actions-এ সফল render, চূড়ান্ত ফ্রেমের visual QA, পূর্ণ phoneme lip-sync, সম্পূর্ণ 79-icon unique SVG library এবং প্রতিটি universal test এই প্যাকেজে যাচাইকৃত বলে দাবি করা হচ্ছে না। বর্তমান থিমে কয়েকটি মৌলিক নিজস্ব SVG motif/feature icon, decorative ornaments এবং reactive equalizer আছে; Google Play badge আপনার দেওয়া অফিসিয়াল ছবিই। Presenter-এর পূর্ণ professional animation এখনো আলাদা visual QA প্রয়োজন করে।

## Troubleshooting
- Bengali glyph box বা ভুল font হলে `SolaimanLipi-Regular.ttf` root-এ upload করুন।
- `page.evaluate`/network error হলে GitHub Actions log-এ page error দেখুন; render-time assets সব local relative paths-এ থাকা উচিত। Workflow কেবল font download step-এ network ব্যবহার করে।
- 25 MB-এর বেশি ফাইল GitHub web UI-তে সরাসরি upload সীমায় পড়তে পারে; এই project-এর audio ছোট, তবে বড় assets-এর জন্য GitHub-এর supported upload method ব্যবহার করুন।
