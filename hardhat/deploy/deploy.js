
const hardhat = require( 'hardhat' );

const GREEN = '\x1b[32m';
const RESET = '\x1b[0m';

async function main() {

    // Deploy 'SampleTracker'
    let   contract = await hardhat.ethers.getContractFactory( 'SampleTracker' );
    let   result   = await contract.deploy();
    await result.waitForDeployment();
    let   resultAddress = await result.getAddress();
    console.log( 'Contract SampleTracker was deployed to: ' + GREEN + resultAddress + RESET );
}

main()
    .then( () => process.exit( 0 ) )
        .catch( ( error ) => {
            console.log( error );
            process.exit( 1 );
        } );
