/**
 * Class for the signal package which will be send to web socket clients
 */
export class DeliveryPackage {
  constructor(maxChunks) {
    /** Number of accummulated packages in the current array */
    this.chunks = 0;
    /** Maximum number of packages which can be accumulated into one package */
    this.maxChunks = maxChunks;
    /** Actual data of the package */
    this.array = [];
  }

  /**
   * Reset the package
   */
  reset() {
    this.chunks = 0;
    this.array = [];
  }

  /**
   * Append the content of the array to the package
   * @param {Float64Array} data
   * @throws {Error} If the number of accumulated packages exceeds the max chunks value
   */
  append(data) {
    if (this.chunks < this.maxChunks) {
      this.chunks += 1;
      this.array.push(...data);
    } else throw Error("Exceeded capacity of package");
  }
}
