const express = require("express");
const router = express.Router();

const {
  AssistantsCenterMailer,
  Mailers,
} = require("../../../../../mailer/assistantscentercom");

const LicensesList = require("../../../../../models/licensesList");
const User = require("../../../../../models/user");

const items = require("../../../../../configs/digitalItems").digital_items.find(
  (x) => x.categoryId == "soft-ui-addons"
).categoryItems;

const fs = require("fs");
const path = require("path");
const colors = require("colors");
const { EmbedBuilder } = require("discord.js");
const obfuscator = require("javascript-obfuscator");
const consolePrefix = `${"[".blue}${"addon-manager".yellow}${"]".blue} `;

router.post("/addons/fetch", async (req, res) => {
  console.log(req.body);
  if (!req.body.license || !req.body.addon)
    return res.json({ error: true, info: "Missing license and/or addon" });

  const license = await LicensesList.findOne({ license_id: req.body.license });
  if (!license) return res.json({ error: true, info: "Invalid license" });

  const user = await User.findOne({ _id: license.user });
  if (!user) return res.json({ error: true, info: "Failed to find user" });

  if(user.warnings?.find(w => w.active === true)) return res.json({ error: true, info: "User has active warnings" });
  if(user.suspended?.enabled) return res.json({ error: true, info: "User is suspended" });

  const licenseItem = user.productLicenses.find(
    (l) => l.licenseID === req.body.addon
  );

  if (!licenseItem) {
    const userAttempt = await LicensesList.findOne({ license_id: req.body.addon });

    const addonOwner = await User.findOne({ _id: userAttempt?.user });

    if (!addonOwner) return res.json({ error: true, info: "Failed to find user" });

    const embed = new EmbedBuilder()
      .setTitle(`User ${user.assistants_username}`)
      .setDescription(
        `${user.assistants_username} attempted to access ${addonOwner.assistants_username}'s addon license`
      )
      .setColor("Red")
      .setTimestamp();

    const channel = await req.client.channels.fetch(
      process.env.DISCORD_LOGS_CHANNEL_ID
    );

    if (user?.connections?.discord?.id) {
      let showAccount;
      const duser = await req.client.users.fetch(user?.connections?.discord?.id);
      duser === null ? (showAccount = false) : (showAccount = true);

      if (showAccount)
        embed.setAuthor({ name: duser.tag, iconURL: duser.avatarURL() });
      else if (showAccount) embed.setAuthor({ name: user.assistants_username });

      if (channel) channel.send({ embeds: [embed] });
    }

    const RegisteredMailer = new AssistantsCenterMailer(Mailers.noreply);
    const RegisteredHtmlContent = require("../../../../../mailer/templates/unauthorised_access/create");

    console.log(addonOwner.email)

    try {
      RegisteredMailer.sendMail({
        to_email: addonOwner.email,
        from_name: "Assistants Center No-reply",
        subject: "Unauthorized access",
        html_content: RegisteredHtmlContent({
          username: user.assistants_username,
          addon: license.license_type.split("-")[2],
        }),
      });
      return res.json({ error: true, info: "You do not own this addon" });
    } catch (err) {
      console.log(err);
    }
  }

  const itemObj = items.find(
    (p) => p.id.toString() === licenseItem.itemID.toString()
  );

  if (!itemObj || !itemObj?.addonPath)
    return res.json({ error: true, info: "Failed to fetch item" });

  let file;

  try {
    file = fs.readFileSync(
      path.join(__dirname, `./addons/${itemObj.addonPath}/unobfuscated.js`),
      "utf8"
    );
  } catch {
    return res.json({ error: true, info: "Addon not found." });
  }

  let addonLicenseMuffled = req.body.license.split("-");

  file = file
    .replace("{{ADDON1}}", addonLicenseMuffled[0])
    .replace("{{ADDON2}}", addonLicenseMuffled[1])
    .replace("{{ADDON3}}", addonLicenseMuffled[2])
    .replace("{{ADDON4}}", addonLicenseMuffled[3])
    .replace("{{ADDON5}}", addonLicenseMuffled[4])
    .replace("{{ADDON_NAME}}", itemObj.name)
    .replace(
      "{{ADDON_LICENSE1}}",
      `${addonLicenseMuffled[0]}-${addonLicenseMuffled[1]}-${addonLicenseMuffled[2]}-`
    )
    .replace(
      "{{ADDON_LICENSE2}}",
      `${addonLicenseMuffled[3]}-${addonLicenseMuffled[4]}`
    )
    .replace(
      "{{ADDON_SUCCESS}}",
      `${consolePrefix}${"Successfully loaded".cyan} ${colors.green(
        itemObj.name
      )}.`
    )
    .replaceAll(
      "{{ADDON_ERROR}}",
      `${consolePrefix}${"Failed to initialise".cyan} ${colors.red(itemObj.name)}.`
    )
    .replace('"{{ADDON_VERSION}}"', itemObj.addonVersion) // yes its like this on purpose, do not remove the extra quotation marks.
    .replaceAll("{{ADDON_LICENSE}}", license.license_id);

  file = obfuscator
    .obfuscate(file, {
      compact: true,
      controlFlowFlattening: true,
      controlFlowFlatteningThreshold: 1,
      numbersToExpressions: true,
      simplify: true,
      renameGlobals: true,
      renameProperties: false,
      stringArrayShuffle: true,
      splitStrings: true,
      stringArrayThreshold: 1,
      target: "node",
    })
    .getObfuscatedCode();

  return res.json({
    error: false,
    file,
    fileName: itemObj.addonPath,
    version: itemObj.addonVersion,
  });
});

module.exports = router;