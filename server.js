const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const appPort = 27017; // 將應用程式伺服器的埠號修改為 3000

app.set('view engine', 'ejs');

// Connect to MongoDB (replace with your own MongoDB connection string)
mongoose.connect('mongodb://127.0.0.1:27017/question-and-answer', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error.message);
});

// Define a simple database model
const Question = mongoose.model('Question', { studentName: String, questionText: String, teacherAnswer: String });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Display questions and answers
app.get('/', async (req, res) => {
  const questions = await Question.find();
  res.render('index', { questions });
});

// Post a new question
app.post('/ask', async (req, res) => {
  const { studentName, questionText } = req.body;
  const newQuestion = new Question({ studentName, questionText });
  await newQuestion.save();
  res.redirect('/');
});

// Post a teacher's answer
app.post('/answer/:id', async (req, res) => {
  const { id } = req.params;
  const { teacherAnswer } = req.body;
  await Question.findByIdAndUpdate(id, { teacherAnswer });
  res.redirect('/');
});

app.listen(appPort, () => {
  console.log(`Server is running on http://127.0.0.1:${appPort}`);
});
