import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  "0xda353dfd1CA2Cf4cC6cAA66DA618Bf4ADE53f7fF"
);

export default instance;
