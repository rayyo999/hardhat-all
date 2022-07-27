import { ethers, run, network } from 'hardhat'
import { Address } from 'hardhat-deploy/types'

async function main() {
  const SimpleStorageFactory = await ethers.getContractFactory('SimpleStorage')
  const SimpleStorage = await SimpleStorageFactory.deploy()
  await SimpleStorage.deployed()
  console.log('deployed to:', SimpleStorage.address)

  if (network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
    await SimpleStorage.deployTransaction.wait(6)
    await verify(SimpleStorage.address, [])
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

const verify = async (contractAddress: Address, args: any[]) => {
  console.log('Verifying...')
  try {
    await run('verify:verify', {
      address: contractAddress,
      constructorArguments: args,
    })
  } catch (error: any) {
    if (error.message.toLowerCase().includes('already verified')) {
      console.log('already verified!')
    } else {
      console.error(error)
    }
  }
}
