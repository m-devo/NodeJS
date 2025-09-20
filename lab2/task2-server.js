import http from "http";
import fs from "fs/promises";
import { content } from "./main.js";
const PORT = 3000;
const cssContent = await fs.readFile("lab2/styles.css", "utf-8");
let users = await fs.readFile("users.json", "utf-8");
let parsedUsers = JSON.parse(users);

const server = http.createServer(async (req, res) => {
    console.log(req.url);
    const reg = new RegExp(/^\/users\/\d*$/);

    switch (req.method) {
        case "GET":
            switch (req.url) {
                case "/":
                    res.writeHead(200, { "Content-Type": "text/html" });
                    res.end(content("menna"));
                    break;
                case "/styles.css":
                    res.writeHead(200, { "Content-Type": "text/css" });
                    res.end(cssContent);
                    break;
                case "/users":
                case "/users/":
                    res.writeHead(200, { "content-type": "application/json" });
                    res.end(users);
                    break;
                default:
                    if (reg.test(req.url)) {
                        const id = req.url.split('/')[2];
                        const user = parsedUsers.find(u => u.id === parseInt(id));
                        if (!user) {
                            res.writeHead(404, { "content-type": "text/plain" });
                            res.end("NOT FOUND");
                            break;
                        }
                        res.writeHead(200, { "content-type": "application/json" });
                        res.end(JSON.stringify(user));
                    } else {
                        res.writeHead(404);
                        res.end(`<h1 style="color='red'"> Error!</h1>`);
                    }
                    break;
            }
            break;

        case "POST":
            if (req.url === "/users" || req.url === "/users/") {
                let body = "";
                req
                    .on("data", (chunk) => {
                        body += chunk.toString();
                    })
                    .on("end", async () => {
                        try {
                            const user = JSON.parse(body);
                            const latestId = parsedUsers.length > 0 ? Math.max(...parsedUsers.map(u => u.id)) : 0;
                            user.id = latestId + 1;
                            parsedUsers.push(user);
                            await fs.writeFile("./users.json", JSON.stringify(parsedUsers, null, 2));
                            res.writeHead(201, { "content-type": "application/json" });
                            res.end(JSON.stringify({
                                'status': true,
                                'message': "user added successfully"
                            }));
                        } catch (error) {
                            res.writeHead(400, { "content-type": "application/json" });
                            res.end(JSON.stringify({
                                'status': false,
                                'message': "Error: " + error.message
                            }));
                        }
                    });
            } else {
                res.writeHead(404);
                res.end("Not Found");
            }
            break;

        case "PUT":
            if (reg.test(req.url)) {
                const id = req.url.split('/')[2];
                const userIndex = parsedUsers.findIndex(u => u.id === parseInt(id));

                if (userIndex === -1) {
                    res.writeHead(404, { "content-type": "application/json" });
                    res.end(JSON.stringify({
                        'status': false,
                        'message': "user not found"
                    }));
                    return;
                }

                let body = "";
                req
                    .on("data", (chunk) => {
                        body += chunk.toString();
                    })
                    .on("end", async () => {
                        try {
                            const updatedData = JSON.parse(body);
                            parsedUsers[userIndex] = { ...parsedUsers[userIndex], ...updatedData, id: parseInt(id) };
                            await fs.writeFile("./users.json", JSON.stringify(parsedUsers, null, 2));
                            res.writeHead(200, { "content-type": "application/json" });
                            res.end(JSON.stringify({
                                'status': true,
                                'message': "user updated successfully"
                            }));
                        } catch (error) {
                            res.writeHead(400, { "content-type": "application/json" });
                            res.end(JSON.stringify({
                                'status': false,
                                'message': "Error: " + error.message
                            }));
                        }
                    });
            } else {
                res.writeHead(401, { "content-type": "application/json" });
                res.end(JSON.stringify({
                    'status': false,
                    'message': "invalid input"
                }));
            }
            break;

        case "DELETE":
            if (reg.test(req.url)) {
                const id = req.url.split('/')[2];
                const userIndex = parsedUsers.findIndex(u => u.id === parseInt(id));

                if (userIndex === -1) {
                    res.writeHead(404, { "content-type": "application/json" });
                    res.end(JSON.stringify({
                        'status': false,
                        'message': "user not found"
                    }));
                    return;
                }

                parsedUsers.splice(userIndex, 1);
                await fs.writeFile("./users.json", JSON.stringify(parsedUsers, null, 2));
                res.writeHead(200, { "content-type": "application/json" });
                res.end(JSON.stringify({
                    'status': true,
                    'message': "user deleted successfully"
                }));
            } else {
                res.writeHead(401, { "content-type": "application/json" });
                res.end(JSON.stringify({
                    'status': false,
                    'message': "invalid input"
                }));
            }
            break;

        default:
            res.writeHead(404);
            res.end("invalid method");
            break;
    }
});

server.listen(PORT, "localhost", () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});