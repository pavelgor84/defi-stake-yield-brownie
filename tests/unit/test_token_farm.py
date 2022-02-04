# from lib2to3.pgen2 import token
from lib2to3.pgen2 import token
from brownie import network, exceptions
from scripts.helpful_scripts import (
    LOCAL_BLOCKCHAIN_ENVIRONMENTS,
    get_account,
    get_contract,
    INITIAL_VALUE,
)
from scripts.deploy import deploy_token_farm_and_dapp_token
import pytest
from web3 import Web3


def test_set_price_feed_contract():
    # Arrange
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for unit testing")
    account = get_account()
    non_owner = get_account(index=2)
    token_farm, dapp_token = deploy_token_farm_and_dapp_token()
    price_feed_address = get_contract("dai_usd_price_feed")
    # Act
    token_farm.setPriceFeedContract(
        dapp_token.address, price_feed_address, {"from": account}
    )
    # Assert
    assert token_farm.tokenPriceFeedMapping(dapp_token.address) == price_feed_address
    with pytest.raises(exceptions.VirtualMachineError):
        token_farm.setPriceFeedContract(
            dapp_token.address, price_feed_address, {"from": non_owner}
        )


def test_stake_tokens(amount_staked):
    # Arrange
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for unit testing")
    account = get_account()
    token_farm, dapp_token = deploy_token_farm_and_dapp_token()
    amount_to_stake = Web3.toWei(1, "ether")
    # Act
    tx = dapp_token.approve(token_farm.address, amount_staked, {"from": account})
    tx.wait(1)
    tx2 = token_farm.stakeTokens(amount_staked, dapp_token.address, {"from": account})
    tx2.wait(1)

    # Assert
    assert (
        token_farm.stakingBalance(dapp_token.address, account.address) == amount_staked
    )
    assert token_farm.uniqueTokenStaked(account.address) == 1
    assert token_farm.stakers(0) == account.address
    return token_farm, dapp_token


def test_issue_tokens(amount_staked):
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for unit testing")
    account = get_account()
    token_farm, dapp_token = test_stake_tokens(amount_staked)
    starting_balance = dapp_token.balanceOf(account.address)
    # Act
    token_farm.issueTokens({"from": account})
    # Arrange
    assert dapp_token.balanceOf(account.address) == starting_balance + INITIAL_VALUE


def test_unstake_tokens(amount_staked):
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for unit testing")
    account = get_account()
    token_farm, dapp_token = test_stake_tokens(amount_staked)
    dappToken_user_balance = dapp_token.balanceOf(account.address)
    token_farm_dappToken_balance = token_farm.stakingBalance(
        dapp_token.address, account.address
    )
    # Act
    tx1 = token_farm.unstakeTokens(dapp_token.address, {"from": account})
    tx1.wait(1)
    # Assert
    assert (
        dapp_token.balanceOf(account.address)
        == dappToken_user_balance + token_farm_dappToken_balance
    )
    assert token_farm.stakingBalance(dapp_token.address, account.address) == 0
    assert token_farm.uniqueTokenStaked(account.address) == 0
