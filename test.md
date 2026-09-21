bun tsc --noEmit
bunx expo-doctor
eas build --platform android --profile preview





git add -A
git commit --no-verify -m "OK"
git push origin main --force



# সাধারণ (optional) আপডেট
git tag v1.4.2
git push origin v1.4.2

# force/mandatory আপডেট — commit message এ [force] থাকলেই যথেষ্ট
git commit -m "fix: critical login bug [force]"
git tag v1.4.3
git push origin v1.4.3 && git push origin main

git tag v1.0.2
git push origin v1.0.2



eas update --branch production --message "serch"