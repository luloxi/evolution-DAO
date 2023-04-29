# 🐣 evolution-DAO

DAO development learning project that makes different DAOs with increasing difficulty level

Current development:

- **Khazum** (DAO with ERC20 as votes, minimum votes and a deadline)

Future development:

- **Khazi** (DAO with one vote per address)
- **Khazerium** (DAO + ERC20Votes + mint NFT to proposal executor)
- **Khazathon** (quadratic DAO + NFT2executor + dynamic NFT given **optionally** for voters)
- **Khazito** (DAO with NFT as votes that invests DAO funds in holder proposed NFTs on a Marketplace)
- **Khazefi** (DAO with Dynamic NFT as votes that allows withdrawal of ETH and decides where to stake it on execute)

> Note: Idea was originated by [quaxwell-dapp](https://github.com/luloxi/quaxwell-dapp), a repo I was working on before I started playing with scaffold-eth

## Pending improvements

- Write tests
- Make a separate branch for Khazi
- Turn it into a step-by-step lesson
- Develop new versions with TypeScript

## Index

- [Quick Start](#🏄‍♂️-quick-start)
- [Deploy to production](#deploy-to-production)
- [File location](#file-location)
- [Express](#express)
- [Troubleshooting](#📚-troubleshooting)

# 🏄‍♂️ Quick Start

Prerequisites: [Node (v18 LTS)](https://nodejs.org/en/download/) plus [Yarn (v1.x)](https://classic.yarnpkg.com/en/docs/install/) and [Git](https://git-scm.com/downloads)

🚨 If you are using a version < v18 you will need to remove `openssl-legacy-provider` from the `start` script in `package.json`

> 1️⃣ clone/fork 🏗 evolution-DAO:

```bash
git clone https://github.com/luloxi/evolution-DAO.git
```

> 2️⃣ install and start your 👷‍ Hardhat chain:

```bash
cd evolution-DAO
yarn install
yarn chain
```

_Optionally you can run `yarn test` to run tests on the contracts and verify everything's working correctly_

> 3️⃣ in a second terminal window, 🛰 deploy your contracts:

```bash
cd evolution-DAO
yarn deploy
```

> 3️⃣ in a third terminal window, start your 📱 frontend:

🚨 if your contracts are not deployed to localhost, you will need to update the default network in `App.jsx` to match your default network in `hardhat-config.js`.

```bash
cd evolution-DAO
yarn start
```

📱 Open http://localhost:3000 to see the app

> 🏗 Hint: If you go to http://localhost:3000/debug you can interact directly with contract's functions

🚨 if you are not deploying to localhost, you will need to run `yarn generate` first and then fund the deployer account. To view account balances, run `yarn account`. You will aslo need to update `hardhat-config.js` with the correct default network.

> On another terminal, you can run this commands::

**Deploy again your contracts**

```bash
yarn deploy --reset
```

**Create a new proposal from Owner account:**

1. Go to `/packages/hardhat/scripts` and open `createProposal.js` in a text editor
2. Look for this line at the top of the file `Searchconst khazumContractAddress = require("../deployments/localhost/Khazum.json").address;`
3. Change the word `localhost` to the network where your contract is deployed
4. Change the proposal parameters to the content you desire for the proposal.
5. Run this command from the root directory of the repo:

```bash
yarn create-proposal
```

## Deploy to production

### Setting up

1. 📡 **Set default network**: Edit the **initialNetwork** (after the NETWORK.name-of-your-network) in `packages/hardhat/hardhat.config.js`, as well as **targetNetwork** in `packages/react-app/src/App.jsx`, to [your choice of public EVM networks](https://ethereum.org/en/developers/docs/networks/)

2. 🔶 **Infura**: You will need to get an API key from [infura.io](https://www.infura.io/) and paste it in `packages/react-app/src/constants.js` in the variable **INFURA_ID**

3. 🌍 **Alchemy**: You need an RPC key for testnets and production deployments, create an [Alchemy](https://www.alchemy.com/) account, create a node for your desired chain, copy its **API KEY** and paste it in `packages/react-app/src/constants.js` in the variable **ALCHEMY_KEY**

4. 📣 **Etherscan**: Update the API KEY in `packages/hardhat/package.json` file. You can get your [key here](https://etherscan.io/login?cmd=last). Look for the line `"verify": "hardhat etherscan-verify --api-key` and replace the gibberish at the end with your API KEY.

### 📜 Deploying contract

1. 👩‍🚀 Run `yarn account` to see if you have a deployer address

2. 🔐 If you don't have one, run `yarn generate` to create a mnemonic and save it locally for deploying. Mnemonic phrase gets stored in `packages/hardhat/mnemonic.txt`

3. 🛰 Fund your deployer address with its corresponding network gas (run `yarn account` again to view balances and address)

4. 🚀 Run `yarn deploy` to deploy to your public network of choice (😅 wherever you can get ⛽️ gas)

5. 🔬 Inspect the block explorer for the network you deployed to... make sure your contract is there.

6. 👮 Run the `yarn verify --network your_network` command to verify your contracts on Etherscan 🛰

### Deploying website to Surge

🚨📡 To deploy to a public domain, use `yarn surge`. You will need to have a surge account and have the surge CLI installed. There is also the option to deploy to IPFS using `yarn ipfs` and `yarn s3` to deploy to an AWS bucket 🪣 There are scripts in the `packages/react-app/src/scripts` folder to help with this.`

## File location

📝 Frontend base is `App.jsx` in `packages/react-app/src` and
🦸 Frontend main component is `Home.jsx` in `packages/react-app/src/views`
🦸 Frontend view files are in `packages/react-app/src/views`

🔏 Smart contract are in `packages/hardhat/contracts`
🚀 Deployment scripts are in `packages/hardhat/deploy`
👨‍💻 Other scripts are in `packages/hardhat/scripts`

## Express

**This will be used in a lesson, to show how to use it, then how to migrate to a better option**

> In a terminal window, you can start your 📱 express backend:

```bash
cd evolution-DAO
yarn express
```

Then you can access http://localhost:3001/proposals to see the list of proposals from a REST API

💡 if you use **nodemon** for development, you can use `yarn expressmon` to start monitoring changes on `index.js` file

# 📚 Troubleshooting

## Running the first time

Can't run any of this commands from your Windows environment? [See HOW-TO-WSL.md](https://github.com/luloxi/easy-everything/blob/main/HOW-TO-WSL.md)

Don't have yarn to run the commands? [See HOW-TO-YARN.MD](https://github.com/luloxi/easy-everything/blob/main/HOW-TO-YARN.md)

Certain errors during the Quick Start are common, [see HOW-TO-SCAFFOLD-ETH.MD](https://github.com/luloxi/easy-everything/blob/main/HOW-TO-SCAFFOLD-ETH.md)

## Community docs & help

Documentation, tutorials, challenges, and many more resources, visit: [docs.scaffoldeth.io](https://docs.scaffoldeth.io)

Join the telegram [support chat 💬](https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA) or buidlguidl [discord](https://discord.gg/pRsr6rwG) to ask questions and find others building with 🏗 scaffold-eth!
