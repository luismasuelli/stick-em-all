const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("StickEmAllWorldsManagement", (m) => {
    const addr = m.getParameter("worlds", "0x0");

    const mock = m.contract(
        "StickEmAllWorldsManagement", [addr]
    );

    return { mock };
});
