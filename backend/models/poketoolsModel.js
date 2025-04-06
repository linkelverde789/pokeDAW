const db = require("../config/db");

async function calculator() {
    try {
        const result = await db.many('select * from pokemon');
        return result;
    } catch (error) {
        return null;
    }
}

module.exports = {
    calculator,
};