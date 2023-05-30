const expect = require("chai").expect;
const sinon = require("sinon");

describe("Folder Controller", function () {
  describe("Create Folder", function () {
    it("should throw an error (400) if the user is not found", function () {});

    it("should throw an error (400) if max number of folders is reached", function () {});

    it("should add a folder reference to user who created it", function () {});

    it("should send a success message (201) if folder is created successfully", function () {});

    it("should throw an error (500) if no folder name is provided", function () {});

    it("should throw an error (500) if no folder description is provided", function () {});
  });

  describe("Delete Folder", function () {
    it("should throw an error (400) if user is not found", function () {});

    it("should throw an error (404) if folder is not found", function () {});

    it("should throw an error (401) if folder does not belong to user", function () {});

    it("should remove the folder reference to the user who created it", function () {});

    it("should send a success message (200) if folder is deleted successfully", function () {});
  });

  describe("View Folder", function () {
    it("should throw an error (422) if folder id format is invalid", function () {});

    it("should throw an error (404) if folder is not found", function () {});

    it("should return the folder with populated info of chips", function () {});

    it("should send a success message (200) if folder data is returned successfully", function () {});
  });

  describe("Add Chip to Folder", function () {
    it("should throw an error (404) if folder is not found", function () {});

    it("should throw an error (401) if folder does not belong to user", function () {});

    it("should throw an error (404) if chip is not found", function () {});

    it("should throw an error (400) if folder is full", function () {});

    it("should add to the folder a reference of the chip added", function () {});

    it("should send a success message (200) if chip is added to folder successfully", function () {});
  });

  describe("Remove Chip from Folder", function () {
    it("should throw an error (404) if folder is not found", function () {});

    it("should throw an error (401) if folder does not belong to user", function () {});

    it("should throw an error (404) if chip is not found", function () {});

    it("should throw an error (404) if chip is not found in folder", function () {});

    it("should remove from the folder the reference of the chip removed", function () {});

    it("should send a success message (200) if chip is removed from folder successfully", function () {});
  });
});
