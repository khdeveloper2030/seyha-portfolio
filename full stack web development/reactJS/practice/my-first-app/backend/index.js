const express = require('express');
const cors = require('cors');
const db = require('./models'); // ហៅ Folder models ដែលមាន index.js សម្របសម្រួល DB

const app = express();

// ១. ការកំណត់ Middleware
// ត្រូវដាក់ cors() នៅខាងលើគេបង្អស់ ដើម្បីឱ្យ React អាចទាក់ទងមកបាន
app.use(cors()); 
// ត្រូវមាន express.json() ដើម្បីឱ្យ Node.js ស្គាល់ទិន្នន័យ JSON ដែលផ្ញើមកពី React
app.use(express.json()); 

// ២. Route សម្រាប់ទាញទិន្នន័យសិស្សទាំងអស់ (GET)
app.get('/students', async (req, res) => {
  try {
    // db.Student គឺយកឈ្មោះតាម Model ដែលអ្នកបានបង្កើត (Student.js)
    const students = await db.Student.findAll({
      order: [['id', 'DESC']] // បង្ហាញសិស្សដែលទើបបញ្ចូលថ្មីនៅខាងលើគេ
    });
    res.json(students);
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ error: err.message });
  }
});

// Route សម្រាប់លុបទិន្នន័យសិស្សតាមរយៈ ID
app.delete('/students/:id', async (req, res) => {
  try {
    const { id } = req.params; // ចាប់យក ID ពី URL
    const deleted = await db.Student.destroy({
      where: { id: id }
    });

    if (deleted) {
      res.json({ message: "លុបទិន្នន័យជោគជ័យ!" });
    } else {
      res.status(404).json({ message: "រកមិនឃើញសិស្សនេះទេ" });
    }
  } catch (err) {
    console.error("Error deleting student:", err);
    res.status(500).json({ error: err.message });
  }
});

// ៣. Route សម្រាប់បន្ថែមសិស្សថ្មី (POST)
app.post('/add-student', async (req, res) => {
  try {
    const { name, age, grade } = req.body;
    
    // បង្កើតទិន្នន័យថ្មីក្នុង PostgreSQL
    const newStudent = await db.Student.create({ 
      name, 
      age: parseInt(age), // ប្តូរអាយុទៅជាលេខដើម្បីកុំឱ្យ Error
      grade 
    });
    
    console.log("បានបន្ថែមសិស្សថ្មី៖", newStudent.name);
    res.status(201).json(newStudent);
  } catch (err) {
    console.error("Error creating student:", err);
    res.status(500).json({ error: err.message });
  }
});

// ៤. ភ្ជាប់ជាមួយ Database រួចទើបបើក Server
const PORT = 5000;

// sequelize.sync() នឹងឆែកមើល Table ក្នុង Postgres ឱ្យត្រូវជាមួយ Model
db.sequelize.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log("------------------------------------------");
      console.log(`🚀 Server is running on: http://localhost:${PORT}`);
      console.log("✅ Database status: Connected successfully!");
      console.log("------------------------------------------");
    });
  })
  .catch((err) => {
    console.error("❌ Unable to connect to the database:");
    console.error("មូលហេតុ៖", err.message);
    console.log("\n💡 គន្លឹះ៖ ពិនិត្យមើល config/config.json ថា User/Pass ត្រូវឬនៅ?");
  });