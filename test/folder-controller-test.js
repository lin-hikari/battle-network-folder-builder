const expect = require("chai").expect;
const sinon = require("sinon");
const mongoose = require("mongoose");

const FolderController = require("../controllers/folder-controller");
const User = require("../models/user");
const Folder = require("../models/folder");

describe("Folder Controller", function () {
  describe("Create Folder", function () {
    it("should throw an error (400) if the user is not found", async function () {
      sinon.stub(User, "findById");
      User.findById.returns(null);

      const req = {
        body: {
          name: "folderName",
          description: "folderDesc",
          creator: "abc123",
        },
      };
      let errorInfo;
      await FolderController.createFolder(req, {}, (err) => {
        errorInfo = err;
      });

      User.findById.restore();
      expect(errorInfo).to.be.an("error");
      expect(errorInfo).to.have.property("statusCode", 400);
      expect(errorInfo).to.have.property("message", "User not found!");
    });

    it("should throw an error (400) if max number of folders is reached", async function () {
      sinon.stub(User, "findById");
      User.findById.returns(
        new User({
          username: "dummy",
          email: "dummy@mail.com",
          password: "dummy",
          folders: new Array(10),
        })
      );

      const req = {
        body: {
          name: "folderName",
          description: "folderDesc",
          creator: "abc123",
        },
      };
      let errorInfo;
      await FolderController.createFolder(req, {}, (err) => {
        errorInfo = err;
      });

      User.findById.restore();
      expect(errorInfo).to.be.an("error");
      expect(errorInfo).to.have.property("statusCode", 400);
      expect(errorInfo).to.have.property(
        "message",
        "Max number of folders reached!"
      );
    });

    it("should add one folder reference to user who created it", async function () {
      sinon.stub(User, "findById");
      User.findById.returns(
        new User({
          username: "dummy",
          email: "dummy@mail.com",
          password: "dummy",
        })
      );
      sinon.stub(Folder.prototype, "save");
      Folder.prototype.save.returns();
      sinon.stub(User.prototype, "save");
      User.prototype.save.returns();

      const req = {
        body: {
          name: "folderName",
          description: "folderDesc",
        },
        userId: new mongoose.Types.ObjectId(),
      };
      const res = {
        status: function (code) {
          this.statusCode = code;
          return this;
        },
        json: function (data) {
          this.message = data.message;
          this.newFolder = data.newFolder;
        },
      };

      const user = await FolderController.createFolder(req, res, () => {});
      User.findById.restore();
      Folder.prototype.save.restore();
      User.prototype.save.restore();

      expect(user.folders[0]._id).to.be.equal(res.newFolder._id);
      expect(user.folders).to.have.length(1);
    });

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
