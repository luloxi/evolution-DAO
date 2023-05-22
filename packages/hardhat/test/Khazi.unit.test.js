const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Khazi", function () {
  let khazi;
  let proposalCounter;

  beforeEach(async function () {
    const Khazi = await ethers.getContractFactory("Khazi");
    khazi = await Khazi.deploy();
    await khazi.deployed();

    proposalCounter = await khazi.getProposalCount();
  });

  it("Should create a new proposal", async function () {
    const title = "Test Proposal";
    const optionA = "Option A";
    const optionB = "Option B";
    const minutesUntilDeadline = 60;

    await khazi.createProposal(title, optionA, optionB, minutesUntilDeadline);

    const proposal = await khazi.getProposal(proposalCounter);
    expect(proposal.title).to.equal(title);
    expect(proposal.optionA).to.equal(optionA);
    expect(proposal.optionB).to.equal(optionB);
    expect(proposal.deadline).to.be.gt(0);
    expect(proposal.votesForOptionA).to.equal(0);
    expect(proposal.votesForOptionB).to.equal(0);

    proposalCounter = await khazi.getProposalCount();
    expect(proposalCounter).to.equal(1);
  });

  it("Should increment the proposal counter with each created proposal", async function () {
    const title1 = "Test Proposal 1";
    const optionA1 = "Option A 1";
    const optionB1 = "Option B 1";
    const minutesUntilDeadline1 = 60;

    await khazi.createProposal(
      title1,
      optionA1,
      optionB1,
      minutesUntilDeadline1
    );

    let proposal = await khazi.getProposal(proposalCounter);
    expect(proposal.title).to.equal(title1);
    expect(proposal.optionA).to.equal(optionA1);
    expect(proposal.optionB).to.equal(optionB1);

    proposalCounter = await khazi.getProposalCount();
    expect(proposalCounter).to.equal(1);

    const title2 = "Test Proposal 2";
    const optionA2 = "Option A 2";
    const optionB2 = "Option B 2";
    const minutesUntilDeadline2 = 120;

    await khazi.createProposal(
      title2,
      optionA2,
      optionB2,
      minutesUntilDeadline2
    );

    proposal = await khazi.getProposal(proposalCounter);
    expect(proposal.title).to.equal(title2);
    expect(proposal.optionA).to.equal(optionA2);
    expect(proposal.optionB).to.equal(optionB2);

    proposalCounter = await khazi.getProposalCount();
    expect(proposalCounter).to.equal(2);
  });

  it("Should allow voting on a proposal", async function () {
    const title = "Test Proposal";
    const optionA = "Option A";
    const optionB = "Option B";
    const minutesUntilDeadline = 60;

    await khazi.createProposal(title, optionA, optionB, minutesUntilDeadline);

    const voter = await ethers.getSigner(1);
    const voterAddress = await voter.getAddress();

    await khazi.connect(voter).vote(proposalCounter, false);

    const updatedProposal = await khazi.getProposal(proposalCounter);
    expect(updatedProposal.votesForOptionA).to.equal(1);
    expect(updatedProposal.votesForOptionB).to.equal(0);

    const hasVoted = await khazi.hasVoted(proposalCounter, voterAddress);
    expect(hasVoted).to.be.true;
  });

  it("Should revert when voting for an invalid proposal ID", async function () {
    const voter = await ethers.getSigner(1);
    const invalidProposalId = 0;

    await expect(
      khazi.connect(voter).vote(invalidProposalId, false)
    ).to.be.revertedWith("Invalid proposal ID");
  });

  it("Should revert when voting period has ended", async function () {
    const title = "Test Proposal";
    const optionA = "Option A";
    const optionB = "Option B";
    const minutesUntilDeadline = 1; // 1 minute duration

    await khazi.createProposal(title, optionA, optionB, minutesUntilDeadline);

    await ethers.provider.send("evm_increaseTime", [61]); // Increase time by 61 seconds

    const voter = await ethers.getSigner(1);

    await expect(
      khazi.connect(voter).vote(proposalCounter, false)
    ).to.be.revertedWith("Voting period has ended");
  });

  it("Should revert when a voter with no voting power tries to vote", async function () {
    const title = "Test Proposal";
    const optionA = "Option A";
    const optionB = "Option B";
    const minutesUntilDeadline = 60;

    await khazi.createProposal(title, optionA, optionB, minutesUntilDeadline);

    const voter = await ethers.getSigner(1);

    await khazi.connect(voter).vote(proposalCounter, false);

    await expect(
      khazi.connect(voter).vote(proposalCounter, true)
    ).to.be.revertedWith("Already voted");
  });

  it("Should return true if the voter has already voted on a proposal", async function () {
    const title = "Test Proposal";
    const optionA = "Option A";
    const optionB = "Option B";
    const minutesUntilDeadline = 60;

    await khazi.createProposal(title, optionA, optionB, minutesUntilDeadline);

    const voter = await ethers.getSigner(1);
    const voterAddress = await voter.getAddress();

    await khazi.connect(voter).vote(proposalCounter, false);

    const hasVoted = await khazi.hasVoted(proposalCounter, voterAddress);
    expect(hasVoted).to.be.true;
  });

  it("Should return false if the voter has not voted on a proposal yet", async function () {
    const title = "Test Proposal";
    const optionA = "Option A";
    const optionB = "Option B";
    const minutesUntilDeadline = 60;

    await khazi.createProposal(title, optionA, optionB, minutesUntilDeadline);

    const voter = await ethers.getSigner(1);
    const voterAddress = await voter.getAddress();

    const hasVoted = await khazi.hasVoted(proposalCounter, voterAddress);
    expect(hasVoted).to.be.false;
  });
});
