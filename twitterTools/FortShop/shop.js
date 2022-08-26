const fs = require("fs")
const {
	createCanvas,
	loadImage,
	registerFont,
} = require("canvas")
const axios = require("axios")
const moment = require("moment")
const date = moment().format("dddd, MMMM Do YYYY")
const path = require('path')

const imagemin = await import('imagemin')
const imageminPngquant = require('imagemin-pngquant')

module.exports = {
	/**
	 * Generates the shop image in a design similar to the in-game design.
	 */
	async generateShop(shop, watermark="Use code ASSISTANTS") {
		// Font
		registerFont(path.join(__dirname, "./assets/fonts/BurbankBigRegularBlack.otf"), {
			family: "Burbank Big Regular",
			style: "Black",
		});

		// Check shop
		if (!shop) process.exit(1);

		// Get the image width
		const keys = Object.keys(shop);
		let bigwidth = 0;

		for (let i of keys) {
			let curwidth = 250;
			i = shop[i].entries;

			i.forEach(el => {
				if (el.size === "DoubleWide") curwidth += 1060;
				else if (el.size === "Small") curwidth += 250;
				else if (el.size === "Normal") curwidth += 500;
				else curwidth += 500;
				curwidth += 60;
			});

			if (curwidth > bigwidth) bigwidth = curwidth;
		}

		// Make the image
		const canvasHeight = (keys.length * 1200) + 1000;
		const canvasWidth = bigwidth;

		const canvas = createCanvas(Number(canvasWidth), Number(canvasHeight));
		const ctx = canvas.getContext("2d");

		// Starting points
		let featuredX = 150;
		let featuredY = 900;
		let rendered = 0;
		let below = false;

		// Background
		const background = await loadImage(path.join(__dirname, "./assets/background.png"));
		ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

		// Item Shop
		ctx.fillStyle = "#ffffff";
		ctx.font = "italic 300px \"Burbank Big Rg Bk\"";
		ctx.textAlign = "left";
		ctx.fillText("Item Shop", 170, 500);

		// Date
		ctx.font = "italic 125px \"Burbank Big Rg Bk\"";
		ctx.textAlign = "right";
		ctx.fillText(date, canvas.width - 100, 400);

		// Watermark
		if (watermark) ctx.fillText(watermark, canvas.width - 100, 550);

		// Start Rendering
		for (const i of keys) {
			const items = shop[i].entries;

			// Draw shop section name
			if (shop[i].name !== null) {
				ctx.fillStyle = "#ffffff";
				ctx.font = "italic 100px \"Burbank Big Rg Bk\"";
				ctx.textAlign = "left";
				ctx.fillText(shop[i].name, 185, featuredY - 60);
				ctx.drawImage(await loadImage(path.join(__dirname, "./assets/clock.png")), ctx.measureText(shop[i].name).width + 200, featuredY - 160, 125, 125);
			}

			// Draw items
			for (const item of items) {
				let itemImg;
				let ov;
				let imgWidth = 0;
				let imgHeight = 0;
				let wasBelow = false;

				// Get the image width/height
				if (item.size === "DoubleWide") {
					imgWidth = 1060;
					imgHeight = 1000;
					below = false;
					wasBelow = false;
				} else if (item.size === "Small") {
					imgWidth = 500;
					imgHeight = 480;
					if (below === true) {
						featuredX = featuredX - (imgWidth + 60);
						featuredY = featuredY + 520;
						below = false;
						wasBelow = true;
					} else {
						below = true;
						wasBelow = false;
					}
				} else if (item.size === "Normal") {
					imgWidth = 500;
					imgHeight = 1000;
					below = false;
					wasBelow = false;
				} else {
					imgWidth = 500;
					imgHeight = 1000;
					below = false;
					wasBelow = false;
				}

				// Load Overlay
				try {
					ov = await loadImage(path.join(__dirname, `./assets/rarities/${item.series ? item.series.name.toLowerCase().replace(/ /g, "").replace("series", "") : item.rarity.name}Down.png`));
				} catch {
					ov = await loadImage(path.join(__dirname, "./assets/rarities/UncommonDown.png"));
				}

				// Load image
				if (item.images.background) {
					try {
						itemImg = await loadImage(item.images.background);
					} catch {
						itemImg = await loadImage(path.join(__dirname, "./assets/placeholder.png"));
					}
				} else if (item.images.icon) {
					try {
						itemImg = await loadImage(item.images.icon);
					} catch {
						itemImg = await loadImage(path.join(__dirname, "./assets/placeholder.png"));
					}
				} else {
					itemImg = await loadImage(path.join(__dirname, "./assets/placeholder.png"));
				}

				// Draw image
				if (item.size === "DoubleWide") {
					ctx.drawImage(itemImg, featuredX, featuredY, imgWidth, imgHeight);
					ctx.drawImage(ov, featuredX, featuredY + (imgHeight - 600), imgWidth, 600);
				} else if (item.size === "Small") {
					ctx.drawImage(itemImg, imgWidth / 4.7, 0, imgWidth + 300, imgHeight + 300, featuredX, featuredY, imgWidth, imgHeight);
					ctx.drawImage(ov, featuredX, featuredY + (imgHeight - 600), imgWidth, 600);
				} else {
					ctx.drawImage(itemImg, imgWidth / 2, 0, imgWidth, imgHeight, featuredX, featuredY, imgWidth, imgHeight);
					ctx.drawImage(ov, featuredX, featuredY + (imgHeight - 600), imgWidth, 600);
				}

				// Load & Draw Name
				ctx.fillStyle = "#ffffff";
				let fontSize = 55;
				ctx.font = "italic " + fontSize + "px \"Burbank Big Rg Bk\"";

				let measure = ctx.measureText(item.name.toUpperCase()).width;
				while (measure > (imgWidth - 40)) {
					fontSize = fontSize - 0.6;
					ctx.font = "italic " + fontSize + "px \"Burbank Big Rg Bk\"";
					measure = ctx.measureText(item.name.toUpperCase()).width;
				}
				ctx.textAlign = "center";
				ctx.fillText(item.name.toUpperCase(), featuredX + (imgWidth / 2), featuredY + (imgHeight - (400 / 7.5)));

				// Load & Draw Price
				ctx.fillStyle = "#d3d3d3";
				ctx.font = "30px \"Burbank Big Rg Bk\"";
				ctx.textAlign = "right";
				ctx.fillText(item.price.finalPrice.toLocaleString(), featuredX + (imgWidth - (500 / 6)), featuredY + (imgHeight - (500 / 45)));

				ctx.drawImage(await loadImage(path.join(__dirname, "./assets/vbucks.png")), item.size === "DoubleWide" ? featuredX + 560 : featuredX, featuredY + (imgHeight - 500), 500, 500);

				// Gameplay Tags
				if (item.effects && item.effects.length) {
					try {
						if (item.effects[0].split(".").pop() == "BuiltInEmote") {
							ctx.drawImage(await loadImage(path.join(__dirname, `./assets/gptags/BuiltInContentEF.png`)), featuredX + (imgWidth - 100), featuredY + (imgHeight - 220), 80, 80);
						} else {
							ctx.drawImage(await loadImage(path.join(__dirname, `./assets/gptags/${item.effects[0].split(".").pop()}EF.png`)), featuredX + (imgWidth - 100), featuredY + (imgHeight - 220), 80, 80);
						};
					} catch {
					}
				}

				// Return to the default height
				if (wasBelow === true) {
					featuredY = featuredY - 520;
				}

				// Rows
				featuredX = featuredX + imgWidth + 60;
				rendered = rendered + 1;
				if (rendered === items.length) {
					rendered = 0;
					featuredY = featuredY + 1200;
					featuredX = 150;
				}
			}
		}

		// Gen buf
		let buf = canvas.toBuffer("image/png");

		buf = await imagemin.buffer(buf, {
			plugins: [
				imageminPngquant()
			]
		})

		// Return path
		return buf;
	},

	/**
	 * Get's the current shop items and formats them.
	 */
	async getShopItems(apiKey, language) {
		const shop = {};

		const items = await axios.get(`https://fortniteapi.io/v2/shop?lang=${language}&renderData=true`, {
			headers: {
				"Authorization": apiKey,
			},
		}).catch(console.error);

		const store = items.data.shop;
		
		if (!store) return console.error("Please add your API Key in the Authorization header for the HTTP Request.\nGet your FortniteAPI.io Authorization Key at https://dashboard.fortniteapi.io".red);

		store.forEach(el => {
			if (!shop[el.section.id]) {
				shop[el.section.id] = {
					name: el.section.name,
					entries: [],
				};
			}
			shop[el.section.id].entries.push({
				name: el.displayName,
				description: el.displayDescription,
				id: el.mainId,
				type: el.displayType,
				mainType: el.mainType,
				offerId: el.offerId,
				giftAllowed: el.giftAllowed,
				price: el.price,
				rarity: el.rarity,
				series: el.series,
				images: {
					icon: el.displayAssets[0].url,
					background: el.displayAssets[0].background,
				},
				banner: el.banner,
				effects: el.granted[0].gameplayTags.filter(kek => kek.includes("UserFacingFlags")),
				priority: el.priority,
				section: el.section,
				size: el.tileSize,
				renderData: el.displayAssets[0].renderData,
			});
		});

		return shop;
	},
};
