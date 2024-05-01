// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

/**
 * This is the main entry point of the Stick 'em All. Brands are
 * defined here (as NFTs), and their metadata is also defined here
 * in the format that is supported at OpenSea or similar markets.
 */
contract StickEmAllWorlds is ERC721 {
  /**
   * This constant will be used as the first cost parameter to use:
   * the cost of world registration.
   */
  bytes32 public constant WorldRegistrationCostParameter = keccak256("Costs::WorldRegistration");

  /**
   * This is a StickEmAllParams deployed contract. It will receive
   * all the earnings that are gathered by creating worlds and albums.
   * It will only be set on deployment.
   */
  address private paramsContract;

  /**
   * Initialization only involves setting the underlying parameters
   * contract, and nothing else.
   */
  constructor(address _paramsContract) public ERC721("Stick 'em All Worlds", "STICKW") {
    paramsContract = _paramsContract;
  }
}
