import { useEthers } from "@usedapp/core";
import { Button, makeStyles } from "@material-ui/core";
import { mergeClasses } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(4),
        display: "flex",
        justifyContent: "flex-end",
        gap: theme.spacing(1)
    }
}))

export const Header = () => {
    const { account, activateBrowserWallet, deactivate } = useEthers();
    const classes = useStyles()
    //const isConnected = account !== undefined;
    return (
        <div className={classes.container}>
            <div>
                {!account && <Button variant="contained" onClick={() => activateBrowserWallet()}> Connect </Button>}
                {account && <Button variant="contained" onClick={deactivate}> Disconnect {account.slice(0, 5)}...{account.slice(account.length - 5)} </Button>}
            </div>
        </div>

    )
}
//{!account && <button onClick={() => activateBrowserWallet()}> Connect </button>}
//{account && <p>Account: {account}</p>}

// {!account ? (<button color="primary" onClick={() => activateBrowserWallet()}> Connect </button>)
// :
// (<button color="primary" onClick={deactivate}> Disconnect </button>)}