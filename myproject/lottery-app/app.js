const enableButton = document.getElementById('enable-button');
const prizePool = document.getElementById('prize-pool');
const peopleAddresses = document.getElementById('numPlayers');
const playersList = document.getElementById('playersList');
const managerAd = document.getElementById('managerAddress')
const contractAddress = '0x671a75978293f2b42f33471d100d0f3bf4cb20e9';
const abi = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "enter",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getManager",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getNumPlayers",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getPlayerAddresses",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getPrizePool",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "hasEntered",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "manager",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "pickWinner",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "players",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

// Initialize Web3
const web3 = new Web3(window.ethereum);
const lottery = new web3.eth.Contract(abi, contractAddress);
lottery.setProvider(window.ethereum);

// Enable Metamask
enableButton.onclick = async () => {
	if(typeof window.ethereum !== 'undefined'){
	  await ethereum.request({ method: 'eth_requestAccounts'});
	}
	else{
	  alert("Metamask is not available... Please install it to continue")
	}
  }

document.getElementById("enter-button").style.display = "inline-block";
document.getElementById("enter-button").style.visibility = "visible";
document.getElementById("pick-winner-button").style.display = "none";
document.getElementById("pick-winner-button").style.visibility = "hidden";

// Call updateUI to update data
window.addEventListener('load', async () => {
	await updateUI();

	// Checks changed accounts
    ethereum.on('accountsChanged', async (accounts) => {
        // Update UI
        await updateUI();
    });
});

// Updates UI data in real-time
async function updateUI() {
    const numPlayersValue = await lottery.methods.getNumPlayers().call();
	const managerAddressValue = await lottery.methods.getManager().call();
	const playerAddresses = await lottery.methods.getPlayerAddresses().call();
	const prizePoolValue = await lottery.methods.getPrizePool().call();
	const prizePoolV = web3.utils.fromWei(prizePoolValue, 'ether');

    prizePool.innerHTML = prizePoolV;
    peopleAddresses.innerHTML = numPlayersValue;
	managerAddress.innerHTML = managerAddressValue.substring(0, 5) + "..." + managerAddressValue.substring(38, 42);
	playersList.innerHTML = "";

    playerAddresses.forEach(address => {
        const listItem = document.createElement('li');
        listItem.textContent = address.substring(0, 5) + "..." + address.substring(38, 42);
        playersList.appendChild(listItem);
    });

    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

    if (accounts.length === 0) {
        // No connected account, show "Enter" button
    document.getElementById("enter-button").style.display = "inline-block";
	document.getElementById("enter-button").style.visibility = "visible";
	document.getElementById("pick-winner-button").style.display = "none";
	document.getElementById("pick-winner-button").style.visibility = "hidden";
        return;
    }

    const currentUser = accounts[0];

    // Update button
    const enterButton = document.getElementById('enter-button');
    const pickWinnerButton = document.getElementById('pick-winner-button');

    if (currentUser.toLowerCase() === managerAddressValue.toLowerCase()) {
        // Owner is logged in
    document.getElementById("enter-button").style.display = "none";
	document.getElementById("enter-button").style.visibility = "hidden";
	document.getElementById("pick-winner-button").style.display = "inline-block";
	document.getElementById("pick-winner-button").style.visibility = "visible";
    } else {
        // User is logged in
    document.getElementById("enter-button").style.display = "inline-block";
	document.getElementById("enter-button").style.visibility = "visible";
	document.getElementById("pick-winner-button").style.display = "none";
	document.getElementById("pick-winner-button").style.visibility = "hidden";
    }
}


// Enter Lottery button
async function enterLottery() {
    try {
        // Send transaction
		const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const result = await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('1', 'ether'),
            gas: '500000',
        });

        // Update UI after transaction
        await updateUI();

        // Alert
        console.log(result);
        /*alert('Entered the lottery successfully!');*/
    } catch (error) {
        /*console.error('Error entering the lottery:', error.message);
        alert('Error entering the lottery. Insufficient funds!');*/
    }
}

// Pick Winner button
async function pickWinner() {
    try {
        // Send transaction
		const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const result = await lottery.methods.pickWinner().send({
            from: accounts[0],
            gas: '500000',
        });

        // Update UI after transaction
        await updateUI();

        // Alert
        console.log(result);
        /*alert('Winner picked successfully!');*/
    } catch (error) {
        /*console.error('Error picking the winner:', error.message);
        alert('Error picking winner. Must have at least 1 player!');*/
    }
}