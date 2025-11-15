import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Film from './models/Film.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedDatabase = async () => {
    try {
        const count = await Film.countDocuments();
        if (count === 0) {
            console.log('CACHE MISS: Reading data from local ghibli-data.json...');
            const data = fs.readFileSync(path.join(__dirname, 'ghibli-data.json'), 'utf-8');
            const films = JSON.parse(data);
            await Film.insertMany(films);
            console.log('Database seeded successfully!');
        }
    } catch (error) {
        console.error('Error seeding database:', error);
    }
};

export default seedDatabase;