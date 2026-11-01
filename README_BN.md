# RailTrack BD v3 — Web + Android GPS prototype

এই সংস্করণে দুই ধরনের লোকেশন রাখা হয়েছে:

1. **যাত্রীর নিজের ফোনের লোকেশন:** “আমার লোকেশন দেখাও” চাপলে নিজের ফোনের অবস্থান শুধু নিজের ম্যাপে দেখা যাবে। এটি সার্ভারে বা অন্য ব্যবহারকারীর কাছে পাঠানো হয় না। বন্ধ করতে “আমার লোকেশন বন্ধ” চাপুন।
2. **ট্রেনের শেয়ার করা GPS:** ট্রেনের ভেতরে থাকা অনুমতিপ্রাপ্ত একটি ফোনে অ্যাপ খুলে ট্রেন নির্বাচন, অ্যাডমিনের দেওয়া share key লিখে “ট্রেন GPS শেয়ার শুরু” চাপতে হবে। তখন ফোনটির GPS নির্দিষ্ট ট্রেনের নামে সার্ভারে যাবে এবং অন্য দর্শকরা ম্যাপে দেখতে পারবেন। “শেয়ার বন্ধ” চাপলে শেয়ার বন্ধ হবে।

## গুরুত্বপূর্ণ সীমাবদ্ধতা
- এই প্রজেক্ট বাংলাদেশ রেলওয়ের অফিসিয়াল GPS/API-তে সংযুক্ত নয়।
- কোনো ট্রেনের ভেতরে GPS-শেয়ারিং ফোন না থাকলে সেই ট্রেনের অবস্থান **ডেমো/সিমুলেটেড** দেখাবে।
- যাত্রীর ব্যক্তিগত ফোনের অবস্থান নিজে থেকে ট্রেনের অবস্থান বলে গণ্য হয় না। ট্রেনের অবস্থান প্রকাশ করতে ব্যবহারকারীর স্পষ্ট সম্মতি, সঠিক ট্রেন নির্বাচন ও বাস্তব ট্রেনে থাকা প্রয়োজন।
- বর্তমানে GPS শেয়ার কী-ভিত্তিক প্রাথমিক সুরক্ষা আছে। প্রোডাকশনে আলাদা driver login, HTTPS, abuse protection, database, audit log ও admin dashboard যোগ করা উচিত। শেয়ার কী কখনো public source code-এ রাখবেন না।
- সার্ভার JSON ফাইলে সর্বশেষ GPS রাখে। Hosting provider-এর persistent disk না থাকলে restart/deploy-এ তথ্য হারাতে পারে। বড় পরিসরে PostgreSQL/Firebase/Supabase ব্যবহার করুন।
- GPS location accuracy, mobile network, battery saver এবং Android background permission-এর কারণে update বন্ধ বা দেরি হতে পারে। এই prototype-এ অ্যাপ/পেজ খোলা রেখে GPS শেয়ার করতে হবে।
- GPS শেয়ার শুরু করার আগে ট্রেনের দায়িত্বপ্রাপ্ত ব্যক্তি/রেল কর্তৃপক্ষের অনুমতি নিন। গোপনে কারও অবস্থান ট্র্যাক করার জন্য এটি নয়।

## লোকাল কম্পিউটারে চালানো
Node.js 18+ লাগবে।

```bash
npm install
npm start
```
তারপর `http://localhost:3000` খুলুন। ফোনে GPS ব্যবহারের জন্য production-এ HTTPS domain ব্যবহার করুন; localhost ছাড়া browser geolocation সাধারণত secure context চায়।

## সার্ভারে GPS sharing চালু করা
Linux/macOS:
```bash
RAILTRACK_DRIVER_KEY='নিজের-দীর্ঘ-এলোমেলো-secret' npm start
```
Windows PowerShell:
```powershell
$env:RAILTRACK_DRIVER_KEY='নিজের-দীর্ঘ-এলোমেলো-secret'
npm start
```

সার্ভারে environment variable হিসেবে `RAILTRACK_DRIVER_KEY` সেট করুন। একই key শুধু অনুমোদিত onboard ফোনের operator-কে দিন। Public website-এ key প্রকাশ করবেন না। GPS endpoint:
- `GET /api/live-locations` — সর্বশেষ শেয়ার করা GPS
- `POST /api/location` — key দিয়ে GPS update
- `DELETE /api/location/:trainId` — শেয়ার করা অবস্থান মুছুন/বন্ধ করুন

## Android অ্যাপ তৈরি
Android Studio, JDK এবং Android SDK লাগবে।

```bash
npm install
npx cap add android
npx cap sync android
npx cap open android
```
Android Studio-তে Build > Build APK(s)। `android/app/src/main/AndroidManifest.xml`-এ location permission নিশ্চিত করুন:

```xml
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```

শুধু foreground tracking-এর জন্য এই permission-গুলো যথেষ্ট হতে পারে; background tracking চাইলে Android-এর background location policy, runtime permission flow, foreground service ও notification আলাদাভাবে implement করতে হবে। এই prototype background tracking নিশ্চিত করে না।

## পরবর্তী production কাজ
- বাংলাদেশ রেলওয়ে বা অনুমোদিত GPS provider-এর লিখিত অনুমতি ও API
- যাচাইকৃত train ID, route এবং station GIS dataset
- driver/operator authentication, admin approval ও revocation
- database, retention policy, privacy notice, rate limiting
- stale GPS indicator ও route deviation checks
- Android background location service (প্রয়োজন ও অনুমতি থাকলে)
