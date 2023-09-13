let fs = require("fs");
let PNG = require("pngjs").PNG;
const baseurl = "../../"

// The pngjs library doesn't process some files because of "unrecognised content at end of stream"
// Shamelessly commenting the throw statement in node_modules/pngjs/lib/sync-reader.js line 43 works
// I'm sorry

const clothespreset = [2,1,1,1,1];
const hairpreset = [2,1,1,1,1.5];


/**
 * In-place convert image to grayscale
 * @param image PNG image
 * @param params Processing params: [r_factor, g_factor, b_factor, scale, gamma]
 */
function desaturate(image, params=[2,1,1,1,1]) {
	const {width,height,data} = image;
	const [rf,gf,bf,sf,gamma] = params;
	const f = sf/(rf+gf+bf);
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			let idx = (width * y + x) << 2;
			if (data[idx+3] === 0) continue;
			// brightness = 0.5*R + 0.25*G + 0.25*B
			let r = data[idx]/255;
			let g = data[idx+1]/255;
			let b = data[idx+2]/255;

			let value = (rf*r**gamma + gf*g**gamma + bf*b**gamma)*f;
			value = Math.max(0,Math.min(255,(value*255)|0));
			data[idx] = value;
			data[idx + 1] = value;
			data[idx + 2] = value;
		}
	}
}

/**
 * Convert one file, and save result with "_gray" suffix
 * @param path Relative path to PNG file
 * @param params Processing params: [r_factor, g_factor, b_factor, scale, gamma]
 * @param skipexisting Do nothing if "_gray" file exists (does not check contents)
 */
function desaturateFile(path, params=[2,1,1,1,1],skipexisting=true) {
	let newname = path.replace(".png","_gray.png");
	if (skipexisting && fs.existsSync(path)) return;
	let data = fs.readFileSync(path);
	let png = PNG.sync.read(data);
	desaturate(png,params);
	data = PNG.sync.write(png, {colorType:4});
	fs.writeFileSync(newname, data)
}

/**
 * Pick property from source file declaring JS object
 * @param json string containing JS object
 * @param propname property name
 * @return property value
 */
function lookupprop(json,propname) {
	let regex = new RegExp(`['"]?${propname}['"]?\\s*:\\s*([0-9.+\-eE]+|true|false|"[^"\\\\]*"|'[^'\\\\]*')\\s*[,}]`);
	let m = regex.exec(json);
	if (!m) return undefined;
	return JSON.parse(m[1]);
}

/**
 * Pick properties from source file declaring JS object
 * @param json string containing JS obejct
 * @param {string[]} propnames property names
 * @return {object} key-value object with all properties
 */
function lookupprops(json,propnames) {
	let object = {};
	for (let propname of propnames) object[propname] = lookupprop(json,propname);
	return object;
}

// utility function for back_img_colour
function colorByOption(optionvalue, maincolor) {
	switch (optionvalue) {
		case "":
		case undefined:
			return !!maincolor;
		case "primary":
		case "secondary":
			return true;
		default:
			return false;
	}
}

let failedFiles = [];

