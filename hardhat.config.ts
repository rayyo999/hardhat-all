import '@nomicfoundation/hardhat-toolbox'
import 'hardhat-deploy'
import { HardhatUserConfig } from 'hardhat/config'
import 'dotenv/config'
// import tasks!!!!
import './tasks/block-number'

const PRIVATE_KEY = process.env.PRIVATE_KEY || ''
const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL || ''
const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL || ''
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL || ''
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ''
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || ''
/** @type import('hardhat/config').HardhatUserConfig */
const config: HardhatUserConfig = {
  // solidity: '0.8.9',
  solidity: {
    compilers: [
      { version: '0.8.9' },
      { version: '0.7.6' },
      { version: '0.6.12' },
      { version: '0.4.19' },
    ],
  },
  networks: {
    rinkeby: {
      url: RINKEBY_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 4,
    },
    // goerli: {
    //   url: GOERLI_RPC_URL,
    //   accounts: [PRIVATE_KEY],
    //   chainId: 5,
    // },
    localhost: {
      url: 'http://localhost:8545',
      chainId: 31337,
    },
    hardhat: {
      chainId: 31337,
      forking: {
        url: MAINNET_RPC_URL,
      },
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  gasReporter: {
    enabled: true,
    currency: 'USD',
    outputFile: 'gas-report.txt',
    noColors: true,
    // coinmarketcap: COINMARKETCAP_API_KEY,
    token: 'MATIC',
  },
  // for deploy (getNamedAccounts())
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
      1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
      4: 0, //rinkeby
      // 5: 0, //goerli
      31337: 0, //hardhat node
    },
    user: {
      default: 1,
    },
  },
}
export default config
