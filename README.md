# besu-event-log
A simple demo for a smart contract's event that stores several variables and collects their logs.  

<div align="center">
  <img
    src="https://github.com/user-attachments/assets/fbf5ffa8-8621-4d2d-b056-34b943f81f82"
    width="80%"
  >
</div>

## Requirements

* Hyperledger Besu (v24.5.x)
* Node.js (v20.13.x)

This product uses a privat network of Hyperledger Besu Ethereum client for Blockchain ledger and tracking. For more detailed information about Besu, please visit [https://besu.hyperledger.org/](https://besu.hyperledger.org/). Node.js is also required for deployments of the smart contract with Hardhat and Next.js sample WEB app.

## Implementation

### 1. Install an WEB browser crypto wallet

To interact with the Besu's private network, you need to have an WEB browser-integrated crypto wallet platform such as Trust Wallet and MetaMask - **in this demo, MetaMask is strongly recommended**, otherwise, you may have several unexpected issues. The Google extension of MetaMask ([https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn](https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn)) would be the most well-known and easiest method to implement. Once a crypto wallet is installed, create (or sign in) your account and activate it on your browser. 

### 2. Build a private Ethereum network on Besu

You can build/run a Besu's private net on your machine with the genesis block and config file which are on `besu` directory - go to `besu` dir and run Besu with `--config-file` option as follows:

```
% cd besu
% besu --config-file=config.toml
```

If succesful, a private net with Clique (PoA) consensus protocol will be launched. You can modify the miner-coinbase account (default `0xfe3b557e8fb62b89f4916b721be55ceb828dbd73`) and JSON-RPC host and port (default `127.0.0.1` and `4989`, respectively). 

The minimum gas prices is set at `0x2540be400` which refers 1000000000 wei. If you want to make the network gas-free, change the `min-gas-price` into 0x0:

```
# /besu/config.toml

min-gas-price=0x0
```

### 3. Compile and deploy the smart contract

Now you will compile and deploy the sample smart contract onto your Besu private net - this process is carried on by the Hardhat development environment via NPM. Go to `hardhat` dir and install the required packages:

```
% cd hardhat
% npm install
```

Then the `npx hardhat` command should be available - on `hardhat` dir, you will compile the smart contract by typing:

```
% npx hardhat compile
```

The system will compile a Solidity source which is `hardhat/contracts/Sample.sol` and will generate `artifacts` dir which contains the compiled outputs (e.g., ABI and bytecodes).


After the compilation, you will deploy the smart contract onto your Besu private net. **⚠️ If you changed the miner-coinbase account or/and JSON-RPC endpoint, you need to modify `hardhat.config.js` file as well.** e.g.:

```
# hardhat.config.json

require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: {
    version: "0.8.20"
  },
  networks: {
    besuPrivate: {
      /* CHANGE RPC-HTTP ENDPOINT INTO YOURS !!!*/
      url: "http://127.0.0.1:4989",
      /* CHANGE PRIVATE KEY OF MINER-COINBASE ACCOUNT INTO YOURS !!!*/
      accounts: [ "0x8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63" ]
    }
  }
}
```

You will type the following command to deploy the smart contract:

```
% npx hardhat run deploy/deploy.js --network besuPrivate
```

If successful, you will get a contract address on your terminal, e.g.:

```
Contract SampleTracker was deployed to: 0x42699A7612A82f1d9C36148af9C77354759b210b
```

<span style="color:red; font-weight:bold;">⚠️ IMPORTANT: Please copy and note your own contract address as it will be used later on.</span>

### 4. Run Next.js app

Before running the app, **you need to set your own contract address (explained above) onto the source**: open `/nextjs-app/src/app/page.tsx` file on your editor and set your contract address to the const variable `contractAddress`:

```
# page.tsx

// IMPORTANT: SET YOUR OWN CONTRACT ADDRESS HERE !!!
const contractAddress = '0x42699A7612A82f1d9C36148af9C77354759b210b';
```

You will then go back to `nextjs-app` dir, and install the required packages, e.g.:

```
% cd nextjs-app
% npm install
```

The app will start running with the host/port at `http://localhost:3000` by default, e.g.:

```
% npm run dev
```

### 5. Connect to the Besu private net via crypt wallet

Register your Besu private net onto your crypt wallet - this is an example of MetaMask wallet adding a new custom network: you will set your network's 1) network name, 2) RPC URL, 3) chain ID and 4) currency symbol:

<div align="center">
  <img
    src="https://github.com/user-attachments/assets/ec7f6e88-3a20-4a02-a8b7-b3cd48048e6f"
    width="45%"
  >
</div>

Once you set your Besu private net, your wallet can connet to the smart contract by clicking the fox logo at top of the page🦊
