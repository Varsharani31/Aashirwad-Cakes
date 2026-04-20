import readline from 'readline';
import mongoose from 'mongoose';
import fs from 'fs';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("==================================================");
console.log("      MONGODB CONNECTION SETUP AUTO-FIXER         ");
console.log("==================================================\n");

rl.question("Please enter the exact MongoDB database password for user 'Cakes':\n> ", async (password) => {
    // Automatically URL Encode the password to fix any special character bugs (like @, &, #)
    const encodedPassword = encodeURIComponent(password.trim());
    
    // We use the direct URI format to completely bypass your router's `querySrv ECONNREFUSED` DNS issue
    const directURI = `mongodb://Cakes:${encodedPassword}@ac-scikgc3-shard-00-00.yjohoxk.mongodb.net:27017,ac-scikgc3-shard-00-01.yjohoxk.mongodb.net:27017,ac-scikgc3-shard-00-02.yjohoxk.mongodb.net:27017/Cake?ssl=true&replicaSet=atlas-jmawf0-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0`;

    console.log("\nAttempting to connect to MongoDB Atlas...");
    try {
        await mongoose.connect(directURI, { serverSelectionTimeoutMS: 5000 });
        console.log("✅ SUCCESS! Connected to the database.");
        
        let envContent = fs.readFileSync('.env', 'utf-8');
        // Update the MONGO_URI string safely
        envContent = envContent.replace(/^MONGO_URI=.*$/m, `MONGO_URI="${directURI}"`);
        fs.writeFileSync('.env', envContent);
        
        console.log("✅ Wrote the working connection string to your .env file!");
        console.log("\n-> You can now start your backend with:  npm run dev\n");
        process.exit(0);
    } catch (error) {
        console.error("\n❌ CONNECTION FAILED.");
        if (error.message.toLowerCase().includes('bad auth') || error.message.toLowerCase().includes('authentication failed')) {
            console.error("\nReason: YOUR PASSWORD IS WRONG OR YOUR IP IS BLOCKED.");
            console.error("1. Please check if your password is exactly correct.");
            console.error("2. **CRITICAL**: Go to your MongoDB Atlas Dashboard -> Click 'Network Access' on the left -> Click 'Add IP Address' -> Select 'Add Current IP Address' and confirm.");
        } else {
            console.error("Reason:", error.message);
        }
        process.exit(1);
    }
});
