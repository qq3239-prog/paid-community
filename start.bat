@echo off
cd /d C:\Users\Kv\paid-community
echo ========================================
echo  付费会员社区 - 一键安装启动
echo ========================================
echo.

echo [1/4] 安装依赖...
call npm install
if %errorlevel% neq 0 (
    echo 依赖安装失败，请检查 Node.js 是否已安装
    pause
    exit /b 1
)

echo [2/4] 初始化数据库...
call npx prisma db push
if %errorlevel% neq 0 (
    echo 数据库初始化失败
    pause
    exit /b 1
)

echo [3/4] 填充种子数据...
call npm run db:seed
if %errorlevel% neq 0 (
    echo 种子数据填充失败
    pause
    exit /b 1
)

echo [4/4] 启动开发服务器...
echo.
echo ========================================
echo  启动成功！打开浏览器访问:
echo  http://localhost:3000
echo ========================================
echo  管理员: admin@example.com / admin123
echo  测试会员: member@example.com / member123
echo ========================================
echo.
call npm run dev
