/**
 * Hex => RGB Cache
 */

var h2rs = {};

/**
 * Default `colors.json`
 */

var colors = {
  "aqua": ["#00FFFF", "hue-rotate(180deg) brightness(210%) saturate(350%) contrast(100%)", "青色"],
  "aliceblue": ["#F0F8FF", "hue-rotate(208deg) brightness(260%) saturate(20%) contrast(100%)", "爱丽丝蓝"],
  "antiquewhite": ["#FAEBD7", "hue-rotate(4deg) brightness(230%) saturate(20%) contrast(120%)", "古白色"],
  "black": ["#000000", "hue-rotate(0deg) brightness(100%) saturate(0%) contrast(170%)", "黑色"],
  "blue": ["#0000FF", "hue-rotate(192deg) brightness(80%) saturate(279%) contrast(300%)", "蓝色"],
  "cyan": ["#00FFFF", "hue-rotate(131deg) brightness(128%) saturate(249%) contrast(260%)", "蓝绿色"],
  "omendarkblue": ["#00008B", "hue-rotate(207deg) brightness(80%) saturate(79%) contrast(300%)","深蓝色"],
  "darkcyan": ["#008B8B", "hue-rotate(136deg) brightness(105%) saturate(219%) contrast(100%)", "深青色"],
  "darkgreen": ["#006400", "hue-rotate(55deg) brightness(100%) saturate(79%) contrast(100%)", "深绿色"],
  "darkturquoise": ["#00CED1", "hue-rotate(128deg) brightness(110%) saturate(249%) contrast(190%)", "深粉蓝色"],
  "deepskyblue": ["#00BFFF", "hue-rotate(140deg) brightness(110%) saturate(249%) contrast(190%)", "深天蓝色"],
  "omengreen": ["#008000", "hue-rotate(55deg) brightness(100%) saturate(69%) contrast(100%)", "绿色"],
  "lime": ["#00FF00", "hue-rotate(117deg) brightness(170%) saturate(120%) contrast(110%)", "浅黄绿色"],
  "mediumblue": ["#0000CD", "hue-rotate(207deg) brightness(80%) saturate(179%) contrast(300%)", "中蓝色"],
  "mediumspringgreen": ["#00FA9A", "hue-rotate(117deg) brightness(170%) saturate(100%) contrast(140%)", "中春绿色"],
  "navy": ["#000080", "hue-rotate(207deg) brightness(80%) saturate(79%) contrast(300%)", "海军蓝"],
  "springgreen": ["#00FF7F", "hue-rotate(117deg) brightness(175%) saturate(120%) contrast(110%)", "春绿色"],
  "teal": ["#008080", "hue-rotate(128deg) brightness(90%) saturate(249%) contrast(190%)", "鸭绿色"],
  "midnightblue": ["#191970", "hue-rotate(206deg) brightness(80%) saturate(79%) contrast(300%)", "深黑蓝色"],
  "dodgerblue": ["#1E90FF", "hue-rotate(140deg) brightness(107%) saturate(229%) contrast(190%)", "宝蓝色"],
  "lightseagreen": ["#20B2AA", "hue-rotate(124deg) brightness(107%) saturate(229%) contrast(190%)", "浅海绿色"],
  "forestgreen": ["#228B22", "hue-rotate(124deg) brightness(95%) saturate(229%) contrast(150%)", "森林绿"],
  "seagreen": ["#2E8B57", "hue-rotate(124deg) brightness(90%) saturate(229%) contrast(150%)", "海绿色"],
  "darkslategrey": ["#2F4F4F", "hue-rotate(156deg) brightness(90%) saturate(139%) contrast(300%)", "暗岩灰色"],
  "mediumlimegreen": ["#32CD32", "hue-rotate(124deg) brightness(112%) saturate(269%) contrast(190%)", "柠檬绿"],
  "mediumseagreen": ["#3CB371", "hue-rotate(124deg) brightness(112%) saturate(269%) contrast(190%)", "中海绿"],
  "turquoise": ["#40E0D0", "hue-rotate(131deg) brightness(122%) saturate(269%) contrast(160%)", "绿松石色"],
  "royalblue": ["#4169E1", "hue-rotate(140deg) brightness(90%) saturate(229%) contrast(190%)", "皇家蓝色"],
  "steelblue": ["#4682B4", "hue-rotate(140deg) brightness(100%) saturate(210%) contrast(200%)", "灰蓝色"],
  "darkslateblue": ["#483D8B", "hue-rotate(207deg) brightness(90%) saturate(120%) contrast(200%)", "暗岩蓝色"],
  "mediumturquoise": ["#48D1CC", "hue-rotate(131deg) brightness(128%) saturate(200%) contrast(270%)", "中绿松石色"],
  "indigo": ["#4B0082", "hue-rotate(233deg) brightness(80%) saturate(69%) contrast(200%)", "靛青色"],
  "darkolivegreen": ["#556B2F", "hue-rotate(22deg) brightness(110%) saturate(100%) contrast(165%)", "暗绿色"],
  "cadetblue": ["#5F9EA0", "hue-rotate(127deg) brightness(120%) saturate(109%) contrast(100%)", "藏青色"],
  "cornflowerblue": ["#6495ED", "hue-rotate(182deg) brightness(130%) saturate(109%) contrast(100%)", "矢车菊蓝色"],
  "mediumaquamarine": ["#66CDAA", "hue-rotate(117deg) brightness(150%) saturate(100%) contrast(110%)", "中碧蓝色"],
  "dimgrey": ["#696969", "hue-rotate(117deg) brightness(129%) saturate(0%) contrast(210%)", "昏灰色"],
  "slateblue": ["#6A5ACD", "hue-rotate(211deg) brightness(105%) saturate(109%) contrast(160%)", "石蓝色"],
  "olivedrab": ["#6B8E23", "hue-rotate(25deg) brightness(108%) saturate(109%) contrast(120%)", "灰橄榄色"],
  "slategrey": ["#708090", "hue-rotate(211deg) brightness(115%) saturate(0%) contrast(100%)", "蓝灰色"],
  "lightslategrey": ["#778899", "hue-rotate(211deg) brightness(119%) saturate(0%) contrast(100%)", "浅蓝灰色"],
  "mediumslateblue": ["#7B68EE", "hue-rotate(211deg) brightness(107%) saturate(140%) contrast(100%)", "间蓝色"],
  "lawngreen": ["#7CFC00", "hue-rotate(56deg) saturate(160%) brightness(150%) contrast(200%)", "草坪绿色"],
  "aquamarine": ["#7FFFD4", "hue-rotate(112deg) saturate(70%) brightness(190%) contrast(140%)", "碧蓝色"],
  "chartreuse": ["#7FFF00", "hue-rotate(46deg) saturate(140%) brightness(170%) contrast(140%)", "荧光绿"],
  "omengrey": ["#808080", "hue-rotate(117deg) brightness(139%) saturate(0%) contrast(210%)", "灰色"],
  "maroon": ["#800000", "hue-rotate(305deg) brightness(100%) saturate(60%) contrast(177%)", "褐红色"],
  "olive": ["#808000", "hue-rotate(17deg) brightness(110%) saturate(120%) contrast(127%)", "橄榄色"],
  "omenpurple": ["#800080", "hue-rotate(230deg) brightness(95%) saturate(70%) contrast(127%)", "紫色"],
  "lightskyblue": ["#87CEFA", "hue-rotate(143deg) brightness(172%) saturate(39%) contrast(220%)", "浅天蓝色"],
  "skyblue": ["#87CEEB", "hue-rotate(143deg) brightness(182%) saturate(29%) contrast(200%)", "天蓝色"],
  "blueviolet": ["#8A2BE2", "hue-rotate(230deg) brightness(100%) saturate(140%) contrast(207%)", "兰紫色"],
  "darkmagenta": ["#8B008B", "hue-rotate(230deg) brightness(100%) saturate(100%) contrast(207%)", "深品色"],
  "darkred": ["#8B0000", "hue-rotate(279deg) brightness(100%) saturate(70%) contrast(207%)", "暗红色"],
  "saddlebrown": ["#8B4513", "hue-rotate(342deg) brightness(100%) saturate(70%) contrast(207%)", "鞍褐色"],
  "darkseagreen": ["#8FBC8F", "hue-rotate(46deg) saturate(80%) brightness(160%) contrast(140%)", "暗海绿色"],
  "omenlightgreen": ["#90EE90", "hue-rotate(85deg) brightness(181%) saturate(40%) contrast(170%)", "浅绿色"],
  "mediumpurple": ["#9370DB", "hue-rotate(230deg) brightness(125%) saturate(70%) contrast(127%)", "中紫红色"],
  "darkviolet": ["#9400D3", "hue-rotate(245deg) brightness(90%) saturate(90%) contrast(137%)", "暗紫罗兰色"],
  "palegreen": ["#98FB98", "hue-rotate(85deg) brightness(184%) saturate(40%) contrast(170%)", "淡绿色"],
  "darkorchid": ["#9932CC", "hue-rotate(245deg) brightness(99%) saturate(90%) contrast(137%)", "暗兰花色"],
  "yellowgreen": ["#9ACD32", "hue-rotate(42deg) saturate(100%) brightness(170%) contrast(100%)", "黄绿色"],
  "sienna": ["#A0522D", "hue-rotate(305deg) brightness(100%) saturate(70%) contrast(117%)", "赭色"],
  "brown": ["#A52A2A", "hue-rotate(297deg) brightness(100%) saturate(70%) contrast(177%)", "棕色"],
  "darkgrey": ["#A9A9A9", "hue-rotate(297deg) brightness(160%) saturate(0%) contrast(177%)", "暗灰色"],
  "greenyellow": ["#ADFF2F", "hue-rotate(42deg) saturate(120%) brightness(193%) contrast(100%)", "青柠色"],
  "omenlightblue": ["#ADD8E6", "hue-rotate(166deg) saturate(50%) brightness(205%) contrast(100%)", "淡蓝色"],
  "paleturquoise": ["#AFEEEE", "hue-rotate(144deg) saturate(40%) brightness(200%) contrast(140%)", "淡蓝绿色"],
  "lightsteelblue": ["#B0C4DE", "hue-rotate(144deg) saturate(27%) brightness(180%) contrast(140%)", "淡灰蓝色"],
  "powderblue": ["#B0E0E6", "hue-rotate(144deg) saturate(33%) brightness(193%) contrast(140%)", "粉蓝色"],
  "firebrick": ["#B22222", "hue-rotate(290deg) brightness(100%) saturate(70%) contrast(207%)", "深砖色"],
  "darkgoldenrod": ["#B8860B", "hue-rotate(2deg) brightness(121%) saturate(100%) contrast(157%)", "暗鼠尾草色"],
  "mediumorchid": ["#BA55D3", "hue-rotate(242deg) brightness(121%) saturate(80%) contrast(157%)", "兰花色"],
  "rosybrown": ["#BC8F8F", "hue-rotate(301deg) brightness(141%) saturate(30%) contrast(137%)", "玫棕色"],
  "darkkhaki": ["#BDB76B", "hue-rotate(19deg) saturate(90%) brightness(180%) contrast(110%)", "暗卡其色"],
  "silver": ["#C0C0C0", "hue-rotate(19deg) saturate(0%) brightness(190%) contrast(100%)", "银色"],
  "mediumvioletred": ["#C71585", "hue-rotate(260deg) saturate(110%) brightness(100%) contrast(170%)", "中青紫红"],
  "indianred": ["#CD5C5C", "hue-rotate(349deg) saturate(140%) brightness(110%) contrast(160%)", "印度红色"],
  "peru": ["#CD853F", "hue-rotate(6deg) brightness(131%) saturate(130%) contrast(157%)", "秘鲁色"],
  "chocolate": ["#D2691E", "hue-rotate(344deg) brightness(121%) saturate(100%) contrast(157%)", "巧克力色"],
  "tan": ["#D2B48C", "hue-rotate(1deg) saturate(30%) brightness(173%) contrast(120%)", "浅褐色"],
  "omenlightgrey": ["#D3D3D3", "hue-rotate(1deg) saturate(0%) brightness(190%) contrast(170%)", "浅灰色"],
  "thistle": ["#D8BFD8", "hue-rotate(236deg) saturate(20%) brightness(180%) contrast(170%)", "薊紫色"],
  "goldenrod": ["#DAA520", "hue-rotate(354deg) saturate(60%) brightness(155%) contrast(160%)", "金橙色"],
  "orchid": ["#DA70D6", "hue-rotate(255deg) saturate(50%) brightness(145%) contrast(178%)", "淡紫色"],
  "palevioletred": ["#DB7093", "hue-rotate(279deg) saturate(60%) brightness(135%) contrast(160%)", "淡紫红色"],
  "crimson": ["#DC143C", "hue-rotate(312deg) saturate(130%) brightness(100%) contrast(160%)", "深红色"],
  "gainsboro": ["#DCDCDC", "hue-rotate(311deg) saturate(0%) brightness(195%) contrast(170%)", "淡灰色"],
  "plum": ["#DDA0DD", "hue-rotate(231deg) saturate(60%) brightness(160%) contrast(170%)", "紫红色"],
  "burlywood": ["#DEB887", "hue-rotate(356deg) saturate(40%) brightness(176%) contrast(130%)", "硬木色"],
  "lightcyan": ["#E0FFFF", "hue-rotate(131deg) brightness(195%) saturate(14%) contrast(250%)", "浅青色"],
  "lavender": ["#E6E6FA", "hue-rotate(173deg) brightness(192%) saturate(24%) contrast(250%)", "薰衣草色"],
  "darksalmon": ["#E9967A", "hue-rotate(352deg) saturate(130%) brightness(145%) contrast(100%)", "暗鲑红色"],
  "palegoldenrod": ["#EEE8AA", "hue-rotate(17deg) brightness(200%) saturate(64%) contrast(150%)", "灰金菊色"],
  "violet": ["#EE82EE", "hue-rotate(225deg) brightness(147%) saturate(130%) contrast(170%)", "紫罗兰色"],
  "azure": ["#F0FFFF", "hue-rotate(131deg) brightness(195%) saturate(10%) contrast(250%)", "蔚蓝色"],
  "honeydew": ["#F0FFF0", "hue-rotate(131deg) brightness(195%) saturate(10%) contrast(250%)", "蜜白色"],
  "khaki": ["#F0E68C", "hue-rotate(10deg) brightness(185%) saturate(40%) contrast(250%)", "卡其色"],
  "lightcoral": ["#F08080", "hue-rotate(336deg) saturate(130%) brightness(135%) contrast(100%)", "浅珊色"],
  "sandybrown": ["#F4A460", "hue-rotate(356deg) saturate(80%) brightness(160%) contrast(195%)", "沙褐色"],
  "beige": ["#F5F5DC", "hue-rotate(34deg) brightness(195%) saturate(14%) contrast(250%)", "米黄色"],
  "mintcream": ["#F5FFFA", "hue-rotate(84deg) brightness(195%) saturate(14%) contrast(250%)", "薄荷色"],
  "wheat": ["#F5DEB3", "hue-rotate(333deg) brightness(185%) saturate(12%) contrast(250%)", "麦棕色"],
  "whitesmoke": ["#F5F5F5", "hue-rotate(333deg) brightness(205%) saturate(0%) contrast(220%)", "雾白色"],
  "ghostwhite": ["#F8F8FF", "hue-rotate(160deg) brightness(205%) saturate(5%) contrast(220%)", "幽白色"],
  "lightgoldenrodyellow": ["#FAFAD2", "hue-rotate(1deg) brightness(199%) saturate(14%) contrast(220%)", "浅黄色"],
  "linen": ["#FAF0E6", "hue-rotate(335deg) brightness(199%) saturate(7%) contrast(220%)", "亚麻色"],
  "salmon": ["#FA8072", "hue-rotate(352deg) saturate(125%) brightness(140%) contrast(180%)", "粉橙色"],
  "oldlace": ["#FDF5E6", "hue-rotate(345deg) brightness(199%) saturate(10%) contrast(220%)", "浅米色"],
  "bisque": ["#FFE4C4", "hue-rotate(345deg) brightness(193%) saturate(15%) contrast(220%)", "陶坯黃"],
  "blanchedalmond": ["#FFEBCD", "hue-rotate(333deg) brightness(193%) saturate(11%) contrast(220%)", "榛黄色"],
  "coral": ["#FF7F50", "hue-rotate(335deg) saturate(130%) brightness(135%) contrast(100%)", "珊红色"],
  "cornsilk": ["#FFF8DC", "hue-rotate(13deg) brightness(199%) saturate(14%) contrast(220%)", "黍黄色"],
  "darkorange": ["#FF8C00", "hue-rotate(339deg) saturate(130%) brightness(140%) contrast(100%)", "暗橙色"],
  "deeppink": ["#FF1493", "hue-rotate(281deg) saturate(130%) brightness(110%) contrast(160%)", "深粉色"],
  "floralwhite": ["#FFFAF0", "hue-rotate(347deg) brightness(200%) saturate(10%) contrast(220%)", "花白色"],
  "fuchsia": ["#FF00FF", "hue-rotate(259deg) saturate(130%) brightness(110%) contrast(160%)", "花粉色"],
  "gold": ["#FFD700", "hue-rotate(10deg) brightness(187%) saturate(109%) contrast(100%)", "金黄色"],
  "hotpink": ["#FF69B4", "hue-rotate(271deg) saturate(100%) brightness(136%) contrast(120%)", "艳粉色"],
  "ivory": ["#FFFFF0", "hue-rotate(15deg) brightness(199%) saturate(14%) contrast(220%)", "象牙色"],
  "lavenderblush": ["#FFF0F5", "hue-rotate(288deg) brightness(215%) saturate(3%) contrast(220%)", "淡紫色"],
  "lemonchiffon": ["#FFFACD", "hue-rotate(24deg) brightness(200%) saturate(7%) contrast(220%)", "柠黄色"],
  "lightpink": ["#FFB6C1", "hue-rotate(275deg) brightness(187%) saturate(30%) contrast(130%)", "浅粉色"],
  "lightsalmon": ["#FFA07A", "hue-rotate(332deg) brightness(160%) saturate(60%) contrast(130%)", "浅肉色"],
  "lightyellow": ["#FFFFE0", "hue-rotate(14deg) brightness(199%) saturate(19%) contrast(220%)", "淡黄色"],
  "mistyrose": ["#FFE4E1", "hue-rotate(307deg) brightness(199%) saturate(10%) contrast(220%)", "雾玫色"],
  "moccasin": ["#FFE4B5", "hue-rotate(328deg) brightness(195%) saturate(10%) contrast(220%)", "革棕色"],
  "navajowhite": ["#FFDEAD", "hue-rotate(328deg) brightness(193%) saturate(12%) contrast(220%)", "米白色"],
  "orange": ["#FFA500", "hue-rotate(345deg) brightness(159%) saturate(102%) contrast(120%)", "橘色"],
  "orangered": ["#FF4500", "hue-rotate(297deg) brightness(115%) saturate(122%) contrast(160%)", "橘红色"],
  "papayawhip": ["#FFEFD5", "hue-rotate(341deg) brightness(199%) saturate(11%) contrast(220%)", "木瓜色"],
  "peachpuff": ["#FFDAB9", "hue-rotate(312deg) brightness(190%) saturate(12%) contrast(270%)", "桃黄色"],
  "omenpink": ["#FFC0CB", "hue-rotate(299deg) brightness(180%) saturate(15%) contrast(270%)", "粉色"],
  "omenred": ["#FF0000", "hue-rotate(306deg) brightness(85%) saturate(190%) contrast(200%)", "红色"],
  "seashell": ["#FFF5EE", "hue-rotate(1deg) brightness(199%) saturate(5%) contrast(220%)", "贝白色"],
  "snow": ["#FFFAFA", "hue-rotate(1deg) brightness(205%) saturate(0%) contrast(220%)", "雪白色"],
  "tomato": ["#FF6347", "hue-rotate(311deg) saturate(130%) brightness(135%) contrast(100%)", "番红色"],
  "white": ["#FFFFFF", "hue-rotate(0deg) brightness(205%) saturate(0%) contrast(220%)", "白色"],
  "yellow": ["#FFFF00", "hue-rotate(11deg) brightness(205%) saturate(10%) contrast(220%)", "黄色"]
}

