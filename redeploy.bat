@echo off
echo 🚀 智能守护者联盟 - 重新部署脚本
echo ======================================

echo.
echo 📋 正在更新游戏文件...
echo.

echo 🔧 添加更新的文件...
git add .

echo 💾 提交更改...
git commit -m "修复游戏跳转链接：start.html现在跳转到comprehensive_fix_test.html"

echo 📤 推送到GitHub...
git push origin main

echo.
echo ✅ 重新部署完成！
echo.
echo 🌐 你的游戏链接：
echo https://Andylee56-cyber.github.io/cyber-defense-game/
echo.
echo 🎮 现在点击"开始游戏"会直接进入真正的游戏界面！
echo.
pause 