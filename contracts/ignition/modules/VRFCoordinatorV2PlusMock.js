const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("VRFCoordinatorV2PlusMock", (m) => {
    const mock = m.contract(
        "VRFCoordinatorV2PlusMock", []
    );

    return { mock };
});
