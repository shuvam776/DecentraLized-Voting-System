import React from "react";

function MetaMaskConnect() {
    const[isConnecting,setIsConnecting] = React.useState(false);
    const onMetaMaskConnect = async () => {
        setIsConnecting(true);
        try{
            
            
        }catch(error){
            console.log(error);
        }
    }
    return (
        <div>
            <button>MetaMask Connect</button>
        </div>
    );
}

export default MetaMaskConnect;
