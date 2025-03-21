const express = require("express");
const xlsx = require("xlsx");
const cors = require("cors");
const morgan = require("morgan");

const app = express();
app.use(morgan(`dev`))
app.use(cors());
app.use(express.json());

// Load and Read Excel File
const workbook = xlsx.readFile("./dataSet/students.xlsx");
const sheet_name = workbook.SheetNames[0];
const studentData = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name]);

app.get("/", (req,res) => {
    res.send("Welcome to Student API");
})

// Search API - Filter by Enrollment, Name, Branch, CGPA, Skills, etc.
app.get("/search", (req, res) => {
    const { enrollment, name, branch, cgpa, placed, skills, attendance } = req.query;

    let results = studentData.filter(student => {
        return (
            (!enrollment || student["Enrollment Number"] == enrollment) &&
            (!name || student["Name"].toLowerCase().includes(name.toLowerCase())) &&
            (!branch || student["Branch"].toLowerCase() === branch.toLowerCase()) &&
            (!cgpa || parseFloat(student["CGPA"]) >= parseFloat(cgpa)) &&
            (!placed || student["Placement Status"].toLowerCase() === placed.toLowerCase()) &&
            (!skills || student["Skills"].toLowerCase().includes(skills.toLowerCase())) &&
            (!attendance || parseFloat(student["Attendance (%)"]) >= parseFloat(attendance))&&
            (!cgpa || parseFloat(student["CGPA"]) >= parseFloat(cgpa))
        );
    });
    
    res.json(results.length ? results : { message: "No student found" });
    console.log(results[0].Name);
    
});


app.get('/sum', (req,res)=>{
    const a = Number(req.query.a) //1
    const b = Number(req.query.b) //2 

   const sum =  a + b

    
    res.send(`The sum of ${a} and ${b} is ${sum}`)
})

app.use((req, res) => {
    res.status(404).json({ message: "Route not created by shivam" });
});


// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
