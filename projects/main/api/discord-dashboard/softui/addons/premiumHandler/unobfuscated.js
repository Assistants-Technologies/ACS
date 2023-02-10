let randomStuff = ["73563g", "23674a", "a73hfvb", "467dgvv54hs"];
let justIncaseLicense = [
  "{{ADDON1}}",
  "{{ADDON2}}",
  "{{ADDON3}}",
  "{{ADDON4}}",
  "{{ADDON5}}",
];

module.exports = {
  name: "{{ADDON_NAME}}",
  license: "{{ADDON_LICENSE}}",
  version: "{{ADDON_VERSION}}",
  initialise: async (themeConfig, dbdConfig, app, messages) => {
    const licenseInfo = require("discord-dashboard").licenseInfo();
    // if(randomStuff[0] === '73563g' && licenseInfo.licenseId === module.exports.license && module.exports.license === ("{{ADDON_LICENSE1}}" + "{{ADDON_LICENSE2}}")) {
    if (
      module.exports.license === "{{ADDON_LICENSE}}" &&
      justIncaseLicense.join("-") === "{{ADDON_LICENSE}}"
    ) {
      if (module.exports.license === justIncaseLicense.join("-")) {
        // do something idk?
        console.log("{{ADDON_SUCCESS}}");
      } else console.log("{{ADDON_ERROR}}");
    } else console.log("{{ADDON_ERROR}}");
    // } else console.log("{{ADDON_ERROR}}")
  },
};
