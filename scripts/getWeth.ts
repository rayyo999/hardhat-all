import { ethers, getNamedAccounts, network } from 'hardhat'
import { networkConfig } from '../helper-hardhat-config'

export const AMOUNT = ethers.utils.parseEther('0.1')

export const getWeth = async () => {
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId as number
  const iWeth = await ethers.getContractAt(
    'IWeth',
    networkConfig[chainId].wethToken!,
    deployer
  )
  const txResponse = await iWeth.deposit({
    value: AMOUNT,
  })
  await txResponse.wait(1)
  const wethBalance = await iWeth.balanceOf(deployer)
  console.log(`Got ${wethBalance.toString()} WETH`)
}
