const { selectAllItems
} = require("../models/miscModel");


async function getAllItems(req, res) {
    const { holdable } = req.query;

    if (holdable !== undefined && (holdable !== 'true' && holdable !== 'false')) {
        return res.json({ error: 'Invalid value for holdable, expected "true" or "false"' });
    }

    const holdableBool = holdable !== undefined ? holdable === 'true' : null;

    try {
        let allItems = await selectAllItems(holdableBool);
        return res.json(allItems.map(item => {
            return {
                id: item.id_item,
                holdable: item.holdable,
                text: {
                    es: {
                        name: item.name_es,
                        description: item.description_es,
                    },
                    en: {
                        name: item.name_en,
                        description: item.description_en,
                    },
                }
            };
        }));
    } catch (error) {
        console.error('Error fetching items:', error);
        return res.status(500).json({ error: 'Failed to fetch items' });
    }
}



module.exports = { getAllItems};