const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const pdf = require('pdf-parse'); // Use pdf-parse for text extraction
const serviceAccount = require('./firebase.json');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const {
  findGrammaticalErrors,

  evaluateText3,
} = require("./ai.js");

dotenv.config();

const bodyParser = require('body-parser');
// const { GoogleGenerativeAI } = require("@google/generative-ai");





// Initialize Firebase Admin SDK
initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();
const app = express();
const router = express.Router();

// Middleware to parse JSON bodies
app.use(express.json());

// Use CORS middleware
app.use(cors());

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(bodyParser.json());

// const apiKey = 'AIzaSyCPMP4cmqv3_Z4c-5-NS7Q2-aC4UKav0d4';

const apiKey = 'AIzaSyAlM7eYJntG24kjPc6W4t2Z9AaeFG_DUj8';
// const genAI = new GoogleGenerativeAI(apiKey);





// Endpoint to create a classroom with students
router.post('/create-classroom', async (req, res) => {
  const { className, students } = req.body;

  if (!className) {
    return res.status(400).json({ error: 'Classroom name is required' });
  }

  if (!Array.isArray(students) || students.length === 0) {
    return res.status(400).json({ error: 'Students array is required and should not be empty' });
  }

  try {
    const classroomRef = db.collection('classrooms').doc(className);
    await classroomRef.set({
      createdAt: new Date().toISOString(),
      name: className
    });

    const studentsCollectionRef = classroomRef.collection('students');
    const studentPromises = students.map(studentName =>
      studentsCollectionRef.doc(studentName).set({ name: studentName })
    );
    await Promise.all(studentPromises);

    res.status(201).json({ message: `Classroom ${className} created with students successfully` });
  } catch (error) {
    console.error('Error creating classroom and adding students:', error);
    res.status(500).json({ error: 'Error creating classroom and adding students' });
  }
});


