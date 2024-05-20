const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("StickEmAllWorlds", (m) => {
    const addr = m.getParameter("params", "0x0");

    const worlds = m.contract(
        "StickEmAllWorlds", [addr]
    );

    return { worlds };
});
