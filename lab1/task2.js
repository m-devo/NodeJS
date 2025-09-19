import fs from "fs/promises";

const data = await fs.readFile("../users.json", "utf-8");
let parsedData = JSON.parse(data);
// console.log("🚀 ~ parsedData:", parsedData);
const [, , action] = process.argv;

if (!Array.isArray(parsedData)) parsedData = [parsedData];
// await fs.writeFile("../users.json", JSON.stringify(parsedData, null, 2));

function add() {
    const name = process.argv[3];

    if (!isNaN(name)) {
        console.error("Please add a valid name");
        return
    }
    const existedName = parsedData.some(function (users) {
        return users.name === name
    });

    if (existedName) {
        console.error("This name already exists, please choose another name!");
        return
    }

    let newId;
    if (parsedData.length > 0) {
        newId = Math.max(...parsedData.map(function (users) {
            return users.id || 0;
        })) + 1
    } else {
        newId = 1
    }
    const newUser = { id: newId, name };
    parsedData.push(newUser);
    fs.writeFile("../users.json", JSON.stringify(parsedData, null, 2))
    console.log("New User: ", newUser, "is Added")

}

function remove() {
    const id = Number(process.argv[3]);

    if (isNaN(id)) {
        console.error("Please add a valid id");
        return;
    }
    const existedID = parsedData.some(function (users) {
        return users.id === id;
    });

    if (!existedID) {
        console.error("This id doesn't exist");
        return;
    }

    const updatedUsers = parsedData.filter(function (user) { 
        return user.id !== id;
    });

    fs.writeFile("../users.json", JSON.stringify(updatedUsers, null, 2));

    console.log("User with id:", id, "is deleted");
}

function getAll() {
    console.log(parsedData);
}

function getOne() {
    const id = Number(process.argv[3]);
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
}

function edit() {
    const id = Number(process.argv[3]);
    const newName = process.argv[4];
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
}

switch (action) {
    case 'add':
        add();
        break;
    case 'remove':
        remove();
        break;
    case 'getOne':
        getOne();
        break;
    case 'edit':
        edit();
        break;
    case 'getAll':
        getAll();
        break;
    default:
        break;
}

// add name -> unique id
// remove id
// edit id www