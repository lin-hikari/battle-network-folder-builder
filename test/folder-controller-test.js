const expect = require("chai").expect;
const sinon = require("sinon");
const mongoose = require("mongoose");

const FolderController = require("../controllers/folder-controller");
const User = require("../models/user");
const Folder = require("../models/folder");

describe("Folder Controller", function () {
  describe("Create Folder", function () {
    function dummyUserFindByIt(username, email, pw, folderNum) {
      sinon.stub(User, "findById").returns(
        new User({
          username: username,
          email: email,
          password: pw,
          folders: new Array(folderNum),
        })
      );
    }

    before(function () {
      sinon.stub(Folder.prototype, "save").callsFake(function () {
        if (!this.name)
          return Promise.reject(
            new Error(
              "Folder validation failed: name: Path `name` is required."
            )
          );

        if (!this.description)
          return Promise.reject(
            new Error(
              "Folder validation failed: name: Path `description` is required."
            )
          );
        Promise.resolve({ status: 200 });
      });

      sinon.stub(User.prototype, "save").returns();
    });

    after(function () {
      Folder.prototype.save.restore();
      User.prototype.save.restore();
    });

    afterEach(function () {
      User.findById.restore();
    });

    it("should throw an error (400) if the user is not found", async function () {
      sinon.stub(User, "findById").returns(null);

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

      expect(errorInfo).to.be.an("error");
      expect(errorInfo).to.have.property("statusCode", 400);
      expect(errorInfo).to.have.property("message", "User not found!");
    });

    it("should throw an error (400) if max number of folders is reached", async function () {
      dummyUserFindByIt("dummy", "dummy@mail.com", "dummy", 10);

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

      expect(errorInfo).to.be.an("error");
      expect(errorInfo).to.have.property("statusCode", 400);
      expect(errorInfo).to.have.property(
        "message",
        "Max number of folders reached!"
      );
    });

    it("should add one folder reference to user who created it", async function () {
      dummyUserFindByIt("dummy", "dummy@mail.com", "dummy", 0);

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

      expect(user.folders[0]._id).to.be.equal(res.newFolder._id);
      expect(user.folders).to.have.length(1);
    });

    it("should send a success message (201) if folder is created successfully", async function () {
      dummyUserFindByIt("dummy", "dummy@mail.com", "dummy", 0);

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
      await FolderController.createFolder(req, res, () => {});

      expect(res.statusCode).to.be.equal(201);
      expect(res.message).to.be.equal("Folder created successfully!");
    });

    it("should throw an error (500) if no folder name is provided", async function () {
      dummyUserFindByIt("dummy", "dummy@mail.com", "dummy", 0);

      const req = {
        body: {
          description: "folderDesc",
        },
        userId: new mongoose.Types.ObjectId(),
      };
      let errorInfo;
      await FolderController.createFolder(req, {}, (err) => {
        errorInfo = err;
      });

      expect(errorInfo).to.be.an("error");
      expect(errorInfo).to.have.property("statusCode", 500);
      expect(errorInfo).to.have.property(
        "message",
        "Folder validation failed: name: Path `name` is required."
      );
    });

    it("should throw an error (500) if no folder description is provided", async function () {
      dummyUserFindByIt("dummy", "dummy@mail.com", "dummy", 0);

      const req = {
        body: {
          name: "folderName",
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
      let errorInfo;
      await FolderController.createFolder(req, res, (err) => {
        errorInfo = err;
      });

      expect(errorInfo).to.be.an("error");
      expect(errorInfo).to.have.property("statusCode", 500);
      expect(errorInfo).to.have.property(
        "message",
        "Folder validation failed: name: Path `description` is required."
      );
    });
  });

  // describe("Delete Folder", function () {
  //   it("should throw an error (400) if user is not found", function () {});

  //   it("should throw an error (404) if folder is not found", function () {});

  //   it("should throw an error (401) if folder does not belong to user", function () {});

  //   it("should remove the folder reference to the user who created it", function () {});

  //   it("should send a success message (200) if folder is deleted successfully", function () {});
  // });

  // describe("View Folder", function () {
  //   it("should throw an error (422) if folder id format is invalid", function () {});

  //   it("should throw an error (404) if folder is not found", function () {});

  //   it("should return the folder with populated info of chips", function () {});

  //   it("should send a success message (200) if folder data is returned successfully", function () {});
  // });

  // describe("Add Chip to Folder", function () {
  //   it("should throw an error (404) if folder is not found", function () {});

  //   it("should throw an error (401) if folder does not belong to user", function () {});

  //   it("should throw an error (404) if chip is not found", function () {});

  //   it("should throw an error (400) if folder is full", function () {});

  //   it("should add to the folder a reference of the chip added", function () {});

  //   it("should send a success message (200) if chip is added to folder successfully", function () {});
  // });

  // describe("Remove Chip from Folder", function () {
  //   it("should throw an error (404) if folder is not found", function () {});

  //   it("should throw an error (401) if folder does not belong to user", function () {});

  //   it("should throw an error (404) if chip is not found", function () {});

  //   it("should throw an error (404) if chip is not found in folder", function () {});

  //   it("should remove from the folder the reference of the chip removed", function () {});

  //   it("should send a success message (200) if chip is removed from folder successfully", function () {});
  // });
});
