import fs from "fs/promises";
import { Command } from "commander";

const program = new Command();

const [, , action] = process.argv;

const data = await fs.readFile("../users.json", "utf-8");
let parsedData = JSON.parse(data);

if (!Array.isArray(parsedData)) parsedData = [parsedData];

program
  .command("add")
  .argument("<name>")
  .action((name) => {
    if (!isNaN(name)) {
      console.error("Please add a valid name");
      return;
    }
    const existedName = parsedData.some(function (users) {
      return users.name === name;
    })

    if (existedName) {
      console.error("This name already exists, please choose another name!");
      return
    }

    let newId;
    if (parsedData.length > 0) {
      newId =
        Math.max(
          ...parsedData.map(function (users) {
            return users.id || 0;
          })
        ) + 1;
    } else {
      newId = 1
    }
    const newUser = { id: newId, name };
    parsedData.push(newUser);
    fs.writeFile("../users.json", JSON.stringify(parsedData, null, 2));
    console.log("New User: ", newUser, "is Added");
  })

program
  .command("remove")
  .argument("<id>")
  .action((userID) => {
    const id = Number(userID);

    if (isNaN(id)) {
      console.error("Please add a valid id");
      return;
    }
    const existedID = parsedData.some(function (users) {
      return users.id === id;
    })

    if (!existedID) {
      console.error("This id doesn't exist");
      return;
    }

    const updatedUsers = parsedData.filter(function (user) {
      return user.id !== id;
    });

    fs.writeFile("../users.json", JSON.stringify(updatedUsers, null, 2));

    console.log("User with id:", id, "is deleted");
  })

program.command("getAll").action(() => {
  console.log(parsedData);
})

program
  .command("getOne")
  .argument("<id>")
  .action((userID) => {
    const id = Number(userID);
    if (isNaN(id)) {
      console.error("Please add a valid id");
      return;
    }
    const user = parsedData.find(function (user) {
      return user.id === id;
    });
    if (!user) {
      console.error("User not found");
      return;
    }
    console.log(user);
  })

program
  .command("edit")
  .argument("<id>")
  .argument("<newName>")
  .action((userID, newName) => {
    const id = Number(userID);
    if (isNaN(id)) {
      console.error("Please add a valid id");
      return;
    }
    if (!isNaN(newName) || newName === undefined) {
      console.error("Please add a valid name");
      return;
    }
    const userIndex = parsedData.findIndex(function (user) {
      return user.id === id;
    });
    if (userIndex === -1) {
      console.error("This user does not exist");
      return;
    }
    parsedData[userIndex].name = newName;
    fs.writeFile("../users.json", JSON.stringify(parsedData, null, 2));
    console.log("User is updated:", parsedData[userIndex]);
  })

const knownCommands = program.commands.map(cli => cli.name());
if(knownCommands.includes(action)) {
    program.parse(process.argv);
}