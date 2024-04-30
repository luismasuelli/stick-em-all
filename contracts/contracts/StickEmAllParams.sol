// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * Manages all the underlying parameters of our Stick'em All
 * ecosystem. This includes ownership, costs, and withdrawal.
 */
contract StickEmAllParams is Ownable {
  /**
   * The address that will receive the collected earnings.
   * Ideally, it should be a user address (it is not allowed
   * for it to be the zero address), but it can be a contract
   * address instead (specially if the receiving contract has
   * some sort of "split" logic on it).
   */
  address public earningsReceiver;

  /**
   * The total collected (and non-withdrawn) earnings so far.
   * In other words, the remaining balance (expressed in the
   * native token for the blockchain).
   */
  uint256 public earningsBalance;

  /**
   * The cost of minting a world EXPRESSED IN USD CENTS instead of
   * being expressed in the blockchain's native token. Conversions
   * from native cost to token cost will be done by using a proper
   * Data Feed (or a mock, if deploying in a local blockchain).
   */
  uint256 public worldMintingFiatCost;

  /**
   * Initialization involves the following arguments:
   * 1. The earnings receiver will be the sender itself.
   * 2. The world minting fiat cost will be specified.
   */
  constructor(uint256 _worldMintingFiatCost) Ownable(msg.sender) {
    earningsReceiver = msg.sender;
    worldMintingFiatCost = _worldMintingFiatCost;
  }

  /**
   * Sets the new world minting fiat cost (expressed in USD cents).
   */
  function setWorldMintingFiatCost(uint256 _worldMintingFiatCost) public onlyOwner {
    worldMintingFiatCost = _worldMintingFiatCost;
  }

  /**
   * Sets the new earnings receiver address. This action is only
   * allowed to the owner of the contract.
   */
  function setEarningsReceiver(address _earningsReceiver) public onlyOwner {
    require(_earningsReceiver != address(0), "StickEmAllParams: Invalid receiver");
    earningsReceiver = _earningsReceiver;
  }

  /**
   * Withdraws a specific amount.
   */
  function earningsWithdraw(uint256 _amount) public onlyOwner {
    require(_amount <= earningsBalance, "StickEmAllParams: Insufficient funds");
    earningsBalance -= _amount;
    payable(earningsReceiver).transfer(_amount);
  }
}
