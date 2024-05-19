// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "@chainlink/contracts/src/v0.8/vrf/dev/interfaces/IVRFCoordinatorV2Plus.sol";
import "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";

/**
 * This is a mock resembling the V2Plus contract coordinator.
 */
contract VRFCoordinatorV2PlusMock is IVRFCoordinatorV2Plus {
    /**
     * The mocked request. Stuff like confirmations,
     * subscriptions or gas limits are not accounted.
     */
    struct MockedRequest {
        address requester;
        uint256 numWords;
        bytes extraArgs;
        bool fulfilled;
    }

    /**
     * The mocked requests.
     */
    mapping(uint256 => MockedRequest) private requests;

    /**
     * The id of the next request.
     */
    uint256 private nextRequestId = 1;

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
        requestId = nextRequestId++;
        requests[requestId] = MockedRequest({
            requester: msg.sender,
            numWords: req.numWords,
            extraArgs: req.extraArgs,
            fulfilled: false
        });
    }

    function requestSubscriptionOwnerTransfer(uint256 subId, address newOwner) external {
        // Mock.
    }

    function fulfillRandomWordsRequest(uint256 requestId, uint256[] memory randomWords) external {
        require(requests[requestId].requester != address(0), "VRFCoordinatorV2PlusMock: Invalid request");
        require(!requests[requestId].fulfilled, "VRFCoordinatorV2PlusMock: Request already fulfilled");
        requests[requestId].fulfilled = true;
        VRFConsumerBaseV2Plus(requests[requestId].requester).rawFulfillRandomWords(requestId, randomWords);
    }
}