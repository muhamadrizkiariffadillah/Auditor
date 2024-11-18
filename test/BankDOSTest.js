const { deployContract } = require("@nomicfoundation/hardhat-ethers/types");
const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
  const { expect } = require("chai");
const hre = require("hardhat");
  require("@nomicfoundation/hardhat-ethers")

describe("Bank Contract",function(){

    async function deployContracts(){
        // Get some accounts to test.
       const [deployerAsInvestor1, investor2,investor3] = await hre.ethers.getSigners();
        // deploy the bank contract
        const Bank = await hre.ethers.getContractFactory("contracts/01-Bank-DOS.sol:Bank");
        const bank = await Bank.deploy();

        const BankHacker = await hre.ethers.getContractFactory("contracts/01-Attack-To-Bank.sol:Bank");
        const bankHacker = await BankHacker.deploy();

        const Hack = await ethers.getContractFactory("Hacker");
        const hack = await Hack.deploy();

        return {bank,bankHacker,hack,deployerAsInvestor1,investor2,investor3};
    };

    describe("Deploying",function () {
        it("Should deploy the contracts without any error",async()=>{
            const {bank,bankHacker,hack,deployerAsInvestor1,investor2,investor3} = await loadFixture(deployContracts);
            console.log("Bank Victim Address: ",await bank.getAddress());
            console.log("Bank Attacker Address: ",await bankHacker.getAddress());
            console.log("Smart Contract Attacker Address: ",await hack.getAddress());
            console.log("Investor1 address: ", deployerAsInvestor1.address);
            console.log("Investor2 address: ", investor2.address);
            console.log("Investor3 address: ", investor3.address);
    });

    describe("Investing",function(){
        it("investor 1 should be the biggest investor",async()=>{
           const {bank,deployerAsInvestor1} = await loadFixture(deployContracts);
           let amountInvestor1ToInvest = hre.ethers.parseEther("1");
           
           await bank.connect(deployerAsInvestor1).tryToBeBiggestInvestor({value:amountInvestor1ToInvest});

           expect(String(await bank.connect(deployerAsInvestor1).getCurrentBigInvestor())).to.equal(String(deployerAsInvestor1.address));
           expect(String(await bank.connect(deployerAsInvestor1).getHighestDeposit())).to.equal(String(amountInvestor1ToInvest));
        });
        it("Investor 2 attack the smart contract cause other user cannot be a higher investor",async()=>{
            const {bank,hack,deployerAsInvestor1,investor2,investor3} = await loadFixture(deployContracts);

            // Amount to invest
            const amountInvestor1 = hre.ethers.parseEther("1");
            const amountInvestor2 = hre.ethers.parseEther("2");
            const amountInvestor3 = hre.ethers.parseEther("3");

            // Interaction to be a higher investor.
            await bank.connect(deployerAsInvestor1).tryToBeBiggestInvestor({value: amountInvestor1});
            // Investor 2 attack the smart contract.
            await hack.connect(investor2).attack(await bank.getAddress(),{value: amountInvestor2});
            // Investor 3 cannot be a higher investor.
            await expect(bank.connect(investor3).tryToBeBiggestInvestor({value: amountInvestor3})).to.be.reverted;
            
            expect(String(await bank.connect(investor3).getCurrentBigInvestor())).to.equal(String(await hack.getAddress()));
        })

    });

    

    });
});