/*
 * Created by aimozg on 23.11.2022.
 */
(() => {
	const PlainObjectPrototype = Object.getPrototypeOf({});

	function isSimpleObject(o) {
		return Object.getPrototypeOf(o) === PlainObjectPrototype;
	}

	/**
	 * Compresses JSON objects.
	 *
	 * Usage:
	 *
	 * let sourceData = { "the": "object to compress" }
	 * let wkv = [0,1,2,3,4,5,6,7,8,9,true,false,"t","f","n"]; well-known values, predefined dictionary
	 * let compressedJson = new JsonCompressor(wkv).compress(sourceData);
	 * // serialize compressedJson
	 * let decompressedJson = new JsonDecompressor(wkv).decompress(compressedJson);
	 * console.log(JSON.stringify(decompressedJson) === JSON.stringify(sourceData)); // prints true.
	 *
	 * Encoding algorithm:
	 * - Empty arrays are compressed as []
	 * - Arrays are compressed as [0, ...values] (values are compressed)
	 * - Object are compressed as [1, key1, value1, key2, value2, ...] (keys and values are compressed)
	 * - Primitives (with some exceptions) are compressed as their number index in the dictionary
	 * - Negative, non-integer, and non-finite numbers are left unchanged
	 * - All other objects (non-primitive objects) are left unchanged
	 * - External "Well known values" can be supplied - they are added as first elements in the dictionary.
	 *
	 * For example:
	 * - wellKnownvalues = [0, 1, true]
	 * - compressing {0:true, 1:false, 2:null}
	 * - working dictionary = {0:0, 1:1, 2:true, 3:false, 4:2, 5:null}
	 * - compressed dictionary = dictionary values without wellKnownValues = [false, 2, null]
	 * - compressed data = [1, 0, 2, 1, 3, 4, 5].
	 *
	 * To properly decompress, EXACTLY SAME "wellKnownValues" should be provided as the one used for compression!
	 *
	 */
	class JsonCompressor {
		constructor(wellKnownValues = []) {
			this.wellKnownValues = wellKnownValues;
			const val2idx = new Map();
			let next = 0;
			for (const wkv of this.wellKnownValues) {
				const id = next++; /* .toString(36) */
				val2idx.set(wkv, id);
			}
			this.initial_val2idx = val2idx;
		}

		get(value) {
			if (this.val2idx.has(value)) return this.val2idx.get(value);
			const id = this.next++; /* .toString(36) */
			this.val2idx.set(value, id);
			this.idx2val.push(value);
			return id;
		}

		compress1(object) {
			if (typeof object === "number") {
				// Indices are positive integers, so all other numbers can be left uncompressed
				if (!isFinite(object) || object < 0 || Math.floor(object) !== object) return object;
				return this.get(object);
			}
			if (typeof object === "string" || typeof object === "boolean" || object === null || object === undefined) return this.get(object);
			if (typeof object !== "object") return object;
			if (Array.isArray(object)) {
				if (object.length === 0) return [];
				return [0, ...object.map(x => this.compress1(x))];
			}
			if (!isSimpleObject(object)) return object;
			const result = [1];
			for (let [k, v] of Object.entries(object)) {
				k = this.get(k);
				result.push(k);
				v = this.compress1(v);
				result.push(v);
			}
			return result;
		}

		reset() {
			this.val2idx = new Map(this.initial_val2idx);
			this.idx2val = [];
			this.next = this.val2idx.size;
		}

		compress(object) {
			this.reset();
			const data = this.compress1(object);
			return {
				compressed: 1,
				values: this.idx2val,
				data,
			};
		}
	}

	class JsonDecompressor {
		constructor(wellKnownValues = []) {
			this.wellKnownValues = wellKnownValues;
		}

		decompress1(object) {
			if (typeof object === "number") {
				if (isFinite(object) && object >= 0 && object < this.idx2val.length && object === Math.floor(object)) return this.idx2val[object];
			}
			if (typeof object === "string" && object in this.idx2val) {
				return this.idx2val[object];
			}
			if (typeof object === "object" && object !== null) {
				if (Array.isArray(object)) {
					if (object.length === 0) return [];
					if (object[0] === 0) {
						// array
						const result = Array(object.length - 1);
						for (let i = 1; i < object.length; i++) {
							result[i - 1] = this.decompress1(object[i]);
						}
						return result;
					} else if (object[0] === 1) {
						// object
						const result = {};
						for (let i = 1; i < object.length; ) {
							const k = this.decompress1(object[i++]);
							const v = this.decompress1(object[i++]);
							result[k] = v;
						}
						return result;
					}
				}
				return object;
			}
			return object;
		}

		decompress(object) {
			if (!JsonDecompressor.isCompressed(object)) throw new Error("Not a valid compressed object");
			this.idx2val = [...this.wellKnownValues, ...object.values];
			return this.decompress1(object.data);
		}
	}
	JsonDecompressor.isCompressed = function (object) {
		return object.compressed === 1 && Array.isArray(object.values) && "data" in object;
	};
	window.JsonCompressor = JsonCompressor;
	window.JsonDecompressor = JsonDecompressor;
})();
