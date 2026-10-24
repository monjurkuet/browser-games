// xpath.esm.js - ES module wrapper for xpath UMD script
import "./xpath.js";
// The UMD script uses self.xmlDomLib and may export xpath functionality
// It typically assigns to self.XPath or similar
export const xpathLib = self.XPath || self.xpath || {};
export default xpathLib;