const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("Learning reetancy attacks", () => {
    let bankReetancy, smartcontractAttacker;
    // John, Michael are investors
    // Kibo is a hacker
    // The bankReetancy contract is the target of the reetancy attacks
    let john, michael, kibo;

        beforeEach(async () => {
            [john,michael,kibo] = await ethers.getSigners();

            const BankReetancy = await ethers.getContractFactory("BankReetancy");
            bankReetancy = await BankReetancy.deploy();

            const SmartcontractAttacker = await ethers.getContractFactory("Attacker");
            smartcontractAttacker = await SmartcontractAttacker.deploy(bankReetancy.getAddress());
        });

        describe("Deployment",() => {
        it("Should deploy without errors",async () => {
            console.log("BankReetancy address: ",await bankReetancy.getAddress());
            console.log("SmartContractAttacker address: ",await smartcontractAttacker.getAddress());
            console.log("John address: ", john.address);
            console.log("Michael address: ", michael.address);
            console.log("Kibo address: ", kibo.address);

        });

        describe("Investing",()=>{
            it("John invests 1 ether and the BankReetancy has 1 ethers", async()=>{
                let johnInvestment = ethers.parseEther("1");
                await bankReetancy.connect(john).deposit({value:johnInvestment});
                // John check the contract balance
                expect(String(await bankReetancy.connect(john).getContractBalance())).to.equal(String(johnInvestment));
            });
            it("John invests 1 ether, Michael invests 2 ethers and the BankReetancy has 3 ethers", async()=>{
                let johnInvestment = ethers.parseEther("1");
                let michaelInvestment = ethers.parseEther("2");
                let expectTotalInvestments = ethers.parseEther("3");
                await bankReetancy.connect(john).deposit({value:johnInvestment});
                await bankReetancy.connect(michael).deposit({value:michaelInvestment});
                // Michael checks contract balance
                expect(String(await bankReetancy.connect(michael).getContractBalance())).to.equal(String(expectTotalInvestments));
            });
            it("John invests 1 ether, Michael invests 2 ethers ,Kibo invests 3 ethers and the BankReetancy has 6 ethers", async()=>{
                let johnInvestment = ethers.parseEther("1");
                let michaelInvestment = ethers.parseEther("2");
                let kiboInvestment = ethers.parseEther("3");
                let expectTotalInvestments = ethers.parseEther("6");
                await bankReetancy.connect(john).deposit({value:johnInvestment});
                await bankReetancy.connect(michael).deposit({value:michaelInvestment});
                await bankReetancy.connect(kibo).deposit({value:kiboInvestment});
                // kibo checks contract balance
                expect(String(await bankReetancy.connect(kibo).getContractBalance())).to.equal(String(expectTotalInvestments));
            });
        });

        describe("Attacking",()=>{
            it("John invests 1 ether, Michael invests 2 ethers ,Kibo as an attacker invests 3 ethers using its smart contract and the BankReetancy has 0 ethers and the attacker smart contract has 6 ethers", async()=>{
                let johnInvestment = ethers.parseEther("1");
                let michaelInvestment = ethers.parseEther("2");
                let kiboInvestment = ethers.parseEther("3");

                await bankReetancy.connect(john).deposit({ value: johnInvestment });
                await bankReetancy.connect(michael).deposit({ value: michaelInvestment });

                console.log("Bank balance before attack: ", String(await bankReetancy.getContractBalance()));
                console.log("Attacker contract balance before attack: ", String(await smartcontractAttacker.getContractBalance()));

                // Kibo attacks sent 3 ethers and get 6 ethers from the victim.
                
                await  smartcontractAttacker.connect(kibo).attack({ value: kiboInvestment});

                console.log("Bank balance after attack: ", String(await bankReetancy.getContractBalance()));
                console.log("Attacker contract balance after attack: ", String(await smartcontractAttacker.getContractBalance()));

                expect(String(await bankReetancy.getContractBalance())).to.equal("0");
                expect(String(await smartcontractAttacker.getContractBalance())).to.equal(String(ethers.parseEther("6")));
                });
            });
        });
 });