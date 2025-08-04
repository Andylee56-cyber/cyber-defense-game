@echo off
echo 🚀 智能守护者联盟 - GitHub部署脚本
echo ======================================

echo.
echo 📋 请按照以下步骤操作：
echo.

echo 1️⃣ 首先，请确保你已经：
echo    - 在GitHub上创建了仓库
echo    - 安装了Git
echo    - 配置了Git用户信息
echo.

echo 2️⃣ 请输入你的GitHub用户名：
set /p github_username=用户名: 

echo.
echo 3️⃣ 请输入你的仓库名称：
set /p repo_name=仓库名: 

echo.
echo 4️⃣ 开始部署流程...
echo.

echo 🔧 初始化Git仓库...
git init

echo 📁 添加所有文件...
git add .

echo 💾 提交代码...
git commit -m "初始版本：智能守护者联盟游戏"

echo 🔗 添加远程仓库...
git remote add origin https://github.com/%github_username%/%repo_name%.git

echo 📤 推送到GitHub...
git branch -M main
git push -u origin main

echo.
echo ✅ 部署完成！
echo.
echo 🌐 你的游戏链接：
echo https://%github_username%.github.io/%repo_name%/
echo.
echo 📖 请记得在GitHub仓库设置中启用Pages功能：
echo    1. 进入仓库的Settings
echo    2. 找到Pages选项
echo    3. Source选择"Deploy from a branch"
echo    4. Branch选择"main"
echo    5. 点击Save
echo.
echo 🎮 部署完成后，用户访问链接就会看到游戏说明页面！
echo.
pause 