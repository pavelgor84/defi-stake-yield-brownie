import yaml, json, os, shutil

from brownie import DappToken, TokenFarm, network, config
from scripts.helpful_scripts import get_account, get_contract
from web3 import Web3

KEEP_BALANCE = Web3.toWei(100, "ether")


def deploy_token_farm_and_dapp_token(frontend_update=False):
    account = get_account()
    dapp_token = DappToken.deploy({"from": account})
    token_farm = TokenFarm.deploy(
        dapp_token.address,
        {"from": account},
        publish_source=config["networks"][network.show_active()].get("verify", False),
    )
    tx = dapp_token.transfer(
        token_farm.address, dapp_token.totalSupply() - KEEP_BALANCE, {"from": account}
    )
    tx.wait(1)
    # dapp_toekn, weth_token, fau_token (pretend DAI)

    # assert token_farm.uniqueTokenStaked(account.address) == 1
    # assert token_farm.stakers(0) == account.address
    weth_token = get_contract("weth_token")
    fau_token = get_contract("fau_token")
    dict_of_allowed_tokens = {
        dapp_token: get_contract("dai_usd_price_feed"),
        fau_token: get_contract("dai_usd_price_feed"),
        weth_token: get_contract("eth_usd_price_feed"),
    }

    add_allowed_tokens(token_farm, dict_of_allowed_tokens, account)

    if frontend_update:
        frontend_update()

    return token_farm, dapp_token


def add_allowed_tokens(token_farm, dict_of_allowed_token, account):
    for token in dict_of_allowed_token:
        add_tx = token_farm.addAllowedTokens(token.address, {"from": account})
        add_tx.wait(1)
        set_tx = token_farm.setPriceFeedContract(
            token.address, dict_of_allowed_token[token], {"from": account}
        )
        set_tx.wait(1)
        return token_farm


def frontend_update():
    # Send the folder of the latest buld(need to know DappToken address in frontend)
    copy_folders_to_front_end("./build", "./front_end/src/chain-info")
    # Sending the frontend our config in JSON format
    with open("brownie-config.yaml", "r") as brownie_config:
        conf_dict = yaml.load(brownie_config, Loader=yaml.FullLoader)
        with open("./front_end/src/brownie-config.json", "w") as brownie_config_json:
            json.dump(conf_dict, brownie_config_json)
    print("Frontend updated!")


def copy_folders_to_front_end(src, dest):
    if os.path.exists(dest):
        shutil.rmtree(dest)
    shutil.copytree(src, dest)


def main():
    deploy_token_farm_and_dapp_token()
