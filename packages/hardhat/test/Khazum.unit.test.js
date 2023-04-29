const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Khazum suite", function () {
  let KhaToken,
    khaToken,
    KhaFaucet,
    khaFaucet,
    Khazum,
    khazum,
    owner,
    addr1,
    addr2;

  before(async () => {
    [owner, addr1, addr2] = await ethers.getSigners();
  });

  beforeEach(async () => {
    KhaToken = await ethers.getContractFactory("KhaToken");
    khaToken = await KhaToken.deploy(1000000);
    KhaFaucet = await ethers.getContractFactory("KhaFaucet");
    khaFaucet = await KhaFaucet.deploy();
    Khazum = await ethers.getContractFactory("Khazum");
    khazum = await Khazum.deploy(khaToken.address);
  });

  describe("KhaToken", function () {
    it("Should deploy KhaToken with the correct initial supply", async function () {
      expect(await khaToken.totalSupply()).to.equal(1000000);
      expect(await khaToken.balanceOf(owner.address)).to.equal(1000000);
    });
  });

  describe("KhaFaucet", function () {
    it("Should set the token address correctly", async function () {
      await khaFaucet.setTokenAddress(khaToken.address);
      expect(await khaFaucet.callStatic.getTokenAddress()).to.equal(
        khaToken.address
      );
    });

    it("Should allow users to request tokens", async function () {
      await khaToken.transfer(khaFaucet.address, 1000);
      await khaFaucet.setTokenAddress(khaToken.address);
      await khaFaucet.connect(addr1).requestTokens(500);
      expect(await khaToken.balanceOf(addr1.address)).to.equal(500);
    });

    it("Should allow the owner to withdraw tokens", async function () {
      await khaToken.transfer(khaFaucet.address, 1000);
      await khaFaucet.setTokenAddress(khaToken.address);
      await khaFaucet.withdrawTokens(500);
      expect(await khaToken.balanceOf(owner.address)).to.equal(
        1000000 - 1000 + 500
      );
    });

    it("Should correctly return the faucet's balance", async function () {
      await khaToken.transfer(khaFaucet.address, 1000);
      await khaFaucet.setTokenAddress(khaToken.address);
      expect(await khaFaucet.balanceOf()).to.equal(1000);
    });
  });
  describe("Khazum", function () {
    describe("createProposal", function () {
      it("Should create a new proposal", async function () {
        await khazum.createProposal(
          "Test Proposal",
          "A simple test proposal",
          60,
          1000
        );
        const [title, description, , , , , status] = await khazum.getProposal(
          0
        );
        expect(title).to.equal("Test Proposal");
        expect(description).to.equal("A simple test proposal");
        expect(status).to.equal(0); // PENDING
      });

      it("Should increment proposal counter with each created proposal", async function () {
        expect(await khazum.getProposalCount()).to.equal(0);
        await khazum.createProposal(
          "Test Proposal 1",
          "A simple test proposal 1",
          60,
          1000
        );
        expect(await khazum.getProposalCount()).to.equal(1);
        await khazum.createProposal(
          "Test Proposal 2",
          "A simple test proposal 2",
          60,
          1000
        );
        expect(await khazum.getProposalCount()).to.equal(2);
      });

      it("Should retrieve a proposal correctly", async function () {
        await khazum.createProposal(
          "Test Proposal",
          "A simple test proposal",
          60,
          1000
        );
        const [title, description, , minimumVotes] = await khazum.getProposal(
          0
        );
        expect(title).to.equal("Test Proposal");
        expect(description).to.equal("A simple test proposal");
        expect(minimumVotes).to.equal(1000);
      });

      it("Should revert if trying to create a proposal with a duration of zero", async function () {
        await expect(
          khazum.createProposal(
            "Test Proposal",
            "A simple test proposal",
            0,
            1000
          )
        ).to.be.revertedWith("Proposal duration must be greater than zero");
      });

      it("Should revert if trying to create a proposal with a minimum votes of zero", async function () {
        await expect(
          khazum.createProposal(
            "Test Proposal",
            "A simple test proposal",
            60,
            0
          )
        ).to.be.revertedWith("Minimum votes must be greater than zero");
      });
    });
    describe("vote", function () {
      it("Should have voting power based on KhaToken balance", async function () {
        await khazum.createProposal(
          "Test Proposal",
          "A simple test proposal",
          60,
          1000
        );
        await khaToken.transfer(addr1.address, 500);
        await khazum.connect(addr1).vote(0, 0); // Option.A
        await khaToken.transfer(addr2.address, 1000);
        await khazum.connect(addr2).vote(0, 1); // Option.B
        const [, , , , votesForOptionA, votesForOptionB] =
          await khazum.getProposal(0);
        expect(votesForOptionA).to.equal(500);
        expect(votesForOptionB).to.equal(1000);
      });

      it("Should cast a vote for Option.A", async function () {
        await khazum.createProposal(
          "Test Proposal",
          "A simple test proposal",
          60,
          1000
        );
        await khaToken.transfer(addr1.address, 500);
        await khazum.connect(addr1).vote(0, 0); // Option.A
        const [, , , , votesForOptionA, ,] = await khazum.getProposal(0);
        expect(votesForOptionA).to.equal(500);
      });

      it("Should cast a vote for Option.B", async function () {
        await khazum.createProposal(
          "Test Proposal",
          "A simple test proposal",
          60,
          1000
        );
        await khaToken.transfer(addr1.address, 500);
        await khazum.connect(addr1).vote(0, 1); // Option.B
        const [, , , , , votesForOptionB] = await khazum.getProposal(0);
        expect(votesForOptionB).to.equal(500);
      });

      it("Should revert if trying to vote for an invalid proposal ID", async function () {
        await expect(khazum.connect(addr1).vote(0, 0)).to.be.revertedWith(
          "Invalid proposal ID"
        );
      });

      it("Should revert if trying to vote for an expired proposal", async function () {
        await khazum.createProposal(
          "Test Proposal",
          "A simple test proposal",
          1,
          1000
        ); // 1 minute duration
        await network.provider.send("evm_increaseTime", [61]); // Increase time by 61 seconds
        await khaToken.transfer(addr1.address, 500);
        await expect(khazum.connect(addr1).vote(0, 0)).to.be.revertedWith(
          "Proposal has expired"
        );
      });

      it("Should revert if a voter with no KhaToken balance tries to vote", async function () {
        await khazum.createProposal(
          "Test Proposal",
          "A simple test proposal",
          60,
          1000
        );
        await expect(khazum.connect(addr1).vote(0, 0)).to.be.revertedWith(
          "Voter has no voting power"
        );
      });

      it("Should revert if trying to vote for an invalid option", async function () {
        await khazum.createProposal(
          "Test Proposal",
          "A simple test proposal",
          60,
          1000
        );
        await khaToken.transfer(addr1.address, 500);
        await expect(khazum.connect(addr1).vote(0, 2)).to.be.reverted;
      });
      it("Should revert if a voter tries to vote after the proposal deadline", async function () {
        await khazum.createProposal(
          "Test Proposal",
          "A simple test proposal",
          1,
          1000
        );
        await khaToken.transfer(addr1.address, 500);

        // Increase the time by 61 seconds
        await network.provider.send("evm_increaseTime", [61]);
        await network.provider.send("evm_mine");

        await expect(khazum.connect(addr1).vote(0, 0)).to.be.revertedWith(
          "Proposal has expired"
        );
      });

      it("Should return true if the voter has already voted on a proposal", async function () {
        await khazum.createProposal(
          "Test Proposal",
          "A simple test proposal",
          60,
          1000
        );
        await khaToken.transfer(addr1.address, 500);
        await khazum.connect(addr1).vote(0, 0); // Option.A
        const hasVoted = await khazum.viewHasVoted(0, addr1.address);
        expect(hasVoted).to.be.true;
      });
      it("Should return false if the voter has not voted on a proposal yet", async function () {
        await khazum.createProposal(
          "Test Proposal",
          "A simple test proposal",
          60,
          1000
        );
        const hasVoted = await khazum.viewHasVoted(0, addr1.address);
        expect(hasVoted).to.be.false;
      });
    });
  });
});
