const db = require("../config/db");


async function selectAllItems(holdable){

    let sql='SELECT * FROM items';

    try{
        if(holdable===null){
            return await db.manyOrNone(sql);
        }
        
        return await db.manyOrNone(`${sql} where holdable = $1`, [holdable]); 

    }catch(error){
        return null;
    }
}


module.exports = { selectAllItems };
