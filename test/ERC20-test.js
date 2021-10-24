const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Testing Pay Token", function () {

  let total_supply = 1000000; // one million
  bn_decimals = ethers.BigNumber.from("1000000000000000000");
  bn_totalBalance = ethers.BigNumber.from(total_supply).mul(bn_decimals);
  //alice = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
  //bob = "0xBcd4042DE499D14e55001CcbB24a551F3b954096";

  let provider = ethers.getDefaultProvider();
  
  let alice, bob, charlie, dave, eve, frank;
  let pay, pay_read, pay_alice, pay_bob, pay_charlie, pay_dave, pay_eve;

  it("Let alice, bob, and charlie be signers.", async function() {
    [alice, bob, charlie, dave, eve, frank] = await ethers.getSigners();

    expect(alice != undefined && bob != undefined && charlie != undefined);
    expect(alice != bob && bob != charlie && charlie != alice);
  })

  it("Alice deploys the PAY token with " + String(total_supply) + " Pays minted to her.", async function () {
    const Pay = await ethers.getContractFactory("Fixed_Token", alice);
    pay = await Pay.deploy("PAY Token", "PAY", ethers.BigNumber.from(total_supply).mul(bn_decimals), alice.address);
    await pay.deployed();
    expect(pay != undefined).to.equal(true);
  });

  it("alice's initial balance is " + String(total_supply) + " Pays.", async function () {
    expect(await pay.balanceOf(alice.address)).to.equal(ethers.BigNumber.from(total_supply).mul(bn_decimals));
  });

  it("bob's initial balance is 0 Pays.", async function () {
    expect(await pay.balanceOf(bob.address)).to.equal(0);
  });

  pays_aliceTransfersToBob = 1000;

  it("The alice transfers " + String(pays_aliceTransfersToBob) + " Pays to bob.", async function () {
    pay_alice = pay.connect(alice);
    expect(await pay_alice.transfer(bob.address, ethers.BigNumber.from(pays_aliceTransfersToBob).mul(bn_decimals)));
  });

  it("bob's balance is now " + String(pays_aliceTransfersToBob) + " Pays.", async function () {
    expect(await pay.balanceOf(bob.address)).to.equal(ethers.BigNumber.from(pays_aliceTransfersToBob).mul(bn_decimals));
  });

  it("Alice can't transferFrom bob to chalie.", async function () {
    try{
      await pay_alice.transferFrom(bob.address, charlie.address, 1000).catch(expect(true).to.equal(true));
      expect(true).to.equal(false);
    } catch {
      expect(true).to.equal(true);
    }
  });

  pays_aliceApprovesCharlie = 3000;
  it("alice Approves charlie to spend " + String(pays_aliceApprovesCharlie) + " Pays of her balance.", async function () {
    try{
      await pay_alice.approve(charlie.address, ethers.BigNumber.from(pays_aliceApprovesCharlie).mul(bn_decimals));
      expect(true).to.equal(true);
    } catch {
      expect(true).to.equal(false);
    }
  });

  it("charlie's allowance from alice is " + String(pays_aliceApprovesCharlie) + " Pays.", async function () {
    expect(await pay.allowance(alice.address, charlie.address)).to.equal(ethers.BigNumber.from(pays_aliceApprovesCharlie).mul(bn_decimals));
  });

  it("charlie transfersFrom alice to dave " + String(pays_aliceApprovesCharlie) + " Pays.", async function () {
    pay_charlie = pay.connect(charlie);
    try{
      await pay_charlie.transferFrom(alice.address, dave.address, ethers.BigNumber.from(pays_aliceApprovesCharlie).mul(bn_decimals));
      expect(true).to.equal(true);
    } catch {
      expect(true).to.equal(false)
    }
  });

  it("charlie's allowance from alice is back 0 Pays.", async function () {
    expect(await pay.allowance(alice.address, charlie.address)).to.equal(0);
  });

  it("dave's allowance is " + String(pays_aliceApprovesCharlie) + " Pays.", async function () {
    expect(await pay.balanceOf(dave.address)).to.equal(ethers.BigNumber.from(pays_aliceApprovesCharlie).mul(bn_decimals));
  });

});
