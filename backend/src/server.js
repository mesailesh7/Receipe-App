import express from "express";
import "dotenv/config";
import {ENV} from "./config/env.js";
import {db} from "./config/db.js";
import {favoritesTable} from "./db/schema.js";
import {and, eq} from "drizzle-orm";

const app = express();
//to get the request from the body
app.use(express.json());

const PORT = ENV.PORT || 8001;


app.get("/api/health", (req, res) => {
    res.status(200).json({success: true});
});


app.post("/api/favorites", async (req, res) => {
    try {
        const {userId, recipeId, title, image, cookTime, servings} = req.body;
        if (!userId || !recipeId || !title) {
            return res.status(400).json({error: "Missing required fields"});
        }


        const newFavorite = await db.insert(favoritesTable).values({
            userId,
            recipeId,
            title,
            image,
            cookTime,
            servings
        }).returning() // to save it and in returning() if you don't pass anything it's going to return everything

        res.status(200).json(newFavorite[0]);

    } catch (error) {
        console.log("Error adding favorite", error)
        res.status(500).json({error: error.message});
    }
})

app.delete("/api/favorites/:userId/:recipeId", async (req, res) => {
    try {
        const {userId, recipeId} = req.params;

        await db
            .delete(favoritesTable)
            .where(
                and(eq(favoritesTable.userId, userId), eq(favoritesTable.recipeId, parseInt(recipeId)))
            )

        res.status(200).json({message: "Favorite deleted successfully"});

    } catch (e) {
        console.log("Error deleteing favorites", req.params.userId)
        res.status(500).json({error: e});
    }
})


app.get("/api/favorites/:userId", async (req, res) => {

    try {
        const {userId} = req.params;

        const userFavorites = await db.select().from(favoritesTable).where(eq(favoritesTable.userId, userId));

        res.status(200).json(userFavorites);
        // res.json(userFavorites);

    } catch (e) {
        console.log("Error adding favorite", e);
        res.status(500).json({error: e});
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT} `);
});


