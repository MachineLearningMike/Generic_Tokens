import 'hardhat-typechain'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-waffle'
import '@nomiclabs/hardhat-etherscan'

//require('hardhat-deploy');

export default {
  networks: {
    hardhat: {
      allowUnlimitedContractSize: false,
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
    kovan: {
      url: `https://kovan.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  solidity: {
    compilers: [
      {
        version: '0.7.6',
        settings: {
          optimizer: {
            enabled: true,
            runs: 0 //ORG 800
          },
          metadata: {
            // do not include the metadata hash, since this is machine dependent
            // and we want all generated code to be deterministic
            // https://docs.soliditylang.org/en/v0.7.6/metadata.html
            bytecodeHash: 'none',
          },
        },
      },
			{
				version: "0.4.18", // for WETH
				settings: {
					optimizer: {
						enabled: true,
						runs: 200,
					}
				},
			},
    ],
    overrides: {
      // To save console.sol from being compiled in lower version.
      "hardhat/console.sol": {
        version: '0.8.0',
        settings: {}  
      },
      // The following 7 overrides are used to compile OpenZeppelin_Fixed_Token.sol.
      // You can't put version 0.8.0 in the regular compiler list, 
      // because UniswapV3 code will accept that version of compiler, wrongfully.
      "contracts/OpenZeppelin_Fixed_Token.sol": {
        version: '0.8.0',
        settings: {}
      },
      "openzeppelin-solidity/contracts/token/ERC721/IERC721Receiver.sol": {
        version: '0.8.0',
        settings: {}
      },
      "openzeppelin-solidity/contracts/token/ERC20/presets/ERC20PresetFixedSupply.sol": {
        version: '0.8.0',
        settings: {}
      },
      "openzeppelin-solidity/contracts/token/ERC20/extensions/ERC20Burnable.sol": {
        version: '0.8.0',
        settings: {}
      },
      "openzeppelin-solidity/contracts/token/ERC20/extensions/IERC20Metadata.sol": {
        version: '0.8.0',
        settings: {}
      },
      "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol": {
        version: '0.8.0',
        settings: {}
      },
      "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol": {
        version: '0.8.0',
        settings: {}
      },
      "openzeppelin-solidity/contracts/utils/Context.sol": {
        version: '0.8.0',
        settings: {}
      },
    }
  },
}
