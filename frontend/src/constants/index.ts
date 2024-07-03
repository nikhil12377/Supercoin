import * as imageURI from "./imageURI";
import { organizations } from "./organizations";
import { userAddresses } from "./userAddresses";

export const CHAINID = process.env.REACT_APP_CHAINID;
export const CHAIN = process.env.REACT_APP_CHAIN;
export const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;
export const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;

export { imageURI, organizations, userAddresses };