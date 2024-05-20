const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("StickEmAllWorldsManagement", (m) => {
    const addr = m.getParameter("worlds", "0x0");

    const worldsManagement = m.contract(
        "StickEmAllWorldsManagement", [addr]
    );

    return { worldsManagement };
});
