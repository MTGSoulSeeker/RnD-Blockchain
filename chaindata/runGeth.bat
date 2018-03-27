@echo off
IF EXIST ".\data\geth" (	
	ECHO Loading your data...
	geth --datadir=./data --rpc --rpcapi="eth,web3,db,net,personal" -rpccorsdomain "*" --networkid "1994"
	) ELSE ( 
	ECHO Creating your data...	 
	geth --datadir=./data init CustomGenesis.json
)
pause