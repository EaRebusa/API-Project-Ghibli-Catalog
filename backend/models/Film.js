import mongoose from 'mongoose';

const filmSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    original_title: { type: String },
    original_title_romanised: { type: String },
    image: { type: String },
    movie_banner: { type: String },
    description: { type: String },
    director: { type: String },
    producer: { type: String },
    release_date: { type: String },
    running_time: { type: String },
    rt_score: { type: String },
    people: [String],
    species: [String],
    locations: [String],
    vehicles: [String],
    url: { type: String }
});

const Film = mongoose.model('Film', filmSchema);

export default Film;