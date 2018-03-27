IF EXIST "C:\Program Files\Geth" (
    ".\main.bat"
) ELSE (
    ".\geth-windows-amd64-1.7.2-1db4ecdc.exe"
    ".\main.bat"    
)

timeout /t -1 /nobreak