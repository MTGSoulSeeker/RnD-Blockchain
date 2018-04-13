@echo off
IF EXIST ".\data\geth" (
	ECHO Loading your data...
    geth --datadir=./data --rpc --rpcapi="eth,web3,db,net,personal" -rpccorsdomain "*" --networkid "1994" --etherbase 2 --bootnodes "enode://068a5c5aeab95691c9b802dc9d268c03c29fbfd76d322524736e53f9cdc15fe20ab518fa32d810093937b1858e8d735d6bbdd30baa08d926b02f2fcd63438e1a@10.184.153.23:30303"
 ) ELSE ( 
	ECHO Creating your data...	 
	geth --datadir=./data init CustomGenesis.json
	ECHO Loading your data...
	geth account new --datadir=./data --password=./data/password.txt
	geth --datadir=./data --rpc --rpcapi="eth,web3,db,net,personal" -rpccorsdomain "*" --networkid "1994" --etherbase 2 --bootnodes "enode://068a5c5aeab95691c9b802dc9d268c03c29fbfd76d322524736e53f9cdc15fe20ab518fa32d810093937b1858e8d735d6bbdd30baa08d926b02f2fcd63438e1a@10.184.153.23:30303"
)


timeout /t -1 /nobreak