import { assert, expect } from 'chai'
import { deployments, ethers, getNamedAccounts, network } from 'hardhat'
import { Address } from 'hardhat-deploy/types'
import { developmentChains } from '../../helper-hardhat-config'
import { FundMe, MockV3Aggregator } from '../../typechain-types'

!developmentChains.includes(network.name)
  ? describe.skip
  : describe('FundMe', async () => {
      let fundMe: FundMe
      let deployer: Address
      let user2: Address
      let mockV3Aggreagtor: MockV3Aggregator
      const sendValue = ethers.utils.parseEther('1')
      beforeEach(async () => {
        const [_user1, _user2] = await ethers.getSigners()
        user2 = await _user2.getAddress()
        deployer = (await getNamedAccounts()).deployer
        // assert.equal(await _user1.getAddress(), deployer)

        //deploy
        await deployments.fixture(['all'])
        fundMe = await ethers.getContract('FundMe', deployer)
        mockV3Aggreagtor = await ethers.getContract(
          'MockV3Aggregator',
          deployer
        )
      })
      describe('constructor', () => {
        it('set the aggregator addresses correctly', async () => {
          const res = await fundMe.getPriceFeed()
          assert.equal(res, mockV3Aggreagtor.address)
        })
      })
      describe('fund', () => {
        it('Fails if no efficient eth', async () => {
          await expect(fundMe.fund()).to.be.revertedWith(
            'You need to spend more ETH!'
          )
        })
        it('the fund structure should work', async () => {
          await fundMe.fund({ value: sendValue })
          const res = await fundMe.getAddressToAmountFunded(deployer)
          assert.equal(res.toString(), sendValue.toString())
        })
        it('funder should be add correctly', async () => {
          await fundMe.fund({ value: sendValue })
          const funder = await fundMe.getFunder(0)
          assert.equal(funder, deployer)
        })
      })
      describe('withdraw', () => {
        beforeEach(async () => {
          await fundMe.fund({ value: sendValue })
        })
        it('withdraws ETH from a single funder', async () => {
          const startingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          )
          const startingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          )

          // Act
          // const transactionResponse = await fundMe.withdraw()
          const transactionResponse = await fundMe.cheaperWithdraw()
          const transactionReceipt = await transactionResponse.wait()
          const { gasUsed, effectiveGasPrice } = transactionReceipt
          const gasCost = gasUsed.mul(effectiveGasPrice)

          const endingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          )
          const endingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          )

          // Assert
          // Maybe clean up to understand the testing
          assert.equal(endingFundMeBalance.toString(), '0')
          assert.equal(
            startingFundMeBalance.add(startingDeployerBalance).toString(),
            endingDeployerBalance.add(gasCost).toString()
          )
        })
        it('is allows us to withdraw with multiple funders', async () => {
          // Arrange
          const accounts = await ethers.getSigners()
          for (let i = 1; i < 6; i++) {
            await fundMe.connect(accounts[i]).fund({ value: sendValue })
          }
          const startingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          )
          const startingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          )

          // Act
          const transactionResponse = await fundMe.cheaperWithdraw()
          // Let's comapre gas costs :)
          // const transactionResponse = await fundMe.withdraw()
          const transactionReceipt = await transactionResponse.wait()
          const { gasUsed, effectiveGasPrice } = transactionReceipt
          const withdrawGasCost = gasUsed.mul(effectiveGasPrice)
          console.log(`GasCost: ${withdrawGasCost}`)
          console.log(`GasUsed: ${gasUsed}`)
          console.log(`GasPrice: ${effectiveGasPrice}`)
          const endingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          )
          const endingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          )
          // Assert
          assert.equal(
            startingFundMeBalance.add(startingDeployerBalance).toString(),
            endingDeployerBalance.add(withdrawGasCost).toString()
          )
          // Make a getter for storage variables
          await expect(fundMe.getFunder(0)).to.be.reverted

          for (let i = 1; i < 6; i++) {
            assert.equal(
              (
                await fundMe.getAddressToAmountFunded(accounts[i].address)
              ).toString(),
              '0'
            )
          }
        })
        it('Only allows the owner to withdraw', async function () {
          const accounts = await ethers.getSigners()
          await expect(
            fundMe.connect(accounts[1]).withdraw()
          ).to.be.revertedWithCustomError(fundMe, 'FundMe__NotOwner')
        })
      })
    })
