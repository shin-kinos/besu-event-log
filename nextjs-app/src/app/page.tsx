
'use client'; // Omajinai

import Image        from 'next/image';
import styles       from './page.module.css';
import { useState } from 'react';
import { BrowserProvider, Contract, Eip1193Provider, ContractEventName, EventLog } from 'ethers';

// Declare interface Window to enable 'window.ethereum'
declare global {
  interface Window {
    ethereum: Eip1193Provider
  }
}

// Smart contract address
// IMPORTANT: SET YOUR OWN CONTRACT ADDRESS HERE !!!
const contractAddress = '0x42699A7612A82f1d9C36148af9C77354759b210b';
const contractAbi     = [
  // Function to say hello to the Besu private net
  'function greeting() pure returns ( string memory )',
  // Function to update number
  'function updateNumber( int256 newNumber )',
  // Function to get current number
  'function getCurrentNumber() public view returns ( int256 )',
  // Event to get log of number updates
  'event NumberUpdated( uint timestamp, address signer, int256 newNumber )'
];

async function getContract(): Promise<Contract> {
  // Define provider
  const provider = new BrowserProvider( window.ethereum );
  //console.log( provider )

  // Get signer
  const signer = await provider.getSigner();
  //console.log( signer )

  // Create a contract
  const contract = new Contract( contractAddress, contractAbi, signer );
  console.log( contract )

  return contract;
}

// Function to call greeting()
async function callGreeting() {
  // Blockchain go!
  try {
      // Get contract
      const contract = await getContract();

      // Call greeting() function!
      const result = await contract[ 'greeting' ]();
      if ( !result ) { throw new Error( 'Failed to call greeting() function!' ); }
      //console.log( result );

      alert( result )

  } catch( error ) {
    const errorMessage = `Bah! Something bad happend!: "${error}".`;
    console.error( errorMessage );
  }
}

// Function to call updateNumber()
async function callUpdateNumber( inputNumber: number ) {
  // Blockchain go!
  try {
    // Get contract
    const contract = await getContract();

    // Call addNumber() function!
    const result = await contract[ 'updateNumber' ]( inputNumber );
    if ( !result ) { throw new Error( 'Failed to call updateNumber() function!' ); }

    alert( `AHOY! Number was updated to ${inputNumber}!` );

  } catch( error ) {
    const errorMessage = `Bah! Something bad happend!: "${error}".`;
    console.error( errorMessage );
  }
}

// Function to get current Number
async function callGetCurrentNumber() {
  // Blockchain go!
  try {
    // Get contract
    const contract = await getContract();

    // Call getCurrentNumber() function!
    const result = await contract[ 'getCurrentNumber' ]();
    if ( !result ) { throw new Error( 'Failed to call getCurrentNumber() function!' ); }

    alert( `AHOY! Current number is ${result}!` );

  } catch( error ) {
    const errorMessage = `Bah! Something bad happend!: "${error}".`;
    console.error( errorMessage );
  }
}

// Function to call event NumberUpdated()
async function getNumbersLog() {
  // Blockchain go!
  try {
    // Get contract
    const contract = await getContract();

    // Call getCurrentNumber() event!
    const eventName: ContractEventName = "NumberUpdated";
    const logs = await contract.queryFilter( eventName );
    //console.log( logs )

    // Iterate the result to table
    var tableContent = [];
    for( var log of logs ) {
      // Extract logs to get values
      let   timestamp = ( log as EventLog ).args[ 0 ];
      const signer    = ( log as EventLog ).args[ 1 ];
      const number    = ( log as EventLog ).args[ 2 ];
      // Convert Unix-timestamp to date
      timestamp = Number( timestamp );
      timestamp = new Date( timestamp * 1000 ).toUTCString();
      // Push them to the array
      const row = { timestamp: timestamp, signer: signer, number: number };
      tableContent.push( row );
    }

    // Reverse the elems: present → past
    tableContent.reverse();

    return tableContent;

  } catch( error ) {
    const errorMessage = `Bah! Something bad happend!: "${error}".`;
    console.error( errorMessage );

    return [];
  }
}

export default function Home() {
  // Input values handling as omajinai
  const [ inputNumber, setValue ] = useState< number >( 5 );
  const handleInputChange = ( event: React.ChangeEvent<HTMLInputElement> ) => {
      setValue( Number( event.target.value ) );
  };

  // Sent input number to callUpdateNumber()
  function handleSubmitNumber() {
    callUpdateNumber( inputNumber );
  }

  // Input values of log table
  const [ tableContent, setTable ] = useState< any[] >( [] );
  const handleTableClick = async () => {
    setTable( await getNumbersLog() )
  }

  return (
    <div className={ styles.page }>
      <main className={ styles.main }>

        { /* NEXT.js and MetaMask logos */ }
        <div style={{ display: "flex", gap: "48px" }}>
          <Image
            className={ styles.logo }
            src="/next.svg"
            alt="Next.js logo"
            width={ 180 }
            height={ 38 }
            priority
          />
          <Image
            className={ styles.logo }
            src="/MetaMask-logo-developer-black.svg"
            alt="MetaMask dev logo"
            width={ 180 }
            height={ 38 }
            priority
          />
        </div>

        { /* MetaMask fox logo */ }
        Click the fox to say hello to the Besu private net!
        <Image
          style={{ cursor: 'pointer' }}
          src="/MetaMask-icon-fox-developer.svg"
          alt="MetaMask fox logo"
          width={ 120 }
          height={ 120 }
          onClick={ callGreeting }
        />

        { /* Update number form */ }
        <label>
          Submit a number to the Blockchain!
          <input
            type="number"
            value={ inputNumber }
            onChange={ handleInputChange }
            style={{ marginLeft: '8px', marginRight: '16px' }}
          />
          <button
            onClick={ handleSubmitNumber }>
            Sumbit!
          </button>
        </label>

        { /* Number logs button */ }
        <button
          style={{ padding: '8px' }}
          onClick={ handleTableClick }>
          See numbers log!
        </button>

        { /* Number logs table */ }
        <div style={{ maxHeight: '200px', overflowY: 'auto' }} >
          <table border={ 1 } style={{ width: '100%', textAlign: 'center'}} >
            <thead>
              <tr>
                <th style={{ padding: '5px' }}>Timestamp</th>
                <th style={{ padding: '5px' }}>Signer</th>
                <th style={{ padding: '5px' }}>Number</th>
              </tr>
            </thead>
            <tbody>
              { tableContent.map(( row, i ) => (
                <tr key={ i }>
                  <td style={{ padding: '5px' }}>{ row.timestamp }</td>
                  <td style={{ padding: '5px' }}>{ row.signer }</td>
                  <td style={{ padding: '5px' }}>{ row.number }</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <footer className={ styles.footer }>
        WE FUCKED UP - BREEZE OUT BRAD
      </footer>
    </div>
  );
}
