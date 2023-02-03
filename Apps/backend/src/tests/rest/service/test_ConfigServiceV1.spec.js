
// Unit Test Code

import fs from "fs";
import { PATH_PRESET } from "../../../const.js";
import configService from "../../../rest/service/ConfigServiceV1.js";
import {jest} from '@jest/globals'

describe("ConfigService", () => {
  describe("getConfigs()", () => {
    it("should return an array of preset names", () => {
      const files = ["test1.json", "test2.json"];

      jest.spyOn(fs, "readdirSync").mockReturnValue(files);

      expect(configService.getConfigs()).toEqual(["test1", "test2"]);

      fs.readdirSync.mockRestore();
    });

    it("should return an empty array if there is an error", () => {
      jest.spyOn(fs, "readdirSync").mockImplementation(() => {
        throw new Error();
      });

      expect(configService.getConfigs()).toEqual([]);

      fs.readdirSync.mockRestore();
    });
  });

  describe("getConfigById()", () => {
    it("should return a JSON object of the preset with the given id", () => {
      const file = `${PATH_PRESET}/test1.json`;

      const raw = '{"name": "Test 1"}';

      jest.spyOn(fs, "readFileSync").mockReturnValue(raw);

      expect(configService.getConfigById("test1")).toEqual({ name: "Test 1" });

      fs.readFileSync.mockRestore();
    });

    it("should return undefined if there is an error", () => {
      jest.spyOn(fs, "readFileSync").mockImplementation(() => {
        throw new Error();
      });

      expect(configService.getConfigById("test1")).toBeUndefined();

      fs.readFileSync.mockRestore();
    });  });
});
