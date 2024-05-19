// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "@chainlink/contracts/src/v0.8/vrf/dev/interfaces/IVRFCoordinatorV2Plus.sol";

contract VRFCoordinatorV2PlusMock is IVRFCoordinatorV2Plus {
    function acceptSubscriptionOwnerTransfer(uint256 subId) external {
        // Mock.
    }

    function addConsumer(uint256 subId, address consumer) external {
        // Mock.
    }

    function createSubscription() external returns (uint256 subId) {
        // Mock.
        return 0;
    }

    function fundSubscriptionWithNative(uint256 subId) external payable {
        // Mock.
    }

    function cancelSubscription(uint256 subId, address to) external {
        // Mock.
    }

    function getSubscription(uint256 subId) external view returns (
        uint96 balance, uint96 nativeBalance, uint64 reqCount, address owner, address[] memory consumers
    ) {
        // Mock.
    }

    function getActiveSubscriptionIds(uint256 startIndex, uint256 maxCount) external view returns (uint256[] memory) {
        return new uint256[](0);
    }

    function pendingRequestExists(uint256 subId) external view returns (bool) {
        return false;
    }

    function removeConsumer(uint256 subId, address consumer) external {
        // Mock.
    }

    function requestRandomWords(VRFV2PlusClient.RandomWordsRequest calldata req) external returns (uint256 requestId) {
        // Mock.
        return 0;
    }

    function requestSubscriptionOwnerTransfer(uint256 subId, address newOwner) external {
        // Mock.
    }
}