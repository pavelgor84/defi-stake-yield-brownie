import TokenFarm from "../chain-info/contracts/TokenFarm.json"
import networkMapping from "../chain-info/deployments/map.json"
import ERC20 from "../chain-info/contracts/MockERC20.json"
import { useEthers, useContractFunction } from "@usedapp/core"
import { constants, utils } from "ethers"
import { Contract } from "@ethersproject/contracts"
import { useEffect, useState } from "react"




export const UseStakeTokens = (tokenAddress: string) => {
    //address
    //abi
    //TokenFarm address
    //console.log("TEST")
    const { chainId } = useEthers()
    const { abi } = TokenFarm
    const tokenFarmAddress = chainId ? networkMapping[String(chainId)]["TokenFarm"][0] : constants.AddressZero
    const tokenFarmInterface = new utils.Interface(abi)
    const tokenFarmContract = new Contract(tokenFarmAddress, tokenFarmInterface)

    const erc20abi = ERC20.abi
    const erc20Interface = new utils.Interface(erc20abi)
    const erc20Contract = new Contract(tokenAddress, erc20Interface)

    const [stakeAmount, setStakeAmount] = useState("0")

    //approve
    const { send: approveERC20send, state: approveAndStakeERC20state } = useContractFunction(erc20Contract, "approve", { transactionName: "Approve ERC20 token transfer", })
    const approveAndStake = (amount: string) => {
        setStakeAmount(amount)
        approveERC20send(tokenFarmAddress, amount)
    }
    //stake
    const { send: stakeSend, state: stakeState } = useContractFunction(tokenFarmContract, "stakeTokens", { transactionName: "Stake tokens", })
    useEffect(
        () => {
            console.log("ApproveState: " + approveAndStakeERC20state)
            if (approveAndStakeERC20state.status === "Success") {
                stakeSend(stakeAmount, tokenAddress)
            }
        }, [approveAndStakeERC20state, stakeAmount, tokenAddress]
    )
    const [state, setState] = useState(approveAndStakeERC20state)
    useEffect(
        () => {
            if (approveAndStakeERC20state.status === "Success") {
                console.log("StakeState: " + stakeState)
                setState(stakeState)
            }
            else {
                setState(approveAndStakeERC20state)
            }

        }, [approveAndStakeERC20state, stakeState]
    )


    return { approveAndStake, state }


}