# মোবাইল দিয়ে RailTrack BD APK বানানোর নিয়ম

এই প্রজেক্টে GitHub Actions workflow যোগ করা হয়েছে। তাই Android Studio/কম্পিউটার ছাড়াই মোবাইলের Chrome দিয়ে APK build করা যাবে। Build করার জন্য ইন্টারনেট লাগবে এবং GitHub account লাগবে।

## ধাপ ১ — ZIP Extract
1. `RailTrack_BD_V3_Mobile_Build.zip` ডাউনলোড করে ZArchiver বা Files দিয়ে Extract করুন।
2. `railtrack-bd-v2` ফোল্ডারের ভেতরের সব ফাইল GitHub repository-তে upload করতে হবে। `.github/workflows/android-apk.yml` ফাইলটিও অবশ্যই upload করবেন।

## ধাপ ২ — GitHub repository
1. Chrome-এ https://github.com খুলে account-এ sign in করুন।
2. `+` → `New repository` → নাম দিন `railtrack-bd` → Public বা Private বেছে `Create repository` চাপুন।
3. Repository-তে `Add file` → `Upload files` চাপুন এবং `railtrack-bd-v2`-এর ভেতরের project files upload করে `Commit changes` করুন। Root-এ `package.json`, `server.js`, `index.html`, `capacitor.config.json` এবং `.github/workflows/android-apk.yml` থাকতে হবে; ফাইলগুলো আরেকটি nested `railtrack-bd-v2` ফোল্ডারের ভেতরে রাখবেন না।

## ধাপ ৩ — APK build
1. Repository-র `Actions` tab খুলুন।
2. `Build RailTrack BD APK` workflow নির্বাচন করুন।
3. `Run workflow` → আবার `Run workflow` চাপুন।
4. Build শেষ হলে সবুজ tick দেখাবে। Workflow run খুলে নিচে `Artifacts` থেকে `RailTrack-BD-debug-APK` ডাউনলোড করুন।
5. ZIP artifact Extract করে `app-debug.apk` ইনস্টল করুন। Android-এ প্রয়োজন হলে “Install unknown apps” অনুমতি দিন।

## গুরুত্বপূর্ণ
- GitHub Actions build শুধু Android APK তৈরি করে; অনলাইন সার্ভার নিজে থেকে deploy করে না। লাইভ GPS sharing-এর জন্য Node server-টি HTTPS-সহ hosting-এ deploy করে app-এর API base URL production domain-এ সেট করতে হবে।
- ট্রেনের লাইভ অবস্থানের জন্য ট্রেনের ভেতরে অনুমতিপ্রাপ্ত ফোনে GPS sharing চালু এবং সার্ভার অনলাইন থাকতে হবে।
- এটি debug APK; Play Store release-এর জন্য আলাদা signed release build প্রয়োজন।
