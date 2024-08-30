const express = require('express');
const router = express.Router();
const Section = require('../models/section');
const Step = require('../models/step');
const Therapy = require('../models/therapy');
const Podcast = require('../models/podcast');
const Exercise = require('../models/exercise');
const ExerciseStep = require('../models/exerciseStep');
const Post = require('../models/post');
const authenticateToken = require('../middlewares/authenticateToken');

router.post('/therapies', authenticateToken, async (req, res) => {
    try {
        const { title, description, imageUrl, cardImageUrl, sections } = req.body;

        const therapy = new Therapy({
            title,
            description,
            imageUrl,
            cardImageUrl,
            creator: req.user.userId
        });

        await therapy.save();

        if (sections && sections.length > 0) {
            for (let section of sections) {
                const newSection = new Section({
                    title: section.title,
                    therapy: therapy._id,
                    creator: req.user.userId
                });
                await newSection.save();

                if (section.steps && section.steps.length > 0) {
                    for (let step of section.steps) {
                        const newStep = new Step({
                            title: step.title,
                            content: step.content,
                            section: newSection._id,
                            creator: req.user.userId
                        });
                        await newStep.save();
                    }
                }
            }
        }

        res.status(201).json({ message: 'Terapi ve ilgili bölümler/adımlar başarıyla eklendi!', therapy });
    } catch (error) {
        console.error('Error creating therapy:', error);
        res.status(500).json({ message: 'Bir hata oluştu!', error });
    }
});

router.post('/podcasts', authenticateToken, async (req, res) => {
    try {
        const { title, description, cardImageUrl, imageUrl, source } = req.body;

        const podcast = new Podcast({
            title,
            description,
            cardImageUrl,
            imageUrl,
            source,
            creator: req.user.userId
        });

        await podcast.save();

        res.status(201).json({ message: 'Podcast başarıyla eklendi!', podcast });
    } catch (error) {
        console.error('Error creating podcast:', error);
        res.status(500).json({ message: 'Bir hata oluştu!', error });
    }
});

router.post('/exercises', authenticateToken, async (req, res) => {
    try {
        const { name, description, imageUrl, cardImageUrl, steps } = req.body;

        const exercise = new Exercise({
            name,
            description,
            imageUrl,
            cardImageUrl,
            creator: req.user.userId
        });

        await exercise.save();

        if (steps && steps.length > 0) {
            for (let step of steps) {
                const newExerciseStep = new ExerciseStep({
                    source: step.source,
                    stepDescription: step.stepDescription,
                    exercise: exercise._id,
                    creator: req.user.userId
                });
                await newExerciseStep.save();
            }
        }

        res.status(201).json({ message: 'Egzersiz ve ilgili adımlar başarıyla eklendi!', exercise });
    } catch (error) {
        console.error('Error creating exercise:', error);
        res.status(500).json({ message: 'Bir hata oluştu!', error });
    }
});

router.post('/posts', authenticateToken, async (req, res) => {
    try {
        const { title, description, imageUrl, cardImageUrl, source } = req.body;

        const post = new Post({
            title,
            description,
            imageUrl,
            cardImageUrl,
            source,
            creator: req.user.userId
        });

        await post.save();

        res.status(201).json({ message: 'Post başarıyla eklendi!', post });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Bir hata oluştu!', error });
    }
});

module.exports = router;
