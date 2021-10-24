const { expect } = require("chai");
const { ethers } = require("hardhat");
const { getTypeParameterOwner } = require("typescript");
const InputDataDecoder = require('ethereum-input-data-decoder');

describe("Testing Uniswap V3", function () {

  let total_supply = 1000000; // one million
  let bn_decimals = ethers.BigNumber.from("1000000000000000000");
  let bn_totalBalance = ethers.BigNumber.from(total_supply).mul(bn_decimals);
  //alice = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
  //bob = "0xBcd4042DE499D14e55001CcbB24a551F3b954096";

  let alice, bob, charlie, dave, eve, frank;
  let factory, factory_owner, pay, mike, pool_address, descriptor, position_manager, transfer_helper, tester, swap_router;
  let position_tokenId, position_liquidity;
  let liquidity, liquidity_read, liquidity_alice, liquidity_bob, liquidity_charlie, liquidity_dave, liquidity_eve;
  let mike_pay_price = 2.0;

  it("Let alice, bob, and charlie be signers.", async function() {
    [alice, bob, charlie, dave, eve, frank] = await ethers.getSigners();
    //[alice, bob, charlie, dave, eve, frank] = await ethers.getSigners([
    //  0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80,
    //  0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d,
    //  0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a,
    //  0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6,
    //  0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a,
    //  0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba,
    //]);

    expect(alice != undefined && bob != undefined && charlie != undefined);
    expect(alice != bob && bob != charlie && charlie != alice);
  })

  it("The WETH token is deployed.", async function () {
    const WETH = await ethers.getContractFactory("WETH9");
    weth = await WETH.deploy();
    await weth.deployed();
    expect(weth != undefined).to.equal(true);
  });

  it("The PAY token is deployed with " + String(total_supply) + " Pays minted to alice.", async function () {
    const Pay = await ethers.getContractFactory("Fixed_Token", alice);
    pay = await Pay.deploy("PAY Token", "PAY", ethers.BigNumber.from(total_supply).mul(bn_decimals), alice.address);
    await pay.deployed();
    console.log("pay token: %s", pay.address);
    expect(pay != undefined).to.equal(true);
  });

  it("The MIKE token is deployed with " + String(total_supply) + " Mikes minted to alice.", async function () {
    const Mike = await ethers.getContractFactory("Fixed_Token", alice);
    mike = await Mike.deploy("MIKE Token", "MIKE", ethers.BigNumber.from(total_supply).mul(bn_decimals), alice.address);
    await mike.deployed();
    console.log("mike token: %s", mike.address);
    expect(mike != undefined).to.equal(true);
  });

  it("Bob deploys a UniswapV3Factory, becoming its owner.", async function () {
    factory_owner = bob;
    const Factory = await ethers.getContractFactory("UniswapV3Factory", factory_owner);
    factory = await Factory.deploy();
    console.log("factory: %s", factory.address);
    await factory.deployed();
    expect(factory != undefined).to.equal(true);
  });

  it("Dave calls the factory to create the pool<mike, pay>.", async function () {
    factory_dave = factory.connect(dave);
    try {
      await factory_dave.createPool(mike.address, pay.address, "3000");
      pool_address = await factory_dave.getPool(mike.address, pay.address, "3000");
      console.log("pool: %s", pool_address);
      expect(pool_address != undefined).to.equal(true);
    } catch {
      expect(true).to.equal(false);
    }
  });

  it("Dave calls the pool<mike, pay> to initilaize price.", async function () {
    //let pool_abi = await ethers.readArtifacts("UniswapV3Pool").abi;
    const pool_abi = require("../artifacts/contracts/core/UniswapV3Pool.sol/UniswapV3Pool.json").abi;
    const pool_dave = await new ethers.Contract(pool_address, pool_abi, dave);
    //const sqrtpriceX96 = ethers.BigNumber.toString(ethers.BigNumber.toBigInt(ethers.BigNumber.from(2).pow(96) * Math.pow(mike_pay_price, 0.5)));
    const sqrtpriceX96 = "112045541949572279837463876454";

    try {
      await pool_dave.initialize(sqrtpriceX96);
      _sqrtpriceX96 = await pool_dave.slot0().sqrtpriceX96;
      //console.log(_sqrtpriceX96);
      //expect(_sqrtpirceX96 != undefined).to.equal(true);
      expect(true).to.equal(true);
    } catch {
      expect(true).to.equal(false);
    }
  });

  let nft_descriptor;
  it("Bob deploys the NFTDescriptor library.", async function () {
    const Factory = await ethers.getContractFactory("NFTDescriptor", bob);
    nft_descriptor = await Factory.deploy();
    await nft_descriptor.deployed();
    expect(nft_descriptor != undefined).to.equal(true);
  });

  let poolAddress;
  it("Bob deploys the PoolAddress library.", async function () {
    const Factory = await ethers.getContractFactory("NFTDescriptor", bob);
    poolAddress = await Factory.deploy();
    await poolAddress.deployed();
    expect(poolAddress != undefined).to.equal(true);
  });

  let sort_order;
  it("Bob deploys the TokenRatioSortOrder library.", async function () {
    const Factory = await ethers.getContractFactory("TokenRatioSortOrder", bob);
    sort_order = await Factory.deploy();
    await poolAddress.deployed();
    expect(sort_order != undefined).to.equal(true);
  });

  it("Aice deploys a NonfungibleTokenPositionDescriptor.", async function () {
    const Descriptor = await ethers.getContractFactory("NonfungibleTokenPositionDescriptor", {
      libraries: {
        NFTDescriptor: nft_descriptor.address.toString(),
      }
    });
    descriptor = await Descriptor.deploy(weth.address);
    await descriptor.deployed();
    expect(descriptor != undefined).to.equal(true);
  });

  it("Aice deploys a NonfungiblePositionManager.", async function () {
    const Factory = await ethers.getContractFactory("NonfungiblePositionManager", {
      libraries: {
      }
    });
    position_manager = await Factory.deploy(factory.address, weth.address, descriptor.address);
    await position_manager.deployed();
    expect(position_manager != undefined).to.equal(true);
  });

  it("Bob deploys the TransferHelper library.", async function () {
    const Factory = await ethers.getContractFactory("contracts/periphery/libraries/TransferHelper.sol:TransferHelper", bob);
    transfer_helper = await Factory.deploy();
    await transfer_helper.deployed();
    expect(transfer_helper != undefined).to.equal(true);
  });

  it("Aice deploys a UniswapV3_Tester.", async function () {
    const Factory = await ethers.getContractFactory("UniswapV3_Tester", {
      libraries: {
      }
    });
    tester = await Factory.deploy(position_manager.address);
    await tester.deployed();
    expect(tester != undefined).to.equal(true);
  });

  mikes_aliceApprovesTester = 3000;
  it("alice Approves tester to spend " + String(mikes_aliceApprovesTester) + " Mikes of her balance.", async function () {
    mike_alice = mike.connect(alice);
    try{
      await mike_alice.approve(tester.address, ethers.BigNumber.from(mikes_aliceApprovesTester).mul(bn_decimals));
      expect(true).to.equal(true);
    } catch {
      expect(true).to.equal(false);
    }
  });

  pays_aliceApprovesTester = 3000;
  it("alice Approves tester to spend " + String(pays_aliceApprovesTester) + " Pays of her balance.", async function () {
    pay_alice = pay.connect(alice);
    try{
      await pay_alice.approve(tester.address, ethers.BigNumber.from(pays_aliceApprovesTester).mul(bn_decimals));
      expect(true).to.equal(true);
    } catch {
      expect(true).to.equal(false);
    }
  });

  const mikes_to_mint = 1000;
  const pays_to_mint = 1000;
  it("Alice calls the tester to add liquidity to the pool<mike, pay>.", async function () {
    tester_alice = tester.connect(alice);
    //const tester_abi = require("../artifacts/contracts/UniswapV3_Tester.sol/UniswapV3_Tester.json").abi;
    //const decoder = new InputDataDecoder(tester_abi);
    try {
      let tx = await tester_alice.mintNewPosition(mike.address, pay.address, ethers.BigNumber.from(mikes_to_mint).mul(bn_decimals), ethers.BigNumber.from(pays_to_mint).mul(bn_decimals) );
      var res = await tx.wait();
      let sumEvent = res.events.pop();
      event_args = sumEvent.args;
      position_tokenId = event_args[0], position_liquidity = event_args[1];
      console.log("Liquiditi minted. tokenId: %s, liquidity: %s, amount0: %s, amount1: %s", position_tokenId, position_liquidity, event_args[2], event_args[3]);
      expect(true).to.equal(true);
    } catch {
      expect(true).to.equal(false);
    }
  });

  it("Bob deploys a SwapRouter.", async function () {
    const Factory = await ethers.getContractFactory("SwapRouter", bob);
    swap_router = await Factory.deploy(factory.address, weth.address);
    await swap_router.deployed();
    expect(swap_router != undefined).to.equal(true);
  });

  it("The tester's Pay allowance from alice is ...", async function () {
    allowance = await pay.allowance(alice.address, tester.address);
    allowance = allowance.div(bn_decimals);
    allowance = allowance.toNumber();
    console.log("Tester's Pay alloweance from alice: %", allowance);
  });

  it("The tester's Mike allowance from alice is ...", async function () {
    allowance = await mike.allowance(alice.address, tester.address);
    allowance = allowance.div(bn_decimals);
    allowance = allowance.toNumber();
    console.log("Tester's Mike alloweance from alice: %", allowance);
  });

  it("alice's Pay balance is ...", async function () {
    balance = await pay.balanceOf(alice.address);
    balance = balance.div(bn_decimals);
    balance = balance.toNumber();
    console.log("Tester's Pay balance: %", balance);
  });

  it("alice's Mike balance is ...", async function () {
    balance = await mike.balanceOf(alice.address);
    balance = balance.div(bn_decimals);
    balance = balance.toNumber();
    console.log("Tester's Mike balance: %", balance);
  });



});
