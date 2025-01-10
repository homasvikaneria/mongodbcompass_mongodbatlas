const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

// MongoDB connection details
const uri = "mongodb://127.0.0.1:27017"; 
const dbName = "codinggita";

// Middleware
app.use(express.json());

let db, courses;

// Connect to MongoDB and initialize collections
async function initializeDatabase() {
    try {
        const client = await MongoClient.connect(uri);
        console.log("Connected to MongoDB");

        db = client.db(dbName);
        courses = db.collection("courses");

        // Start server after successful DB connection
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1); // Exit if database connection fails
    }
}


// Initialize Database
initializeDatabase();

// Routes

// GET: List all students
app.get('/courses', async (req, res) => {
    try {
        const allcourses = await courses.find().toArray();
        res.status(200).json(allcourses);
    } catch (err) {
        res.status(500).send("Error fetching students: " + err.message);
    }
});

// POST: Add a new student
app.post('/courses', async (req, res) => {
    try {
        // console.log();
        const newcourses = req.body;
        const result = await courses.insertOne(newcourses);
        res.status(201).send(`courses added with ID: ${result.insertedId}`);
    } catch (err) {
        res.status(500).send("Error adding courses: " + err.message);
    }
});

// PUT: Update a student completely
app.put('/courses/:courseName', async (req, res) => {
    try {
        // Log request details for debugging
        console.log("request Params : ", req.params); // Params contains courseName
        console.log("request body:", req.body); // Body contains the updated course data

        const courseName = req.params.courseName; // Course name from URL parameter
        const updatedCourse = req.body; // The updated course details sent in the request body

        // Perform the update in the database
        const result = await courses.replaceOne(
            { courseName }, // Find the course by its courseName
            updatedCourse // Replace it with the updated course object
        );

        // Check if the update was successful
        if (result.modifiedCount > 0) {
            res.status(200).send(`${result.modifiedCount} document(s) updated`);
        } else {
            res.status(404).send('Course not found or no changes made');
        }
    } catch (err) {
        res.status(500).send("Error updating courses: " + err.message);
    }
});


// PATCH: Partially update a student
app.patch('/courses/:courseName', async (req, res) => {
    try {
        const courseName = (req.params.courseName);
        const updates = req.body;
        const result = await courses.updateOne({ "courseName":courseName }, { $set: updates });
        res.status(200).send(`${result.modifiedCount} document(s) updated`);
    } catch (err) {
        res.status(500).send("Error partially updating courses: " + err.message);
    }
});

// DELETE: Remove a student by roll no
app.delete('/students/:rollNumber', async (req, res) => {
    try {
        const rollNumber = parseInt(req.params.rollNumber);
        const result = await students.deleteOne({ rollNumber });
        res.status(200).send(`${result.deletedCount} document(s) deleted`);
    } catch (err) {
        res.status(500).send("Error deleting student: " + err.message);
    }
});

// DELETE: Remove a course by coursename
app.delete('/courses/delbyname/:courseName', async (req, res) => {
    try {
        const courseName = (req.params.courseName);
        const result = await courses.deleteOne({ "courseName":courseName });
        res.status(200).send(`${result.deletedCount} document(s) deleted`);
    } catch (err) {
        res.status(500).send("Error deleting course: " + err.message);
    }
});
                                                        