router.post('/assess', async (req, res) => {
  const { essay } = req.body;

  if (!essay) {
    return res.status(400).json({ error: 'Essay is required' });
  }

  try {
    const prompt = "Give insights about the student who did the following assignment. Include character of the child, areas where the student excel academically, areas where the student lacks academically and give 3 tags to describe the child just 3 words. Dont include anything else just 3 words. Follow the format: Excellence:{} Improvement:{} Tags:{}";
    
    const genAI = new GoogleGenerativeAI('AIzaSyAlM7eYJntG24kjPc6W4t2Z9AaeFG_DUj8');
    const model = await genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    // Call the AI model to generate content
    const response = await model.generateContent(`${prompt} ${essay}`);
    
    // Navigate to the desired text in the response
    const responseText = response?.response?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!responseText) {
      return res.status(500).json({ error: 'Unable to extract response text.' });
    }

    res.status(200).json({ aiResponse: responseText });
  } catch (error) {
    console.error('Error generating AI response:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});


router.post('/upload', upload.array('pdfs'), async (req, res) => {
  const { question } = req.body; // Assume question is sent in the request body
  const files = req.files;
  console.log("I am in upload");
  console.log(question);
  let r = ""; // Use 'let' to allow concatenation

  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  if (!files || files.length === 0) {
    return res.status(400).json({ error: 'At least one PDF file is required' });
  }

  try {
    for (const file of files) {
      const studentName = file.originalname.replace('.pdf', '');

      if (!studentName) {
        console.warn('Skipping file with invalid name:', file.originalname);
        continue;
      }

      try {
        const data = await pdf(file.buffer);
        const pdfContent = data.text;

        console.log(`Raw content of PDF ${file.originalname}:`, pdfContent);

        // Combine lines into single answers
        const lines = pdfContent.split(/\r?\n/).map(line => line.trim()).filter(line => line);
        console.log(`Lines extracted from PDF ${file.originalname}:`, lines);

        // Correct instantiation of GoogleGenerativeAI
        const genAI = new GoogleGenerativeAI('AIzaSyAlM7eYJntG24kjPc6W4t2Z9AaeFG_DUj8');
        const model = await genAI.getGenerativeModel({ model: 'gemini-pro' });
        const s = pdfContent + question;
        
        // Call the AI model to generate content
        const response = await model.generateContent(s);

        // Access the response correctly
        console.log(response.response.text());
        r += response.response.text(); // Accumulate responses

      } catch (pdfError) {
        console.error(`Error parsing PDF ${file.originalname}:`, pdfError);
      }
    }

    // Return the accumulated responses
    res.status(200).json({ aiResponse: r });
  } catch (error) {
    console.error('Error processing PDF files:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

// Endpoint to upload PDF files and parse content
// Endpoint to upload PDF files and parse content
// router.post('/upload-pdfs', upload.array('pdfs'), async (req, res) => {
//     const { className, questionPaperName } = req.body;
//     const files = req.files;
  
//     if (!className) {
//       return res.status(400).json({ error: 'Classroom name is required' });
//     }
  
//     if (!questionPaperName) {
//       return res.status(400).json({ error: 'Question paper name is required' });
//     }
  
//     if (!files || files.length === 0) {
//       return res.status(400).json({ error: 'At least one PDF file is required' });
//     }
  
//     try {
//       const classroomRef = db.collection('classrooms').doc(className);
//       const questionPaperRef = classroomRef.collection('questionPapers').doc(questionPaperName);
  
//       for (const file of files) {
//         const studentName = file.originalname.replace('.pdf', '');
  
//         if (!studentName) {
//           console.warn('Skipping file with invalid name:', file.originalname);
//           continue;
//         }
  
//         try {
//           const data = await pdf(file.buffer);
//           const pdfContent = data.text;
  
//           console.log(`Raw content of PDF ${file.originalname}:`, pdfContent);
  
//           // Combine lines into single answers
//           const lines = pdfContent.split(/\r?\n/).map(line => line.trim()).filter(line => line);
//           console.log(`Lines extracted from PDF ${file.originalname}:`, lines);
  
//           // Improved logic for assigning answers
//           const answers = {};
//           let currentAnswer = '';
//           let answerIndex = 1;
  
//           lines.forEach((line, index) => {
//             // Assuming that answers are separated by a double line break or another delimiter
//             if (line.length === 0) {
//               if (currentAnswer.trim()) {
//                 answers[`answer${answerIndex}`] = currentAnswer.trim();
//                 answerIndex++;
//                 currentAnswer = '';
//               }
//             } else {
//               if (currentAnswer.length > 0 && line.match(/^[A-Z]/)) {
//                 // If the current line seems like a new answer start, save the previous answer
//                 answers[`answer${answerIndex}`] = currentAnswer.trim();
//                 answerIndex++;
//                 currentAnswer = line;
//               } else {
//                 currentAnswer += (currentAnswer.length > 0 ? ' ' : '') + line;
//               }
//             }
//           });
  
//           // Add the last answer if there is any content left
//           if (currentAnswer.trim()) {
//             answers[`answer${answerIndex}`] = currentAnswer.trim();
//           }
  
//           console.log(`Answers for ${studentName}:`, answers);
  
//           if (Object.keys(answers).length === 0) {
//             console.warn(`No valid answers found for ${studentName}`);
//           } else {
//             const studentRef = questionPaperRef.collection('students').doc(studentName);
//             await studentRef.set({ answers }, { merge: true });
//             console.log(`Answers stored for ${studentName}`);
//           }
  
//         } catch (pdfError) {
//           console.error(`Error parsing PDF ${file.originalname}:`, pdfError);
//         }
//       }
  
//       res.status(200).json({ message: 'PDF files uploaded and parsed successfully' });
//     } catch (error) {
//       console.error('Error processing PDF files:', error);
//       res.status(500).json({ error: 'Error processing PDF files' });
//     }
//   });
  
router.post('/upload-pdfs', upload.array('pdfs'), async (req, res) => {
  const { className, qnpaperName } = req.body; // Assume qnpaperName is sent in the request body
  const files = req.files;

  if (!className) {
    return res.status(400).json({ error: 'Classroom name is required' });
  }

  if (!qnpaperName) {
    return res.status(400).json({ error: 'Question paper name is required' });
  }

  if (!files || files.length === 0) {
    return res.status(400).json({ error: 'At least one PDF file is required' });
  }

  try {
    const classroomRef = db.collection('classrooms').doc(className);

    for (const file of files) {
      const studentName = file.originalname.replace('.pdf', '');

      if (!studentName) {
        console.warn('Skipping file with invalid name:', file.originalname);
        continue;
      }

      try {
        const data = await pdf(file.buffer);
        const pdfContent = data.text;

        console.log(`Raw content of PDF ${file.originalname}:`, pdfContent);

        // Split content into lines and trim spaces
        const lines = pdfContent.split(/\r?\n/).map(line => line.trim()).filter(line => line);
        console.log(`Lines extracted from PDF ${file.originalname}:`, lines);

        // Improved logic for assigning answers
        const answers = {};
        let currentAnswer = '';
        let answerIndex = 1;

        lines.forEach((line) => {
          // Regular expression to detect a question number (e.g., "1.", "2.", "3.", etc.)
          if (line.match(/^\d+\./)) {
            // If currentAnswer is not empty, save it before starting the next answer
            if (currentAnswer.trim()) {
              answers[`answer${answerIndex}`] = currentAnswer.trim();
              answerIndex++;
              currentAnswer = '';
            }
            // Start the new answer with the current line
            currentAnswer = line;
          } else {
            // Otherwise, continue appending to the current answer
            currentAnswer += (currentAnswer.length > 0 ? ' ' : '') + line;
          }
        });

        // Add the last answer if there is any content left
        if (currentAnswer.trim()) {
          answers[`answer${answerIndex}`] = currentAnswer.trim();
        }

        console.log(`Answers for ${studentName}:`, answers);

        if (Object.keys(answers).length === 0) {
          console.warn(`No valid answers found for ${studentName}`);
        } else {
          const studentRef = classroomRef.collection('students').doc(studentName);
          await studentRef.set({ [qnpaperName]: answers }, { merge: true });
          console.log(`Answers stored for ${studentName} under ${qnpaperName}`);
        }

      } catch (pdfError) {
        console.error(`Error parsing PDF ${file.originalname}:`, pdfError);
      }
    }

    res.status(200).json({ message: 'PDF files uploaded and parsed successfully' });
  } catch (error) {
    console.error('Error processing PDF files:', error);
    res.status(500).json({ error: 'Error processing PDF files' });
  }
});

router.post("/get-student-answer-history", async (req, res) => {
  const { className, questionPaperName, qnNumber, studentName } = req.body;

  // Validate input
  if (!className || !questionPaperName || !qnNumber || !studentName) {
    return res.status(400).json({
      error:
        "className, questionPaperName, qnNumber, and studentName are required",
    });
  }

  try {
    // Step 1: Get the specific student document
    const studentRef = db
      .collection("classrooms")
      .doc(className)
      .collection("students")
      .doc(studentName);
    const studentDoc = await studentRef.get();

    if (!studentDoc.exists) {
      return res.status(404).json({ error: "Student not found" });
    }

    const studentData = studentDoc.data();

    // Step 2: Retrieve the answer for the specified question
    const questionPaperAnswers = studentData[questionPaperName];
    const answerField = `answer${qnNumber}`;
    const studentAnswer = questionPaperAnswers
      ? questionPaperAnswers[answerField]
      : null;

    if (!studentAnswer) {
      return res.status(404).json({
        error: `Answer for question ${qnNumber} not found for student ${studentName}`,
      });
    }

    // Return the student's answer
    res.status(200).json({ answer: studentAnswer });
  } catch (error) {
    console.error("Error retrieving student answer:", error);
    res.status(500).json({ error: "Error retrieving student answer" });
  }
});


  


// Endpoint to create a question paper
router.post('/create-question-paper', async (req, res) => {
    const { className, questionPaperName, questions } = req.body;
  
    if (!className) {
      return res.status(400).json({ error: 'Classroom name is required' });
    }
  
if (!questionPaperName) {
    return res.status(400).json({ error: 'Question paper name is required' });
  }

  if (!Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ error: 'Questions array is required and should not be empty' });
  }

  try {
    const classroomRef = db.collection('classrooms').doc(className);
    
    // Check if the classroom exists
    const classroomDoc = await classroomRef.get();
    if (!classroomDoc.exists) {
      return res.status(404).json({ error: 'Classroom not found' });
    }

    // Create a new document in the classroom with the given questionPaperName
    const questionPaperRef = classroomRef.collection('questionPapers').doc(questionPaperName);
    await questionPaperRef.set({});

    // Add each question to the question paper document
    const questionFields = {};
    questions.forEach((question, index) => {
      questionFields[`question${index + 1}`] = {
        importantPoints: question.importantPoints || []
      };
    });
    
    await questionPaperRef.set(questionFields, { merge: true });

    res.status(201).json({ message: `Question paper ${questionPaperName} created successfully `});
  } catch (error) {
    console.error('Error creating question paper:', error);
    res.status(500).json({ error: 'Error creating question paper' });
  }
});


router.post("/evaluate-student-answers1", async (req, res) => {
  console.log("evaluvate entered");
  const { className, questionPaperName, qnNumber } = req.body;


  // Validate input
  if (!className || !questionPaperName || !qnNumber) {
    return res.status(400).json({
      error: "className, questionPaperName, and qnNumber are required",
    });
  }

  try {
    // Step 1: Get the important points for the specified question
    const questionPaperRef = db
      .collection("classrooms")
      .doc(className)
      .collection("questionPapers")
      .doc(questionPaperName);
    const questionPaperDoc = await questionPaperRef.get();

    if (!questionPaperDoc.exists) {
      return res.status(404).json({ error: "Question paper not found" });
    }

    const questionPaperData = questionPaperDoc.data();
    const questionField = `question${qnNumber}`;
    const importantPoints =
      questionPaperData[questionField]?.importantPoints || [];

    if (importantPoints.length === 0) {
      return res
        .status(404)
        .json({ error: `Important points for question ${qnNumber} not found` });
    }

    // Step 2: Get all student documents in the classroom
    const studentsSnapshot = await db
      .collection("classrooms")
      .doc(className)
      .collection("students")
      .get();

    if (studentsSnapshot.empty) {
      return res
        .status(404)
        .json({ error: "No students found in the classroom" });
    }

    // Initialize results
    const missingKeyPointMap = {}; // This will hold the map of missing key points and student names

    // Step 3: Iterate over each student document and retrieve answers
    for (const studentDoc of studentsSnapshot.docs) {
      const studentData = studentDoc.data();
      const studentName = studentDoc.id; // Use student document ID as name

      // Retrieve answers for the specified question paper
      const questionPaperAnswers = studentData[questionPaperName];

      if (questionPaperAnswers) {
        // Collect answers
        const a = "answer" + qnNumber;
        const studentAnswerFields = Object.keys(questionPaperAnswers).filter(
          (key) => key.startsWith(a)
        );

        for (const field of studentAnswerFields) {
          const answer = questionPaperAnswers[field];

          // Step 4: Evaluate each answer
          const evaluationResult = await evaluateText3(answer, importantPoints);
          console.log(evaluationResult);

          // Update the map with the evaluation result
          for (const missingKey of evaluationResult) {
            if (!missingKeyPointMap[missingKey]) {
              missingKeyPointMap[missingKey] = [];
            }
            missingKeyPointMap[missingKey].push(studentName);
          }
        }
      }
    }
    console.log(missingKeyPointMap);
    // Return the evaluations
    res.status(200).json({ missingKeyPointMap });
  } catch (error) {
    console.error("Error retrieving and evaluating student answers:", error);
    res
      .status(500)
      .json({ error: "Error retrieving and evaluating student answers" });
  }
});

router.post("/grammar-student-answers1", async (req, res) => {
  console.log("entered grammar");
  const { className, questionPaperName, qnNumber } = req.body;

  // Validate input
  if (!className || !questionPaperName || !qnNumber) {
    return res.status(400).json({
      error: "className, questionPaperName, and qnNumber are required",
    });
  }

  try {
    // Step 1: Get all student documents in the classroom
    const studentsSnapshot = await db
      .collection("classrooms")
      .doc(className)
      .collection("students")
      .get();

    if (studentsSnapshot.empty) {
      return res
        .status(404)
        .json({ error: "No students found in the classroom" });
    }

    // Initialize a map to store grammatical errors and associated student names
    const errorWordMap = {};

    // Step 2: Iterate over each student document and retrieve answers
    for (const studentDoc of studentsSnapshot.docs) {
      const studentData = studentDoc.data();
      const studentName = studentDoc.id; // Use student document ID as name

      // Retrieve answers for the specified question paper
      const questionPaperAnswers = studentData[questionPaperName];

      if (questionPaperAnswers) {
        // Collect answers
        const a = "answer" + qnNumber;
        const studentAnswerFields = Object.keys(questionPaperAnswers).filter(
          (key) => key.startsWith(a)
        );

        for (const field of studentAnswerFields) {
          const answer = questionPaperAnswers[field];

          // Step 3: Find grammatical errors in each answer
          const grammaticalErrors = await findGrammaticalErrors(answer);
          console.log(grammaticalErrors);

          // Update the map with grammatical errors
          for (const errorWord of grammaticalErrors) {
            if (!errorWordMap[errorWord]) {
              errorWordMap[errorWord] = [];
            }
            errorWordMap[errorWord].push(studentName);
          }
        }
      }
    }

    // Return the map of error words and associated student names
    res.status(200).json({ errorWordMap });
  } catch (error) {
    console.error("Error retrieving and evaluating student answers:", error);
    res
      .status(500)
      .json({ error: "Error retrieving and evaluating student answers" });
  }
});


app.use('/api', router);



// Start the server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
