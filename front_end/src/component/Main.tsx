import { useEthers } from "@usedapp/core"
import helperConfig from "../config-helper.json"
import addressMap from "../chain-info/deployments/map.json"
import { constants } from "ethers"
import brownieConfig from "../brownie-config.json"
import dapp from "../dapp.png"
import eth from "../eth.png"
import dai from "../dai.png"
import { YourWallet } from "./yourWallet"
import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles((theme) => ({
    title: {
        color: theme.palette.common.white,
        textAlign: "center",
        padding: theme.spacing(4)
    }
}))

export type Token = {
    image: string,
    address: string,
    name: string
}

export const Main = () => {
    //Show Token values from the wallet
    //Get the addresses of the differnt tokens
    //Get the balance of the users wallet

    //send brownie-config to ./front_end/src folder
    //copy ./buid folder to front_end folder
    const classes = useStyles()
    const { chainId } = useEthers()
    const networkName = chainId ? helperConfig[chainId] : "dev"
    const dappTokenAddress = chainId ? addressMap[String(chainId)]["DappToken"][0] : constants.AddressZero
    const wethTokenAddress = chainId ? brownieConfig["networks"][networkName]["weth_token"] : constants.AddressZero
    const fauTokenAddress = chainId ? brownieConfig["networks"][networkName]["fau_token"] : constants.AddressZero

    const supportedTokens: Array<Token> = [
        {
            image: dapp,
            address: dappTokenAddress,
            name: "DAPP"
        },
        {
            image: eth,
            address: wethTokenAddress,
            name: "WETH"
        },
        {
            image: dai,
            address: fauTokenAddress,
            name: "DAI"
        }
    ]

    return (<>
        <h1 className={classes.title}>Stake and yield tokens platform</h1>
        <YourWallet supportedTokens={supportedTokens} />
    </>)
}