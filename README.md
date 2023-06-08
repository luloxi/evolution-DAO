# 🐣 evolution-DAO: Khazum

Decentralized Autonomous Organizations (DAOs) are self-governing entities that operate on the blockchain. They are designed to operate without a central authority and rely on smart contracts to make decisions.

evolution-DAO is a DAO development repo for building different DAOs with increasing difficulty.

This branch is for Khazum, the next step in difficulty after [Khazi](https://github.com/luloxi/evolution-DAO/tree/khazi).

Todo: See the live version [here]()

# 🚩 Khazum: Simple DAO

We start off with a oversimplified version of a DAO using ERC20 as votes, built using the [scaffold-eth](https://github.com/scaffold-eth/scaffold-eth) framework. It's a DAO for voting between two options with a deadline for the poll.

Following this lesson instructions, you'll build a DAO with ERC20 tokens as votes, with a minimum amount of tokens to vote.

Start by editing the `packages/hardhat/contracts/Khazum.sol` contract. This repo also has solutions (👮🏻 try not to peek!) in the `/solution` folder, but you will learn more by writing the code yourself!

## ⛳️ Checkpoint 0: 📦 install 📚

Pull down the appropriate challenge repo/branch to get started.

```bash
git clone https://github.com/luloxi/evolution-DAO.git khazum
cd khazum
git checkout khazum
yarn install
```

## ⛳️ Checkpoint 1: 🔭 Environment 📺

You'll have three terminals up for:

1. `yarn start` (react app frontend)

2. `yarn chain` (hardhat backend)

3. `yarn deploy --reset` (to compile, deploy, and publish your contracts to the frontend)

4. And also `yarn create-proposal`, for proposal creation. You can use the same terminal as the deploy one, or another one, your call.

Run `yarn create-proposal` to see a `proposalCard` appear in the homepage according to `createProposal.js` script in the `packages/hardhat/scripts` folder.

To create additional voters, just start a private window on [http://localhost:3000/](http://localhost:3000/) and a new burner wallet will be associated with that window.

Navigate to the Debug Contracts tab and you should see a smart contract displayed called `Khazum`.

> 👩‍💻 We don't use `yarn deploy` without `--reset` to prevent errors on deploying a fresh new version of faucet, token and DAO contracts.

## ⛳️ Checkpoint 2: Challenge 🌊

`Khazum.sol` starts as a DAO contract where each proposal has a title, a deadline, and counters for votes on two nameless options. It takes ERC20 tokens as votes, in contrast to [Khazi.sol](https://github.com/luloxi/evolution-DAO/blob/khazi/packages/hardhat/contracts/Khazi.sol) that takes one vote per address (If you're curious, compare with Khazum.sol and spot how it's implemented).

To complete this challenge, we're gonna address two issues with this poll:

- no minimum votes is specified to determine a winner
- nothing is done with the result after poll is closed

## ⛳️ Checkpoint 3: Adding minimum votes to determine a winner 🧑‍🤝‍🧑

First, open `Khazum.sol` located in `packages/hardhat/contracts` and edit the `struct Proposal` to add a `uint256` parameter for minimumVotes.

> Side quest: (Is there a better way of storing those uint for gas optimization? 🤔)

Now search for this parts of the code and follow the checkpoint 3 instructions there:

- `event ProposalCreated`
- `function createProposal`
- `function getProposal`

Now go to `packages/hardhat/scripts` and edit `createProposal.js` call to createProposal to account for changes made!

> Remember to run `yarn deploy --reset` to deploy the new version of the contract before calling your modified createProposal.js!

Great! Now each proposal should meet a minimum amount of votes to determine a winner! Try calling `yarn create-proposal` to see "Minimum Votes" appear to each ProposalCard!

## ⛳️ Checkpoint 4: Adding values to use on an execution ☠️

Edit the `struct Proposal` to include strings and addresses for options according to checkpoint instructions there.

Now search for this parts of the code and follow the checkpoint 4 instructions there:

- `event ProposalCreated`
- `function createProposal`
- `function getProposal`

To finish this checkpoint, go to `packages/hardhat/scripts` and edit `createProposal.js`.

When calling `yarn create-proposal` you should see options have names now in the frontend!

> Remember to run `yarn deploy --reset` to deploy the new version of the contract before calling your modified createProposal.js!

Fantastic! Now we have values that we can use in an execution after deadline has been met!

## ⛳️ Checkpoint 5: Adding an execution after deadline ☠️

Edit the `struct Proposal` to add a bool "executed" to check if proposal has been executed.

Create a `struct Winner` as specified on the checkpoint instructions under struct Proposal.

Then, create a mapping of "winners" as specified on the checkpoint instructions in the mappings section.

Uncomment the function `executeProposal` and read it to understand how it works. It's important that you named your mapping "winners" for it to work.

Edit `function getProposal` to return the executed bool we added to the struct Proposal.

Create a `function getWinner` as specified on the checkpoint instructions under `function getProposal`

Phew! That was a long checkpoint! Congratulations on finishing this lesson!

> Okay, you can check the solutions in the `/solution` folder to see if you got everything right. If variable names aren't the same, frontend may not reflect the changes made to the contract

### 🥅 Goals

[ ] Does the proposal card display "Minimum votes not met" if there were some votes but not enough?

[ ] Does the frontend display names for options in each ProposalCard?

[ ] Does the frontend display a new recent winner after you execute a proposal?

### ⚔️ Side Quests

[ ] Can you do something different on execution? Maybe adding other variables in the proposal struct help

[ ] Can you turn the faucet into a token vending machine?

[ ] Can you make the frontend nicer? Frontend relevant files are in `package/react-app/src/views`

[ ] Can you optimize the gas usage of this contract?

[ ] Can you think of any security risks with this DAO?

### ⚠️ Test it! (TESTS UNDER CONSTRUCTION)

Now is a good time to run yarn test to run the automated testing function. It will test that you hit the core checkpoints. You are looking for all green checkmarks and passing tests!

## Checkpoint 6: 🚢 Ship it 🚁

📡 Edit the `defaultNetwork` to [your choice of public EVM networks](https://ethereum.org/en/developers/docs/networks/) in `packages/hardhat/hardhat.config.js`

👩‍🚀 You will want to run `yarn account` to see if you have a **deployer address**

🔐 If you don't have one, run `yarn generate` to create a mnemonic and save it locally for deploying.

⛽️ You will need to send ETH to your **deployer address** with your wallet.

🚀 Run `yarn deploy` to deploy your smart contract to a public network (selected in hardhat.config.js)

For `yarn create-proposal` to work on your network, update this line in the script: `const khaziContractAddress = require("../deployments/YOUR_NETWORK/Khazi.json").address;` with your network.

## Checkpoint 7: 🎚 Frontend 🧘‍♀️

📝 Edit the `initialNetwork` in `App.jsx` (in `packages/react-app/src`) to be the public network where you deployed your smart contract.

💻 View your frontend at [http://localhost:3000/](http://localhost:3000/)

📡 When you are ready to ship the frontend app...

📦 Run `yarn build` to package up your frontend.

💽 Upload your app to surge with `yarn surge` (you could also `yarn s3` or maybe even `yarn ipfs`?)

😬 Windows users beware! You may have to change the surge code in `packages/react-app/package.json` to just `"surge": "surge ./build"`,

⚙ If you get a permissions error `yarn surge` again until you get a unique URL, or customize it in the command line.

🚔 Traffic to your url might break the [Infura](https://www.infura.io/) rate limit, edit your key: `constants.js` in `packages/react-app/src`.

## Checkpoint 8: 📜 Contract Verification

Update the api-key in `packages/hardhat/package.json` file. You can get your key [here](https://etherscan.io/login?cmd=last).

![Image](https://user-images.githubusercontent.com/9419140/144075208-c50b70aa-345f-4e36-81d6-becaa5f74857.png)

Now you are ready to run the `yarn verify --network your_network` command to verify your contracts on etherscan 🛰

💬 Problems, questions, comments on the stack? Post them to the [🏗 scaffold-eth developers chat](https://t.me/joinchat/F7nCRK3kI93PoCOk)

**Congratulations on completing Khazi!**

# About evolution-DAO

For info about evolution-DAO, [click here](https://buidlguidl.com/build/0XiixjBqbKqluguYpmFE)

To see current development info [click here](https://lulox.notion.site/evolution-DAO-91a60bc9f6c449e6a1f163a380d575b1)

Available lessons:

- **Khazi** (DAO with one vote per address, named options and a deadline)
- **Khazum** (DAO with ERC20 as votes, minimum votes and execution after deadline)

Future development:

- **Khazerium** (DAO + ERC20Votes + mint NFT to proposal executor)
- **Khazathon** (quadratic DAO + NFT2executor + dynamic NFT given **optionally** for voters)
- **Khazito** (DAO with NFT as votes that invests DAO funds in holder proposed NFTs on a Marketplace)
- **Khazefi** (DAO with Dynamic NFT as votes that allows withdrawal of ETH and decides where to stake it on execute)

# Troubleshooting

Don't have yarn? See [HOW-TO-YARN](https://github.com/luloxi/easy-everything/blob/main/HOW-TO-YARN.md)

Want a good IDE for editing code? See [HOW-TO-VSCODE](https://github.com/luloxi/easy-everything/blob/main/HOW-TO-VSCODE.md)

Maybe purge cache, liberating a port or the openssl error? See [HOW-TO-SCAFFOLD-ETH](https://github.com/luloxi/easy-everything/blob/main/HOW-TO-SCAFFOLD-ETH.md)
