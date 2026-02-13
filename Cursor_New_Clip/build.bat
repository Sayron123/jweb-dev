@echo off
echo Building TypeScript files...
call npm install
call npm run build
echo Build complete! Check the dist/ folder for compiled files.
pause
