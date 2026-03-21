// Atlas Capture: Generate 50,000 AI Training Questions
// Run with: node generate-questions.mjs
// Requires: SUPABASE_SERVICE_ROLE_KEY in .env

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://greddtuxhsvkyrzdnmsh.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY is not set in .env file!');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// ============= QUESTION TEMPLATES =============

const imageQuestions = [
    // Animals
    { category: 'Image Recognition', q: 'What animal is shown in this image?', img: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400', a: 'Dog', b: 'Cat', c: 'Fox', d: 'Wolf', correct: 'A' },
    { category: 'Image Recognition', q: 'Identify the animal in this photo.', img: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400', a: 'Dog', b: 'Cat', c: 'Rabbit', d: 'Hamster', correct: 'B' },
    { category: 'Image Recognition', q: 'What animal do you see?', img: 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=400', a: 'Frog', b: 'Lizard', c: 'Turtle', d: 'Snake', correct: 'C' },
    { category: 'Image Recognition', q: 'Which bird is in this image?', img: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400', a: 'Parrot', b: 'Eagle', c: 'Blue Jay', d: 'Robin', correct: 'C' },
    { category: 'Image Recognition', q: 'What type of animal is this?', img: 'https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=400', a: 'Whale', b: 'Dolphin', c: 'Shark', d: 'Seal', correct: 'B' },
    { category: 'Image Recognition', q: 'Classify this animal.', img: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=400', a: 'Cow', b: 'Horse', c: 'Donkey', d: 'Buffalo', correct: 'A' },
    { category: 'Image Recognition', q: 'What is shown in this photo?', img: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=400', a: 'Squirrel', b: 'Chipmunk', c: 'Mouse', d: 'Rat', correct: 'A' },
    { category: 'Image Recognition', q: 'What animal is pictured here?', img: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=400', a: 'Monkey', b: 'Gorilla', c: 'Chimpanzee', d: 'Orangutan', correct: 'B' },

    // Objects
    { category: 'Image Recognition', q: 'What object is in this image?', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', a: 'Watch', b: 'Bracelet', c: 'Ring', d: 'Compass', correct: 'A' },
    { category: 'Image Recognition', q: 'Identify this object.', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', a: 'Speaker', b: 'Headphones', c: 'Microphone', d: 'Earbud', correct: 'B' },
    { category: 'Image Recognition', q: 'What is shown here?', img: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400', a: 'Film camera', b: 'Polaroid camera', c: 'Digital camera', d: 'Binoculars', correct: 'B' },
    { category: 'Image Recognition', q: 'What item is pictured?', img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', a: 'Suitcase', b: 'Backpack', c: 'Handbag', d: 'Briefcase', correct: 'B' },

    // Vehicles
    { category: 'Image Recognition', q: 'What type of vehicle is this?', img: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400', a: 'Car', b: 'Truck', c: 'Van', d: 'Bus', correct: 'A' },
    { category: 'Image Recognition', q: 'Identify this vehicle.', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400', a: 'Car', b: 'Motorcycle', c: 'Bicycle', d: 'Scooter', correct: 'B' },
    { category: 'Image Recognition', q: 'What is this mode of transport?', img: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=400', a: 'Bus', b: 'Train', c: 'Airplane', d: 'Ship', correct: 'C' },

    // Food
    { category: 'Image Recognition', q: 'What food is shown?', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', a: 'Pizza', b: 'Burger', c: 'Sandwich', d: 'Taco', correct: 'B' },
    { category: 'Image Recognition', q: 'Identify this fruit.', img: 'https://images.unsplash.com/photo-1528825871115-3581a5e31138?w=400', a: 'Apple', b: 'Peach', c: 'Strawberry', d: 'Cherry', correct: 'C' },
    { category: 'Image Recognition', q: 'What fruit is this?', img: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400', a: 'Orange', b: 'Mango', c: 'Papaya', d: 'Lemon', correct: 'A' },
];

const textQuestions = {
    'Science': [
        { q: 'What is the chemical symbol for water?', a: 'H2O', b: 'CO2', c: 'NaCl', d: 'O2', correct: 'A' },
        { q: 'What planet is known as the Red Planet?', a: 'Venus', b: 'Mars', c: 'Jupiter', d: 'Saturn', correct: 'B' },
        { q: 'What is the speed of light in vacuum?', a: '300,000 km/s', b: '150,000 km/s', c: '500,000 km/s', d: '100,000 km/s', correct: 'A' },
        { q: 'What gas do plants absorb from the atmosphere?', a: 'Oxygen', b: 'Nitrogen', c: 'Carbon Dioxide', d: 'Hydrogen', correct: 'C' },
        { q: 'What is the largest organ in the human body?', a: 'Heart', b: 'Liver', c: 'Brain', d: 'Skin', correct: 'D' },
        { q: 'What is the powerhouse of the cell?', a: 'Nucleus', b: 'Mitochondria', c: 'Ribosome', d: 'Golgi body', correct: 'B' },
        { q: 'What element does "Fe" represent?', a: 'Fluorine', b: 'Francium', c: 'Iron', d: 'Fermium', correct: 'C' },
        { q: 'How many bones are in the adult human body?', a: '186', b: '206', c: '226', d: '246', correct: 'B' },
        { q: 'What is the boiling point of water at sea level?', a: '90°C', b: '100°C', c: '110°C', d: '120°C', correct: 'B' },
        { q: 'What type of blood cells fight infection?', a: 'Red blood cells', b: 'Platelets', c: 'White blood cells', d: 'Plasma', correct: 'C' },
    ],
    'Geography': [
        { q: 'What is the largest continent by area?', a: 'Africa', b: 'Asia', c: 'Europe', d: 'North America', correct: 'B' },
        { q: 'What is the longest river in the world?', a: 'Amazon', b: 'Yangtze', c: 'Nile', d: 'Mississippi', correct: 'C' },
        { q: 'Which country has the most population?', a: 'USA', b: 'India', c: 'China', d: 'Indonesia', correct: 'B' },
        { q: 'What is the capital of Australia?', a: 'Sydney', b: 'Melbourne', c: 'Canberra', d: 'Perth', correct: 'C' },
        { q: 'Which ocean is the largest?', a: 'Atlantic', b: 'Indian', c: 'Arctic', d: 'Pacific', correct: 'D' },
        { q: 'What is the smallest country in the world?', a: 'Monaco', b: 'Vatican City', c: 'San Marino', d: 'Liechtenstein', correct: 'B' },
        { q: 'Mount Everest is located in which mountain range?', a: 'Alps', b: 'Andes', c: 'Himalayas', d: 'Rockies', correct: 'C' },
        { q: 'What is the driest continent?', a: 'Africa', b: 'Australia', c: 'Antarctica', d: 'Asia', correct: 'C' },
        { q: 'What is the capital of Brazil?', a: 'Rio', b: 'São Paulo', c: 'Brasília', d: 'Salvador', correct: 'C' },
        { q: 'Which country is known as the Land of the Rising Sun?', a: 'China', b: 'Korea', c: 'Japan', d: 'Thailand', correct: 'C' },
    ],
    'Mathematics': [
        { q: 'What is 15% of 200?', a: '20', b: '25', c: '30', d: '35', correct: 'C' },
        { q: 'What is the square root of 144?', a: '10', b: '11', c: '12', d: '13', correct: 'C' },
        { q: 'What is 7 × 8?', a: '54', b: '56', c: '58', d: '64', correct: 'B' },
        { q: 'How many degrees are in a right angle?', a: '45', b: '90', c: '180', d: '360', correct: 'B' },
        { q: 'What is the value of Pi (to 2 decimal places)?', a: '3.12', b: '3.14', c: '3.16', d: '3.18', correct: 'B' },
        { q: 'What is 2^10?', a: '512', b: '1024', c: '2048', d: '256', correct: 'B' },
        { q: 'What is the next prime number after 7?', a: '9', b: '10', c: '11', d: '13', correct: 'C' },
        { q: 'If x + 5 = 12, what is x?', a: '5', b: '6', c: '7', d: '8', correct: 'C' },
        { q: 'What is 3/4 as a percentage?', a: '65%', b: '70%', c: '75%', d: '80%', correct: 'C' },
        { q: 'How many sides does a hexagon have?', a: '5', b: '6', c: '7', d: '8', correct: 'B' },
    ],
    'Language': [
        { q: 'What is the past tense of "run"?', a: 'Runned', b: 'Ran', c: 'Runed', d: 'Running', correct: 'B' },
        { q: 'Which word is a synonym for "happy"?', a: 'Sad', b: 'Angry', c: 'Joyful', d: 'Tired', correct: 'C' },
        { q: 'What is the antonym of "ancient"?', a: 'Old', b: 'Historic', c: 'Modern', d: 'Vintage', correct: 'C' },
        { q: 'Which sentence is grammatically correct?', a: 'She don\'t like it', b: 'She doesn\'t likes it', c: 'She doesn\'t like it', d: 'She not like it', correct: 'C' },
        { q: 'What type of word is "quickly"?', a: 'Noun', b: 'Verb', c: 'Adjective', d: 'Adverb', correct: 'D' },
        { q: '"Canine" refers to a...', a: 'Cat', b: 'Dog', c: 'Horse', d: 'Bird', correct: 'B' },
        { q: 'What is the plural of "mouse"?', a: 'Mouses', b: 'Mousies', c: 'Mice', d: 'Meese', correct: 'C' },
        { q: 'Which word means "very large"?', a: 'Tiny', b: 'Enormous', c: 'Average', d: 'Petite', correct: 'B' },
        { q: 'What is the correct spelling?', a: 'Accomodate', b: 'Accommodate', c: 'Acommodate', d: 'Acomodate', correct: 'B' },
        { q: 'Which is a conjunction?', a: 'Run', b: 'Beautiful', c: 'And', d: 'Quickly', correct: 'C' },
    ],
    'Technology': [
        { q: 'What does CPU stand for?', a: 'Central Processing Unit', b: 'Computer Personal Unit', c: 'Central Program Utility', d: 'Core Processing Unit', correct: 'A' },
        { q: 'What does HTML stand for?', a: 'Hyper Text Markup Language', b: 'High Tech Modern Language', c: 'Hyper Transfer Markup Language', d: 'Home Tool Markup Language', correct: 'A' },
        { q: 'Which company created the iPhone?', a: 'Google', b: 'Samsung', c: 'Apple', d: 'Microsoft', correct: 'C' },
        { q: 'What does RAM stand for?', a: 'Read Access Memory', b: 'Random Access Memory', c: 'Rapid Access Module', d: 'Run Application Memory', correct: 'B' },
        { q: 'What programming language runs in a web browser?', a: 'Python', b: 'Java', c: 'JavaScript', d: 'C++', correct: 'C' },
        { q: 'What does URL stand for?', a: 'Universal Resource Link', b: 'Uniform Resource Locator', c: 'Universal Reference Locator', d: 'Unified Resource Link', correct: 'B' },
        { q: 'What is the main function of a firewall?', a: 'Speed up internet', b: 'Block unauthorized access', c: 'Store data', d: 'Cool the CPU', correct: 'B' },
        { q: 'What does "AI" stand for?', a: 'Automated Intelligence', b: 'Artificial Intelligence', c: 'Advanced Integration', d: 'Applied Informatics', correct: 'B' },
        { q: 'What is the binary representation of the number 5?', a: '100', b: '110', c: '101', d: '111', correct: 'C' },
        { q: 'What does SSD stand for?', a: 'Solid State Drive', b: 'Super Speed Disk', c: 'System Storage Device', d: 'Secure Serial Drive', correct: 'A' },
    ],
    'History': [
        { q: 'In what year did World War II end?', a: '1943', b: '1944', c: '1945', d: '1946', correct: 'C' },
        { q: 'Who was the first President of the United States?', a: 'Jefferson', b: 'Lincoln', c: 'Adams', d: 'Washington', correct: 'D' },
        { q: 'The Great Wall of China was built to protect against...', a: 'Earthquakes', b: 'Floods', c: 'Invasions', d: 'Wild animals', correct: 'C' },
        { q: 'Who painted the Mona Lisa?', a: 'Michelangelo', b: 'Leonardo da Vinci', c: 'Raphael', d: 'Donatello', correct: 'B' },
        { q: 'What ancient civilization built the pyramids?', a: 'Romans', b: 'Greeks', c: 'Egyptians', d: 'Persians', correct: 'C' },
        { q: 'In what year did the Titanic sink?', a: '1905', b: '1912', c: '1918', d: '1920', correct: 'B' },
        { q: 'Who discovered America in 1492?', a: 'Magellan', b: 'Columbus', c: 'Vespucci', d: 'Drake', correct: 'B' },
        { q: 'The French Revolution began in...', a: '1769', b: '1779', c: '1789', d: '1799', correct: 'C' },
        { q: 'Who wrote "Romeo and Juliet"?', a: 'Dickens', b: 'Shakespeare', c: 'Austen', d: 'Twain', correct: 'B' },
        { q: 'The Berlin Wall fell in...', a: '1987', b: '1988', c: '1989', d: '1990', correct: 'C' },
    ],
    'General Knowledge': [
        { q: 'How many continents are there?', a: '5', b: '6', c: '7', d: '8', correct: 'C' },
        { q: 'What color do you get when mixing red and yellow?', a: 'Green', b: 'Purple', c: 'Orange', d: 'Brown', correct: 'C' },
        { q: 'How many minutes are in one hour?', a: '30', b: '45', c: '60', d: '90', correct: 'C' },
        { q: 'What is the currency of Japan?', a: 'Yuan', b: 'Won', c: 'Yen', d: 'Rupee', correct: 'C' },
        { q: 'How many strings does a standard guitar have?', a: '4', b: '5', c: '6', d: '8', correct: 'C' },
        { q: 'What is the tallest mammal?', a: 'Elephant', b: 'Giraffe', c: 'Whale', d: 'Bear', correct: 'B' },
        { q: 'Which planet is closest to the Sun?', a: 'Venus', b: 'Mercury', c: 'Earth', d: 'Mars', correct: 'B' },
        { q: 'What is the hardest natural substance?', a: 'Gold', b: 'Iron', c: 'Diamond', d: 'Platinum', correct: 'C' },
        { q: 'How many players are on a football (soccer) team?', a: '9', b: '10', c: '11', d: '12', correct: 'C' },
        { q: 'What gas makes up most of Earth\'s atmosphere?', a: 'Oxygen', b: 'Carbon Dioxide', c: 'Nitrogen', d: 'Hydrogen', correct: 'C' },
    ],
};

// ============= VARIATION ENGINE =============

// Prefixes to vary the questions
const questionPrefixes = [
    'Based on your knowledge, ',
    'For AI model training: ',
    'Please evaluate: ',
    'Select the correct answer: ',
    'Think carefully: ',
    'AI Assessment: ',
    'Training data point: ',
    'Evaluate this: ',
    'Quick check: ',
    'Knowledge test: ',
];

// Suffixes to add variety
const questionSuffixes = [
    '',
    ' (Select the best answer)',
    ' (Choose one)',
    '',
    ' (AI Training)',
    '',
    '',
    ' (Accuracy matters)',
    '',
    '',
];

function shuffleArray(arr) {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function generateQuestions(targetCount) {
    const questions = [];

    // 1. Add all image questions with variations
    for (const iq of imageQuestions) {
        for (let v = 0; v < 30; v++) {
            const prefix = questionPrefixes[v % questionPrefixes.length];
            const suffix = questionSuffixes[v % questionSuffixes.length];
            questions.push({
                category: iq.category,
                question_text: `${prefix}${iq.q}${suffix}`,
                image_url: iq.img,
                option_a: iq.a,
                option_b: iq.b,
                option_c: iq.c,
                option_d: iq.d,
                correct_answer: iq.correct,
            });
        }
    }

    // 2. Add all text questions with heavy variations
    const categories = Object.keys(textQuestions);
    let textCount = 0;
    const remaining = targetCount - questions.length;
    const perQuestion = Math.ceil(remaining / (categories.length * 10));

    for (const cat of categories) {
        for (const tq of textQuestions[cat]) {
            for (let v = 0; v < perQuestion; v++) {
                const prefix = questionPrefixes[v % questionPrefixes.length];
                const suffix = questionSuffixes[v % questionSuffixes.length];
                
                // Shuffle options while tracking correct answer
                const options = [
                    { label: 'A', text: tq.a },
                    { label: 'B', text: tq.b },
                    { label: 'C', text: tq.c },
                    { label: 'D', text: tq.d },
                ];
                const correctText = options.find(o => o.label === tq.correct).text;
                
                // Randomly shuffle options for variety
                const shuffled = shuffleArray(options);
                const newCorrect = ['A', 'B', 'C', 'D'][shuffled.findIndex(o => o.text === correctText)];

                questions.push({
                    category: cat,
                    question_text: `${prefix}${tq.q}${suffix}`,
                    image_url: null,
                    option_a: shuffled[0].text,
                    option_b: shuffled[1].text,
                    option_c: shuffled[2].text,
                    option_d: shuffled[3].text,
                    correct_answer: newCorrect,
                });
                textCount++;
            }
        }
    }

    // Shuffle everything and trim to target
    return shuffleArray(questions).slice(0, targetCount);
}

// ============= MAIN =============

async function main() {
    console.log('🔄 Generating 50,000 AI training questions...');
    const questions = generateQuestions(50000);
    console.log(`✅ Generated ${questions.length} questions`);

    // Insert in batches of 500
    const BATCH_SIZE = 500;
    let inserted = 0;

    for (let i = 0; i < questions.length; i += BATCH_SIZE) {
        const batch = questions.slice(i, i + BATCH_SIZE);
        const { error } = await supabase.from('questions').insert(batch);

        if (error) {
            console.error(`❌ Error at batch ${i / BATCH_SIZE}:`, error.message);
            // If it's a schema error, show it and stop
            if (error.message.includes('relation') || error.message.includes('column')) {
                console.error('⚠️  Make sure you ran the supabase-questions-schema.sql first!');
                process.exit(1);
            }
        } else {
            inserted += batch.length;
            if (inserted % 5000 === 0 || inserted === questions.length) {
                console.log(`📦 Inserted ${inserted}/${questions.length} questions...`);
            }
        }
    }

    console.log(`\n🎉 Done! ${inserted} questions inserted into Supabase.`);
}

main().catch(console.error);
