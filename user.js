const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const app=express();
const PORT = 4000;
app.use(express.json());
app.listen(PORT, () => 
    console.log(`Server is running at http://localhost:${PORT}`));

app.use(express.json())
app.use(cors())
//MongoDB connection 
mongoose.connect("mongodb+srv://narmathakg12:narmatha@cluster0.mdc7tbw.mongodb.net/expenses?retryWrites=true&w=majority&appName=Cluster0")
 .then(()=> console.log("MongoDB Connected"))
 .catch((err) => console.error(err));

const expenseSchema = new mongoose.Schema({
    title: String,
    amount: Number,
});

const Expense = mongoose.model("Expense",expenseSchema);

//route
app.get("/api/expenses",async(req,res)=>{
    const expenses = await Expense.find();
    res.json(expenses);
});
app.post("/api/expenses",async (req, res) => {
    const { title, amount } = req.body;
    const newExpense = new Expense({ title, amount});
    await newExpense.save();
    res.status(201).json(newExpense);
});
app.listen(PORT, ()=>console.log(`Server running on port ${PORT}`));
app.delete("/api/expenses/:id", async (req, res) => {//id route parameter
    try{
        const { id } = req.params;
        const deletedExpense = await Expense.findByIdAndDelete(id);
        //mongoose function
        if (!deletedExpense) {
            return res.status(404).json({ message: "Expense not found" });
        }
        res.json({ message: "Deleted", deleted: deletedExpense });
    }
    catch (error) {
        console.error("Error deleting expense:", error.message);
        res.status(500).json({ message: "Server error" });
    }   
})
