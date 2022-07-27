import { network } from 'hardhat'
import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { networkConfig, developmentChains } from '../helper-hardhat-config'
import verify from '../utils/verify'
// const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
//   const {getNamedAccounts, deployments} = hre
// }
const func: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
}: HardhatRuntimeEnvironment) {
  const { deploy, log, get } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId as number
  const isLocal = developmentChains.includes(network.name)

  let ethUsdPriceFeedAddress
  if (developmentChains.includes(network.name)) {
    const ethUsdAggregator = await get('MockV3Aggregator')
    ethUsdPriceFeedAddress = ethUsdAggregator.address
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId]['ethUsdPriceFeed']
  }
  const args = [ethUsdPriceFeedAddress!]
  const fundMe = await deploy('FundMe', {
    from: deployer,
    args,
    log: true,
    waitConfirmations: isLocal ? 0 : 6,
  })
  if (!isLocal && process.env.ETHERSCAN_API_KEY) {
    await verify(fundMe.address, args)
  }
  log('----------------------------')
}
func.tags = ['all', 'fundme']
export default func
