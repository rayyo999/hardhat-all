import { Address } from 'hardhat-deploy/types'

interface NetworkConfig {
  [key: number]: {
    name: string
    ethUsdPriceFeed?: Address
    wethToken?: Address
    lendingPoolAddressesProvider?: Address
    daiEthPriceFeed?: Address
    daiToken?: Address
  }
}
export const networkConfig: NetworkConfig = {
  4: {
    name: 'rinkeby',
    ethUsdPriceFeed: '0x8A753747A1Fa494EC906cE90E9f37563A8AF630e',
  },
  137: {
    name: 'polygon',
    ethUsdPriceFeed: '0xF9680D99D6C9589e2a93a78A04A279e509205945',
  },
  31337: {
    name: 'localhost',
    wethToken: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    lendingPoolAddressesProvider: '0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5',
    daiEthPriceFeed: '0x773616E4d11A78F511299002da57A0a94577F1f4',
    daiToken: '0x6b175474e89094c44da98b954eedeac495271d0f',
  },
}

export const developmentChains = ['hardhat', 'localhost']