function processSlot(setupfile,imgdir,varname,hasIntegrity) {
	console.log("Trying " + setupfile);
	let s = fs.readFileSync(baseurl + setupfile, {encoding: "utf-8"});
	let regex = new RegExp("<<set *" + varname.replace(/\./g, '\\.') + " *to\\s*\\[((?:[^\\[]*|\\[[^\\[\\]]*])*)]", "mg")
	let m = regex.exec(s);
	if (!m) {
		console.log("Not found variable " + varname);
	} else {
		console.log("Found variable " + varname);
		let vw = m[1];
		let itemrex = /{(?:[^{}]|{[^{}]*})*}/mg;
		while (true) {
			let item = itemrex.exec(vw);
			if (!item) break;
			let json = lookupprops(item[0], [
				"variable",
				"colour_sidebar",
				"accessory_colour_sidebar",
				"accessory",
				"accessory_integrity_img",
				"breast_img",
				"breast_acc_img",
				"back_img",
				"back_img_colour",
				"sleeve_img",
				"sleeve_colour",
				"penis_img",
				"hood"
			]);
			let v = json.variable;
			console.log("Found item " + v);
			let files = [];
			if (varname === "setup.clothes.hands"){ // hack but what can I do...
				if (json.colour_sidebar) {
					files.push("left","right","left_cover","right_cover");
				}
				if (json.accessory && json.accessory_colour_sidebar) {
					files.push("left_acc","right_acc","left_cover_acc","right_cover_acc");
				}
			} else {
				if (json.back_img) {
					if (colorByOption(json.back_img_colour, json.colour_sidebar)) {
						files.push("back");
					}
				}
				if (json.colour_sidebar) {
					let ifiles = ["full"];
					if (hasIntegrity) {
						ifiles.push("frayed", "tattered", "torn");
					}
					files.push(...ifiles);
					if (json.hood) {
						for (let file of ifiles) {
							files.push(file + "_down");
						}
					}
					if (varname === "setup.clothes.neck") {
						for (let file of ifiles) {
							files.push(file + "_nocollar");
						}
					}
					if (json.breast_img === 1) {
						for (let i = 0; i <= 5; i++) {
							files.push("" + i);
						}
					}
					if (json.penis_img === 1) {
						files.push("penis");
					}
				}
				if (json.sleeve_img) {
					if (colorByOption(json.sleeve_colour, json.colour_sidebar)) {
						files.push("right", "right_cover", "left", "left_cover");
					}
				}
				if (json.accessory === 1 && json.accessory_colour_sidebar) {
					let accfiles = [];
					if (json.accessory_integrity_img) {
						accfiles.push("full_acc", "frayed_acc", "tattered_acc", "torn_acc");
					} else {
						accfiles.push("acc")
					}
					files.push(...accfiles);
					if (json.hood) {
						for (let file of accfiles) {
							files.push(file + "_down");
						}
					}
					if (json.breast_acc_img === 1) {
						for (let i = 0; i <= 5; i++) {
							files.push("" + i + "_acc");
						}
					}
					if (json.penis_img === 1) {
						files.push("acc_penis");
					}
				}
			}
			if (files.length > 0) {
				console.log("Expecting files:", ...files);
				for (let file of files) {
					let path = baseurl + imgdir + v + "/"+file +".png";
					if (fs.existsSync(path)) {
						console.log("Processing file "+path);
						try {
							desaturateFile(path, clothespreset);
						} catch (e) {
							console.error(e.message);
							failedFiles.push(path)
						}
					}
				}
			}
		}
	}
}

function convertAllClothes() {
	let slots = ["hands", "face", "feet", "genitals", "hands", "head", "legs", "lower", "neck", "over_head", "over_lower", "over_upper", "upper"];
	for (let slot of slots) {
		processSlot(`game/base-clothing/clothing-${slot}.twee`, `img/clothes/${slot}/`, `setup.clothes.${slot}`, true);
	}
	processSlot("game/base-clothing/clothing-under.twee", "img/clothes/under_lower/", "setup.clothes.under_lower", true);
	processSlot("game/base-clothing/clothing-under-upper.twee", "img/clothes/under_upper/", "setup.clothes.under_upper", true);
}

function convertAllHair() {
	let lengths = ["short","shoulder","chest","navel","thighs","feet"];
	let sidedir = baseurl+"img/hair/sides";
	let fringedir = baseurl+"img/hair/fringe";
	let files = [];
	for (let sidestyle of fs.readdirSync(sidedir)) {
		for (let l of lengths) {
			let path = sidedir+"/"+sidestyle+"/"+l+".png";
			files.push(path);
		}
	}
	for (let fringestyle of fs.readdirSync(fringedir)) {
		for (let l of lengths) {
			let path = fringedir+"/"+fringestyle+"/"+l+".png";
			files.push(path);
		}
	}
	files.push(baseurl+"img/hair/red/backhairthighsred.png");
	files.push(baseurl+"img/hair/red/backhairfeetred.png");
	for (let path of files) {
		if (!fs.existsSync(path)) continue;
		console.log("Processing ",path);
		try {
			desaturateFile(path,hairpreset)
		} catch (e) {
			console.error(e.message);
			failedFiles.push(path);
		}
	}
}

convertAllClothes();
// convertAllHair();


if (failedFiles.length>0) {
	console.warn("Failed to process: ")
	for (let f of failedFiles) {
		console.warn(f);
	}
}
