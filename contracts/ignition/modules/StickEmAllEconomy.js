const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("StickEmAllEconomy", (m) => {
    const addr = m.getParameter("worldsManagement", "0x0");

    const economy = m.contract(
        "StickEmAllEconomy", [addr]
    );

    return { economy };
});
