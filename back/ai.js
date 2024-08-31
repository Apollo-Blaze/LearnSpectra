//make a file named ai.js in main directory and copy everything here
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the GoogleGenerativeAI instance
const genAI = new GoogleGenerativeAI('AIzaSyAlM7eYJntG24kjPc6W4t2Z9AaeFG_DUj8');
//const genAI = new GoogleGenerativeAI('AIzaSyCFriejxxUTcjDTo9V91OUrlXXIvbhsplk');

// Function to evaluate text using the generative model
async function evaluateText(text, keys) {
    try {
        // Get the generative model
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        // Create the prompt
        const prompt = `Evaluate the answer given below with the keys provided and provide the accuracy of the answer along with the keys missing or having less accuracy. Your answer should be in the format -( Accuracy- x% key1:x% key2:y%). The given text is : ${text} Keys are- ${keys}`;

        // Generate content using the model
        const response = await model.generateContent(prompt);

        // Check if the response contains text
        if (response && response.response.text()) {
            return response.response.text();
        } else {
            throw new Error('No text found in response');
        }
    } catch (error) {
        throw new Error(`Error evaluating text: ${error.message}`);
    }
}


async function evaluateText1(text, keys) {
    try {
        // Get the generative model
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        // Create the prompt
        const prompt = `Evaluate the answer given below with the keys provided and provide the accuracy of the answer along with the keys missing or having less accuracy. Your answer should be in the format -( Accuracy- key1:x% key2:y% key3:z%). The given text is: ${text} Keys are: ${keys.join(', ')}`;

        // Generate content using the model
        const response = await model.generateContent(prompt);

        // Check if the response contains text
        if (response && response.response.text()) {
            const evaluationText = response.response.text();

            // Example response parsing logic
            const results = {};
            const regex = /(\w+):(\d+)%/g;
            let match;

            while ((match = regex.exec(evaluationText)) !== null) {
                const key = match[1];
                const accuracy = parseInt(match[2], 10);
                results[key] = accuracy;
            }

            // Separate keys based on accuracy ranges
            const between50and25 = Object.keys(results).filter(key => results[key] >= 25 && results[key] < 50);
            const below25 = Object.keys(results).filter(key => results[key] < 25);

            return {
                between50and25,
                below25
            };
        } else {
            throw new Error('No text found in response');
        }
    } catch (error) {
        throw new Error(`Error evaluating text: ${error.message}`);
    }
}



// async function findGrammaticalErrors(text) {
//     try {
//         // Get the generative model
//         const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

//         // Create the prompt
//         const prompt = `Find the grammatical errors and spelling mistakes in the text provided and return the same text with grammatically wrong words in curly parentheses. The text is: ${text}}`;

//         // Generate content using the model
//         const response = await model.generateContent(prompt);

//         // Check if the response contains text
//         if (response && response.response.text()) {
//             return response.response.text();
//         } else {
//             console.log(response.response.text())
//             throw new Error('No text found in response');
//         }
//     } catch (error) {
//         throw new Error(`Error finding grammatical errors: ${error.message}`);
//     }
// }


async function findGrammaticalErrors(text) {
    try {
        // Get the generative model
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        // Create the prompt
        const prompt = `Find the grammatical errors and spelling mistakes in the text provided and return the same text with grammatically wrong words in curly parentheses. The text is: ${text}`;

        // Generate content using the model
        const response = await model.generateContent(prompt);

        // Check if the response contains text
        if (response && response.response.text()) {
            const responseText = response.response.text();

            // Use regex to find words within curly braces
            const errorWords = [];
            const regex = /\{([^}]+)\}/g;
            let match;

            while ((match = regex.exec(responseText)) !== null) {
                errorWords.push(match[1].trim());
            }

            // Return the array of error words
            return errorWords;
        } else {
            throw new Error('No text found in response');
        }
    } catch (error) {
        throw new Error(`Error finding grammatical errors: ${error.message}`);
    }
}

async function evaluateText2(text, keys) {
    try {
        // Get the generative model
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        // Create the prompt
        const prompt = `Evaluate the answer given below with the keys provided and show the missed points. Your answer should be in the format -(key1,key2,key3). The given text is: ${text} Keys are: ${keys.join(', ')}`;

        // Generate content using the model
        const response = await model.generateContent(prompt);

        // Check if the response contains text
        if (response && response.response.text()) {
            const evaluationText = response.response.text();

            // Example response parsing logic
            // const results = {};
            // const regex = /(\w+):(\d+)%/g;
            // let match;

            // while ((match = regex.exec(evaluationText)) !== null) {
            //     const key = match[1];
            //     const accuracy = parseInt(match[2], 10);
            //     results[key] = accuracy;
            // }

            // // Separate keys based on accuracy ranges
            // const between50and25 = Object.keys(results).filter(key => results[key] >= 25 && results[key] < 50);
            // const below25 = Object.keys(results).filter(key => results[key] < 25);

            return evaluationText;
        } else {
            throw new Error('No text found in response');
        }
    } catch (error) {
        throw new Error(`Error evaluating text: ${error.message}`);
    }
}


