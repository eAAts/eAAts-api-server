const ethers = require("ethers");

const path = require("path")
require("dotenv").config(); // root env
const envType = process.env.NODE_ENV || "development";
require("dotenv").config({ path: path.join(__dirname, `${envType}.env`) }); // sub env

const database = require("./db-config.js");

const TEST = "test"
const MAIN = "main"

const EN_TEST = "https://rpc-mumbai.maticvigil.com"; // polygon mumbai testnet
const EN_MAIN = "https://polygon-rpc.com/"; // polygon mainnet

const address_path_dev = "../constants/addrs_dev.json";
const address_path_main = "../constants/addrs_mainnet.json";

const dev_env_list = ["development"];
const prod_env_list = ["production"];

const getNodeType = () => {
    const test_env_list = [...dev_env_list];
    const main_env_list = [...prod_env_list];
    if(test_env_list.includes(envType)){
        return TEST;
    } else if(main_env_list.includes(envType)){
        return MAIN;
    }
}

const getChecksumedAddresses = (address_path) => {
    const addresses = require(address_path)
    const result = {};
    for(let k in addresses){
        result[k] = ethers.getAddress(addresses[k])
    }
    return result
}

module.exports = {
    envType,
    app: {
        port: process.env.PORT || 3000,
        appName: process.env.APP_NAME || "GDC-API-SERVER",
        env: envType
    },
    database: database[envType],
    getNodeType,
    blockchain(){
        return getNodeType() === MAIN ? EN_MAIN : EN_TEST;
    },
    addresses(){
        let address_path;
        if(dev_env_list.includes(envType)) address_path = address_path_dev
        else if(prod_env_list.includes(envType)) address_path = address_path_main;
        else throw new Error(`No matching envType : ${envType}`)
        return getChecksumedAddresses(address_path); 
    },
}
