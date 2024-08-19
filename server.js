const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');
const mongoose = require('mongoose');


app.use(express.json());


const mongoURI = 'mongodb+srv://saniulsaz:12345@roktodin.abnxvco.mongodb.net/CodeYoddha'; // or use your MongoDB Atlas connection string

mongoose.connect(mongoURI, { })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'src')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
  });
  app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'profile.html'));
  });

  app.get('/problemset', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'problemset.html'));
  });


app.use(express.static(path.join(__dirname, 'styles')));

app.get('/indexstyles', (req, res) => {
  res.sendFile(path.join(__dirname, 'styles', 'styles.css'));
});


app.get('/user/:handle', async (req, res) => {
    const { handle } = req.params;
    try {
      const response = await axios.get(`https://codeforces.com/api/user.info?handles=${handle}`);
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching data from Codeforces API', error });
    }
  });
  

//   app.get('/api/problems/:tags', async (req, res) => {
//     const { tags } = req.params;

//     try {
//         const response = await axios.get(`https://codeforces.com/api/problemset.problems?tags=${tags}`);
//         const problems = response.data.result.problems;

//         const formattedProblems = problems.map(problem => ({
//             contestId: problem.contestId,
//             index: problem.index,
//             name: problem.name,
//             type: problem.type,
//             tags: problem.tags
//         }));

//         res.json(formattedProblems);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching data from Codeforces API', error: error.message });
//     }
// });

app.get('/api/problems/:tags', async (req, res) => {
  const { tags } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
      const response = await axios.get(`https://codeforces.com/api/problemset.problems?tags=${tags}`);
      const problems = response.data.result.problems;

      // Implement pagination
      const total = problems.length;
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedProblems = problems.slice(start, end);

      const formattedProblems = paginatedProblems.map(problem => ({
          contestId: problem.contestId,
          index: problem.index,
          name: problem.name,
          type: problem.type,
          tags: problem.tags
      }));

      res.json({
          total,
          page,
          limit,
          problems: formattedProblems
      });
  } catch (error) {
      res.status(500).json({ message: 'Error fetching data from Codeforces API', error: error.message });
  }
});




app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
  });