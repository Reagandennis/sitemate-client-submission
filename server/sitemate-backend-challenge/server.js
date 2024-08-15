const express = require('express');
const cors = require('cors'); // Import cors
const app = express();
const port = 4000;

app.use(cors()); // Use cors middleware
app.use(express.json());

let issues = [
  { id: 1, title: "Issue 1", description: "This is the first issue" },
  { id: 2, title: "Issue 2", description: "This is the second issue" }
];

app.post('/issues', (req, res) => {
  const issue = req.body;
  issues.push(issue);
  console.log('Created:', issue);
  res.status(201).send(issue);
});

app.get('/issues', (req, res) => {
  res.json(issues);
});

app.put('/issues/:id', (req, res) => {
    const id = parseInt(req.params.id, 10); // Parse the ID to an integer
    const index = issues.findIndex(issue => issue.id === id); // Find the index of the issue with the given ID
    
    if (index !== -1) {
      issues[index] = { ...issues[index], ...req.body }; // Update the issue with new data
      console.log('Updated issue:', issues[index]); // Log the updated issue
      res.status(200).json(issues[index]); // Send the updated issue back to the client
    } else {
      res.status(404).json({ message: "Issue not found" }); // Send 404 response if the issue was not found
    }
  });
  
app.delete('/issues/:id', (req, res) => {
    const id = parseInt(req.params.id, 10); // Parse the ID to an integer
    const index = issues.findIndex(issue => issue.id === id); // Find the index of the issue with the given ID
    
    if (index !== -1) {
      const removedIssue = issues.splice(index, 1); // Remove the issue from the array
      console.log('Deleted issue:', removedIssue); // Log the deleted issue
      res.status(200).json({ message: "Issue deleted successfully", issue: removedIssue });
    } else {
      res.status(404).json({ message: "Issue not found" }); // Send 404 response if the issue was not found
    }
  });
  

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
