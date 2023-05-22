# 🐣 evolution-DAO: Khazi

evolution-DAO is a DAO development repo for building different DAOs with increasing difficulty.

This branch is for Khazi, the most basic of them all.

# 🚩 Khazi: Minimum Viable DAO

We start off with a [scaffold-eth](https://github.com/scaffold-eth/scaffold-eth) build for a DAO with one vote per address.

Following this lesson instructions, you'll build a basic DAO for voting between two options, with name for each option and a deadline for the poll.

Start by editing the `packages/hardhat/contracts/Khazi.sol` contract. This repo also has solutions (👮🏻 try not to peek!) in the `/solutions` folder, but you will learn more by writing the code yourself!

## ⛳️ Checkpoint 0: 📦 install 📚

Pull down the appropriate challenge repo/branch to get started.

```bash
git clone https://github.com/luloxi/evolution-DAO.git khazi
cd evolution-DAO
git checkout khazi
yarn install
```

## ⛳️ Checkpoint 1: 🔭 Environment 📺

You'll have three terminals up for:

1. `yarn start` (react app frontend)

2. `yarn chain` (hardhat backend)

3. `yarn deploy` (to compile, deploy, and publish your contracts to the frontend)

4. And also `yarn create-proposal`, for proposal creation. You can use the same terminal as the deploy one, or another one, your call.

Call it to see a `proposalCard` appear in the homepage according to `createProposal` script in the `packages/hardhat/scripts` folder.

Navigate to the Debug Contracts tab and you should see a smart contract displayed called `Khazi`.

> 👩‍💻 Rerun `yarn deploy` whenever you want to deploy new contracts to the frontend (run `yarn deploy --reset` for a completely fresh deploy if you have made no contract changes).

## ⛳️ Checkpoint 2: Challenge 🌊

`Khazi.sol` is an DAO contract where each proposal is a poll that has a title and counts for votes on two nameless options. It only allows one vote per address. To complete this challenge, we're gonna address two issues with this poll:

- proposal options are nameless
- proposal has no deadline

## ⛳️ Checkpoint 3: Adding names to options 🧑‍🤝‍🧑

First, you should edit the `struct Proposal` and add two `string` parameters for optionA and optionB.

> You can use `bytes32` instead of `string` for gas efficiency! (can you spot other optimizations in this contract? 🤔)

Now search for this parts of the code and follow the checkpoint 3 instructions there:

- `event ProposalCreated`
- `function createProposal`
- `function getProposal`.

To finish, go to `packages/hardhat/scripts` and edit `createProposal.js` call to createProposal to account for changes made!

Great! Now each option for voting has a string specifying its content! Try calling `yarn create-proposal` to see names on voting options!

## ⛳️ Checkpoint 4: Adding a deadline ☠️

First, you should edit the `struct Proposal` and add a `uint256` parameter for **deadline**

Now search for this parts of the code and follow the checkpoint 4 instructions there:

- `function createProposal`
- `function vote`
- `function getProposal`

To finish, go to `packages/hardhat/scripts` and edit `createProposal.js` call to createProposal to account for changes made!

Create a new proposal now, you should see an updated frontend card with a deadline now!

### Goals

[ ] Does you see "Votes for OPTION_NAME" in your frontend when you create a new proposal?
[ ] Does it reject voting beyond the deadline?

### ⚔️ Side Quests

[ ] If options are an address instead of a string, could it have some onchain utility after a winner is chosen?
[ ] Can you optimize the gas usage of this contract?
[ ] Can you add more conditions to this contract?

### ⚠️ Test it!

Now is a good time to run yarn test to run the automated testing function. It will test that you hit the core checkpoints. You are looking for all green checkmarks and passing tests!

> If you used bytes32, it might fail a few tests

## Checkpoint 5: 🚢 Ship it 🚁

📡 Edit the `defaultNetwork` to [your choice of public EVM networks](https://ethereum.org/en/developers/docs/networks/) in `packages/hardhat/hardhat.config.js`

👩‍🚀 You will want to run `yarn account` to see if you have a **deployer address**

🔐 If you don't have one, run `yarn generate` to create a mnemonic and save it locally for deploying.

⛽️ You will need to send ETH to your **deployer address** with your wallet.

🚀 Run `yarn deploy` to deploy your smart contract to a public network (selected in hardhat.config.js)

## Checkpoint 6: 🎚 Frontend 🧘‍♀️

📝 Edit the `targetNetwork` in `App.jsx` (in `packages/react-app/src`) to be the public network where you deployed your smart contract.

💻 View your frontend at [http://localhost:3000/](http://localhost:3000/)

📡 When you are ready to ship the frontend app...

📦 Run `yarn build` to package up your frontend.

💽 Upload your app to surge with `yarn surge` (you could also `yarn s3` or maybe even `yarn ipfs`?)

😬 Windows users beware! You may have to change the surge code in `packages/react-app/package.json` to just `"surge": "surge ./build"`,

⚙ If you get a permissions error `yarn surge` again until you get a unique URL, or customize it in the command line.

🚔 Traffic to your url might break the [Infura](https://www.infura.io/) rate limit, edit your key: `constants.js` in `packages/ract-app/src`.

## Checkpoint 7: 📜 Contract Verification

Update the api-key in `packages/hardhat/package.json` file. You can get your key [here](https://etherscan.io/login?cmd=last).

![Image](https://user-images.githubusercontent.com/9419140/144075208-c50b70aa-345f-4e36-81d6-becaa5f74857.png)

Now you are ready to run the `yarn verify --network your_network` command to verify your contracts on etherscan 🛰

💬 Problems, questions, comments on the stack? Post them to the [🏗 scaffold-eth developers chat](https://t.me/joinchat/F7nCRK3kI93PoCOk)

**Congratulations on completing Khazi!**

# About evolution-DAO

To see current development info [click here](https://lulox.notion.site/evolution-DAO-91a60bc9f6c449e6a1f163a380d575b1)

Available builds:

- **Khazi** (DAO with one vote per address)
- **Khazum** (DAO with ERC20 as votes, minimum votes and a deadline)

Under development:

- **Khazerium** (DAO + ERC20Votes + mint NFT to proposal executor)
- **Khazathon** (quadratic DAO + NFT2executor + dynamic NFT given **optionally** for voters)
- **Khazito** (DAO with NFT as votes that invests DAO funds in holder proposed NFTs on a Marketplace)
- **Khazefi** (DAO with Dynamic NFT as votes that allows withdrawal of ETH and decides where to stake it on execute)
