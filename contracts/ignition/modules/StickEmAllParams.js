const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("StickEmAllParams", (m) => {
    const addr = m.getParameter("priceFeed", "0x0");

    const params = m.contract(
        "StickEmAllParams", [addr]
    );

    return { params };
});
