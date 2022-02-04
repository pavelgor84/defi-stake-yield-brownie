import { formatUnits } from "@ethersproject/units";
import { Button, Input, CircularProgress, Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useEthers, useNotifications, useTokenBalance } from "@usedapp/core";
import React, { useEffect, useState } from "react";
import { Token } from "../Main";
import { UseStakeTokens } from "../../hooks/UseStakeTokens";
import { utils } from "ethers";

export interface StakeFormProps {
    token: Token
}

export const StakeForm = ({ token }: StakeFormProps) => {
    const [amount, setAmount] = useState<number | string | Array<number | string>>(0)
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newAmount = event.target.value === "" ? "" : Number(event.target.value)
        setAmount(newAmount)
        console.log(newAmount)
    }
    const { notifications } = useNotifications()

    const { address } = token
    const { account } = useEthers()
    const tokenBalance = useTokenBalance(address, account)
    const formattedTokenBalance: number = tokenBalance ? parseFloat(formatUnits(tokenBalance, 18)) : 0

    const { approveAndStake, state: approveAndStakeERC20state } = UseStakeTokens(String(address))



    const handleStakeSubmit = () => {
        const amountAsWei = utils.parseEther(amount.toString())
        console.log(amountAsWei.toString())
        return approveAndStake(amountAsWei.toString())
    }

    const isMining = approveAndStakeERC20state.status === "Mining"

    const [erc20ApproveSuccess, setErc20ApproveSucess] = useState(false)
    const [erc20StakeSuccess, setErc20StakeSucess] = useState(false)
    const handleClose = () => {
        setErc20ApproveSucess(false)
        setErc20StakeSucess(false)
    }

    useEffect(() => {
        if (notifications.filter(
            (notification) =>
                notification.type === "transactionSucceed" && notification.transactionName === "Approve ERC20 token transfer"
        ).length > 0) {
            setErc20ApproveSucess(true)
            setErc20StakeSucess(false)
        }
        if (notifications.filter(
            (notification) =>
                notification.type === "transactionSucceed" && notification.transactionName === "Stake tokens"
        ).length > 0) {
            setErc20StakeSucess(true)
            setErc20ApproveSucess(false)
        }
    }, [notifications])

    return (
        <>
            <div>
                <Input onChange={handleChange} />
                <Button onClick={handleStakeSubmit}
                    color="primary"
                    size="large"
                    disabled={isMining}>
                    {isMining ? <CircularProgress size={26} /> : "Stake this asset!"}</Button>

                <Snackbar
                    open={erc20ApproveSuccess}
                    autoHideDuration={5000}
                    onClose={handleClose}>
                    <Alert onClose={handleClose} severity="success"> ERC-20 token transfer approved. Now waiting for transaction...</Alert>
                </Snackbar>
                <Snackbar
                    open={erc20StakeSuccess}
                    autoHideDuration={5000}
                    onClose={handleClose}>
                    <Alert onClose={handleClose} severity="success"> Tokens staked!</Alert>
                </Snackbar>
            </div>


        </>
    )

}