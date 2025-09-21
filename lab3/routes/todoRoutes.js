import fs from "fs/promises";
import express from "express";
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const todosPath = path.join(__dirname, "/../data/todos.json");

const router = express.Router();

async function getTodos() {
    try {
        const data = await fs.readFile(todosPath, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Failed to read todos file:", error);
        throw new Error("Could not read data file.");
    }
}

function updateTodos(todos) {
    return fs.writeFile(todosPath, JSON.stringify(todos, null, 4)); 
}

router.get("/", async (req, res) => {
    try {
        const todos = await getTodos();
        res.send({
            "items": todos,
            "total": todos.length
        });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const todos = await getTodos();
        const todo = todos.find((t) => t.id === parseInt(id));

        if (!todo) {
            return res.status(404).json({ error: "todo not found" });
        }
        res.send(todo);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        let todos = await getTodos();
        const todoIndex = todos.findIndex((t) => t.id === parseInt(id));

        if (todoIndex === -1) {
            return res.status(404).end();
        }

        todos = todos.filter(t => t.id !== parseInt(id));
        await updateTodos(todos);

        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;