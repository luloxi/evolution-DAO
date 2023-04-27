const {
  KhazumAddress,
  KhazumABI,
  KhaTokenAddress,
  KhaTokenABI,
  KhaFaucetAddress,
  KhaFaucetABI,
} = require("../helper-hardhat-config");
const { ethers, network } = require("hardhat");
const fs = require("fs");

module.exports = async () => {
  const { log } = deployments;
  if (process.env.UPDATE_FRONT_END) {
    log("Updating address and ABI on interface...");
    await updateKhazumABI();
    await updateKhazumAddress();
    await updateKhaFaucetABI();
    await updateKhaTokenAddress();
    await updateKhaTokenABI();
    await updateKhaFaucetAddress();

    log("Done!");
    log("-------------------------------------");
  }
};

async function updateKhazumABI() {
  const Khazum = await ethers.getContract("Khazum");
  fs.writeFileSync(
    KhazumABI,
    Khazum.interface.format(ethers.utils.FormatTypes.json)
  );
}

async function updateKhazumAddress() {
  const Khazum = await ethers.getContract("Khazum");
  const contractAddresses = JSON.parse(fs.readFileSync(KhazumAddress, "utf8"));
  if (network.config.chainId.toString() in contractAddresses) {
    if (
      !contractAddresses[network.config.chainId.toString()].includes(
        Khazum.address
      )
    ) {
      contractAddresses[network.config.chainId.toString()].push(Khazum.address);
    }
  } else {
    contractAddresses[network.config.chainId.toString()] = [Khazum.address];
  }
  fs.writeFileSync(KhazumAddress, JSON.stringify(contractAddresses));
}

async function updateKhaFaucetABI() {
  const KhaFaucet = await ethers.getContract("KhaFaucet");
  fs.writeFileSync(
    KhaTokenABI,
    KhaFaucet.interface.format(ethers.utils.FormatTypes.json)
  );
}

async function updateKhaTokenAddress() {
  const KhaFaucet = await ethers.getContract("KhaFaucet");
  const contractAddresses = JSON.parse(
    fs.readFileSync(KhaTokenAddress, "utf8")
  );
  if (network.config.chainId.toString() in contractAddresses) {
    if (
      !contractAddresses[network.config.chainId.toString()].includes(
        KhaFaucet.address
      )
    ) {
      contractAddresses[network.config.chainId.toString()].push(
        KhaFaucet.address
      );
    }
  } else {
    contractAddresses[network.config.chainId.toString()] = [KhaFaucet.address];
  }
  fs.writeFileSync(KhaTokenAddress, JSON.stringify(contractAddresses));
}

async function updateKhaTokenABI() {
  const KhaToken = await ethers.getContract("KhaToken");
  fs.writeFileSync(
    KhaFaucetABI,
    KhaToken.interface.format(ethers.utils.FormatTypes.json)
  );
}

async function updateKhaFaucetAddress() {
  const KhaToken = await ethers.getContract("KhaToken");
  const contractAddresses = JSON.parse(
    fs.readFileSync(KhaFaucetAddress, "utf8")
  );
  if (network.config.chainId.toString() in contractAddresses) {
    if (
      !contractAddresses[network.config.chainId.toString()].includes(
        KhaToken.address
      )
    ) {
      contractAddresses[network.config.chainId.toString()].push(
        KhaToken.address
      );
    }
  } else {
    contractAddresses[network.config.chainId.toString()] = [KhaToken.address];
  }
  fs.writeFileSync(KhaFaucetAddress, JSON.stringify(contractAddresses));
}

module.exports.tags = ["all", "frontend"];
