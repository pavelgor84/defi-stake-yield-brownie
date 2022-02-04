import { Token } from "../Main"
import { Box, makeStyles } from "@material-ui/core"
import { Tab } from "@material-ui/core"
import { TabContext, TabList, TabPanel } from "@material-ui/lab"
import { useState } from "react"
import { WalletBalance } from "./WalletBalance"
import { StakeForm } from "./StakeForm"


const useStyles = makeStyles((theme) => ({
    tabContent: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: theme.spacing(4)

    },
    box: {
        backgroundColor: "white",
        borderRadius: "25px",

    },
    header: {
        color: "white"
    }
}))


interface YourWalletProps {
    supportedTokens: Array<Token>

}

export const YourWallet = ({ supportedTokens }: YourWalletProps) => {
    const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(0)
    const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setSelectedTokenIndex(parseInt(newValue));
    }

    const classes = useStyles()
    return (
        <Box>
            <h2 className={classes.header}>Your wallet data</h2>
            <Box className={classes.box}>
                <TabContext value={selectedTokenIndex.toString()}>
                    <TabList onChange={handleChange} aria-label="stake form tabs">
                        {supportedTokens.map((token, index) => {
                            return (
                                <Tab label={token.name} value={index.toString()} />
                            )

                        })}


                    </TabList>
                    {supportedTokens.map((token, index) => {
                        return (
                            <TabPanel value={index.toString()}>
                                <div className={classes.tabContent}>
                                    <WalletBalance token={token} />
                                    <StakeForm token={token} />
                                </div>

                            </TabPanel>
                        )
                    })}

                </TabContext>

            </Box>
        </Box>
    )
}