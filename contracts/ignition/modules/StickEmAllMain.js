const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("StickEmAllMain", (m) => {
    const economyAddress = m.getParameter("economy", "0x0");
    const vrfAddress = m.getParameter("vrf", "0x0");
    const keyHash = m.getParameter("keyHash", "0x0");
    const subscriptionId = m.getParameter("subscription", "0x0");

    const main = m.contract(
        "StickEmAllMain", [economyAddress, vrfAddress, keyHash, subscriptionId]
    );

    return { main };
});
