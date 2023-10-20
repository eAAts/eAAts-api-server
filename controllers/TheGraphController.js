const fetch = require("node-fetch");
const { subgraphQueryUrl } = require("../config/appConfig");
const eAAtsQueryEntities = require("../constants/eAAts_query_entities");

class TheGraphController {

    // cf) entityName types: [
    //     orderCreateds,
    //     orderJoineds,
    //     orderDeliveryStarteds,
    //     deliveryCompleteds
    // ]
    async querySubgraph(req, res) {
        const { entityName, first, skip } = req.query;

        const query = `query {
            ${entityName}(first: ${first}, skip: ${skip}, orderByField: "blockNumber", orderByDirection: "DESC") {
                ${eAAtsQueryEntities[entityName]}
            }
        }`;
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: query
            }),
        };

        const result = await fetch(subgraphQueryUrl, options);
        const json = await result.json();

        if (json) {
            return res.status(200).json({
                type: "success",
                message: "success",
                data: json["data"][entityName],
            });
        } else {
            return res.status(500).json({
                type: "server_issue",
                message: "Subgraph query error",
                // error,
            });
        }
    }
}

module.exports = new TheGraphController();
