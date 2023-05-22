# 🐣 evolution-DAO: Khazi

evolution-DAO is a DAO development repo for different DAOs with increasing difficulty. This branch is for Khazi, the most basic of them all.

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

**And also `yarn create-proposal`, for proposal creation**.

Navigate to the Debug Contracts tab and you should see a smart contract displayed called `Khazi`.

> 👩‍💻 Rerun `yarn deploy` whenever you want to deploy new contracts to the frontend (run `yarn deploy --reset` for a completely fresh deploy if you have made no contract changes).

## ⛳️ Checkpoint 2: Challenge 🌊

`Khazi.sol` is an DAO contract where each proposal is a poll that has a title and counts for votes on two nameless options. It only allows one vote per address. To complete this challenge, we're gonna address two issues with this poll:

- proposal options are nameless
- proposal has no deadline

## ⛳️ Checkpoint 3: Adding names to options 🧑‍🤝‍🧑

First, you should edit the `struct Proposal` and add two `string` parameters for optionA and optionB.

> You can use `bytes32` instead of `string` for gas efficiency! (can you spot other optimizations in this contract? 🤔)

Now you should account for the changes in `event ProposalCreated`, `function createProposal` and `function getProposal`.

To finish, go to `packages/hardhat/scripts` and edit `createProposal.js` call to createProposal to account for changes made!

Great! Now each option for voting has a string specifying its content! Try calling `yarn create-proposal` to see names on voting options!

## ⛳️ Checkpoint 4: Adding a deadline ☠️