async function evaluateText3(text, keys) {
    try {
        // Get the generative model
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        // Create a list of keys with their index positions
        const keysWithNumbers = keys.map((key, index) => `(${index + 1}) ${key}`);

        // Create the prompt with key points and their index positions
        const prompt = `Evaluate the answer given below with the keys provided and check whether such points has not even been mentioned. Each key is given with its number. Your answer should be in the format -(number1, number2, number3). The given text is: ${text}. Keys are: ${keysWithNumbers.join(', ')}`;

        // Generate content using the model
        const response = await model.generateContent(prompt);

        // Check if the response contains text
        if (response && response.response.text()) {
            const evaluationText = response.response.text();

            // Extract missed key indices using regex
            const missedKeysMatch = evaluationText.match(/-\((.*?)\)/);

            if (missedKeysMatch && missedKeysMatch[1]) {
                const missedIndices = missedKeysMatch[1].split(',').map(index => parseInt(index.trim(), 10));

                // Return the array of missed key indices
                return missedIndices;
            } else {
                // Return an empty array if no missed indices are found
                return [];
            }
        } else {
            throw new Error('No text found in response');
        }
    } catch (error) {
        throw new Error(`Error evaluating text: ${error.message}`);
    }
}


// findGrammaticalErrors("Find the grammatical errors and spelling mistakes in the text provided and return the same text with grammatically wrong words in curly parentheses. The text is: The quick brown fox jumps over the lazy dog. Their is many things that we dont no.")
//     .then(result => console.log(result))
//     .catch(error => console.error(error));

// Example usage
// evaluateText("Sure, GPUs (Graphics Processing Units) are primarily used for accelerating tasks related to graphics rendering and increasingly for general-purpose computing tasks such as machine learning and scientific simulations. They're known for their parallel processing capabilities, which make them significantly faster than CPUs for certain types of computations.", "key1: visual, key2: computing, key3: graphics processing units "
// )
//     .then(result => console.log(result))
//     .catch(error => console.error(error));

// export evaluateText;
// evaluateText2("The Industrial Revolution marked a major turning point in history. It began in Britain and was characterized by a shift from hand production methods to machines, including the use of steam power. One of the major impacts was the introduction of the factory system, which significantly increased production and efficiency. This period also saw a significant migration of people from rural areas to urban centers, which led to the growth of cities. The Industrial Revolution also gave rise to a new middle class. However, it was not without its challenges, as it led to harsh working conditions and the exploitation of labor, particularly among women and children.",[
//     "The Industrial Revolution began in Britain in the late 18th century.",
//     "Invention of the steam engine by James Watt.",
//     "Introduction of the factory system and mechanized production.",
//     "Significant migration of people from rural areas to urban centers.",
//     "Emergence of a new middle class and industrial working class.",
//     "Increased production and efficiency in industries such as textiles and iron."
//   ]
// )
//     .then(result => console.log(result))
//     .catch(error => console.error(error));



// evaluateText3("Artificial Intelligence (AI) has a profound impact on modern society, offering numerous benefits such as automation of tasks and advancements in medical diagnostics. However, the rise of AI also presents several ethical concerns. One major issue is the potential for job displacement as automation takes over roles traditionally performed by humans. Another significant concern is privacy, as AI often involves extensive data collection. Moreover, biases in AI algorithms can lead to discrimination, highlighting the need for ethical guidelines in AI development.",
//     [
//         "Artificial Intelligence (AI) refers to machines designed to simulate human intelligence.",
//         "Benefits: automation of tasks, medical diagnostics, personalized learning.",
//         "Risks: potential job displacement due to automation, privacy concerns with data collection.",
//         "Bias in AI algorithms can lead to discrimination.",
//         "Ethical debates around autonomous weapons and decision-making in critical scenarios.",
//         "Current regulations and ethical frameworks are still developing to address these concerns."
//       ]
// )
//     .then(result => console.log(result))
//     .catch(error => console.error(error));



    module.exports = {
        evaluateText3,
        findGrammaticalErrors
    }