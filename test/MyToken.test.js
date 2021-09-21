const Token = artifacts.require('MyToken');

var chai = require('chai');

const BN = web3.utils.BN;
const chaiBN = require('chai-bn')(BN);
chai.use(chaiBN);

var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const expect = chai.expect;

require('dotenv').config({ path: '../.env' });

contract('Token Test', async (accounts) => {
  const [initialHolder, recipient, anotherAccount] = accounts;

  beforeEach(async () => {
    this.token = await Token.new(process.env.INITIAL_TOKENS);
  });

  it('All tokens should be in my account', async () => {
    let instance = this.token;
    let totalSupply = await instance.totalSupply();
    //eventually is from chai-as-promised replacing await in expect function
    await expect(
      instance.balanceOf(initialHolder)
    ).to.eventually.be.a.bignumber.equal(totalSupply);
  });

  it('Can send tokens from Account 1 to Account 2', async () => {
    const sendTokens = 1;
    let instance = this.token;
    let totalSupply = await instance.totalSupply();

    await expect(
      instance.balanceOf(initialHolder)
    ).to.eventually.be.a.bignumber.equal(totalSupply);
    await expect(instance.transfer(recipient, sendTokens)).to.eventually.be
      .fulfilled;
    await expect(
      instance.balanceOf(initialHolder)
    ).to.eventually.be.a.bignumber.equal(totalSupply.sub(new BN(sendTokens)));
    await expect(
      instance.balanceOf(recipient)
    ).to.eventually.be.a.bignumber.equal(new BN(sendTokens));
  });

  it('is not possible to send more tokens than account 1 has', async () => {
    let instance = this.token;
    let balanceOfAccount = await instance.balanceOf(initialHolder);

    await expect(instance.transfer(recipient, new BN(balanceOfAccount + 1))).to
      .eventually.be.rejected;
    await expect(
      instance.balanceOf(initialHolder)
    ).to.eventually.be.a.bignumber.equal(balanceOfAccount);
  });
});
