# 🏗 evolution-DAO

DAO development learning project that makes different DAOs with increasing difficulty level

- **Khazi** (DAO with one vote per address)
- **Khazum** (DAO with ERC20 as votes)

Future development:

- **Khazerium** (DAO + ERC20Votes + mint NFT to proposal executor)
- **Khazathon** (quadratic DAO + NFT2executor + dynamic NFT given **optionally** for voters)

- **Khazito** (DAO with NFT as votes that invests DAO funds in holder proposed NFTs on a Marketplace)
- **Khazefi** (DAO with Dynamic NFT as votes that allows withdrawal of ETH and decides where to stake it on execute)

[evolution-DAO is a public good of BuidlGuidl](https://buidlguidl.com/build/0XiixjBqbKqluguYpmFE)

> Note: Idea was originated by [quaxwell-dapp](https://github.com/luloxi/quaxwell-dapp), a repo I was working on before I started playing with scaffold-eth

## Pending changes

- Add functionality to buttons (maybe with the help of update-frontend from hardhat)
- Make express process the button function
- Make Khazi a minimal version of Khazum
- Add ERC20 for votes to Khazum
- Write tests

## Later changes

- Make a nicer frontend
- Config docker/package.json to make the express server run on deploy to surge
- Config express, createProposal and .jsx elements to read dynamically abi and address based on chainId
- Update frontend dynamically when a new proposal is posted (express?)

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

🚨 if you are not deploying to localhost, you will need to run `yarn generate` first and then fund the deployer account. To view account balances, run `yarn account`. You will aslo need to update `hardhat-config.js` with the correct default network.

> On the second terminal, you can run this commands::

**Create a new proposal from Owner account:**

```bash
yarn create-proposal
```

**Deploy again your contracts**

```bash
yarn deploy --reset
```

## Deprecated

> 3️⃣ in another terminal window, you can start your 📱 express backend:

```bash
cd evolution-DAO
yarn express
```

💡 if you use **nodemon** for development, you can use `yarn expressmon` to start monitoring changes on `index.js` file

## File location

📝 Frontend base is `App.jsx` in `packages/react-app/src` and
🦸 Frontend main component is `Home.jsx` in `packages/react-app/src/views`

🔏 Smart contract are in `packages/hardhat/contracts`
🚀 Deployment scripts are in `packages/hardhat/deploy`
👨‍💻 Other scripts are in `packages/hardhat/scripts`

🚨📡 To deploy to a public domain, use `yarn surge`. You will need to have a surge account and have the surge CLI installed. There is also the option to deploy to IPFS using `yarn ipfs` and `yarn s3` to deploy to an AWS bucket 🪣 There are scripts in the `packages/react-app/src/scripts` folder to help with this.`

# 📚 Troubleshooting

## Running the first time

Can't run any of this commands from your Windows environment? [See HOW-TO-WSL.md](https://github.com/luloxi/easy-everything/blob/main/HOW-TO-WSL.md)

Don't have yarn to run the commands? [See HOW-TO-YARN.MD](https://github.com/luloxi/easy-everything/blob/main/HOW-TO-YARN.md)

Certain errors during the Quick Start are common, [see HOW-TO-SCAFFOLD-ETH.MD](https://github.com/luloxi/easy-everything/blob/main/HOW-TO-SCAFFOLD-ETH.md)

## Deploy

🌍 You need an RPC key for testnets and production deployments, create an [Alchemy](https://www.alchemy.com/) account and replace the value of `ALCHEMY_KEY = xxx` in `packages/react-app/src/constants.js` with your new key.

📣 Make sure you update the `InfuraID` before you go to production. Huge thanks to [Infura](https://infura.io/) for our special account that fields 7m req/day!

## Community docs & help

Documentation, tutorials, challenges, and many more resources, visit: [docs.scaffoldeth.io](https://docs.scaffoldeth.io)

Join the telegram [support chat 💬](https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA) or buidlguidl [discord](https://discord.gg/pRsr6rwG) to ask questions and find others building with 🏗 scaffold-eth!