/**
 * Export `color`
 */

/**
 * Get a color from a hex value
 *
 * @param {String} hex
 * @param {Object} color_map
 * @return {String} color
 * @api public
 */
window.colorNamer = function(hex, color_map) {
	color_map = color_map || colors;
	var rgb = h2r(hex);
	var min = Infinity;
	var closest = null;

	for (var color in color_map) {
		var rgb2 = h2r(color_map[color][0])

		// distance formula
		var dist = Math.pow((rgb.r - rgb2.r) * .299, 2)
			+ Math.pow((rgb.g - rgb2.g) * .587, 2)
			+ Math.pow((rgb.b - rgb2.b) * .114, 2);

		if (dist <= min) {
			closest = color;
			min = dist;
		}
	}

	return closest;
}

window.colorNameTranslate = function(name, mode) {
  return (mode == "spaced name") ? colors[name][2] : (mode == "hex") ? colors[name][0] : colors[name][1]
}

/**
 * Hex to RGB
 *
 * @param {String} hex
 * @return {Object} rbg
 */

function h2r(hex) {
  hex = '#' == hex[0] ? hex.slice(1) : hex;
  if (h2rs[hex]) return h2rs[hex];
  var int = parseInt(hex, 16);
  var r = (int >> 16) & 255;
  var g = (int >> 8) & 255;
  var b = int & 255;
  return h2rs[hex] = { r: r, g: g, b: b };
}
