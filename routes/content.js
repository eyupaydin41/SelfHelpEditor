const express = require('express');
const router = express.Router();
const Section = require('../models/section');
const Step = require('../models/step');
const Therapy = require('../models/therapy');

// Therapy oluşturma route'u güncelleme
router.post('/therapies', async (req, res) => {
    try {
        const { title, description, imageUrl, cardImageUrl, sections } = req.body;

        // Yeni terapi oluştur
        const therapy = new Therapy({
            title,
            description,
            imageUrl,
            cardImageUrl
        });

        await therapy.save();

        // Bölümler ve Adımlar ekleme
        if (sections && sections.length > 0) {
            for (let section of sections) {
                const newSection = new Section({
                    title: section.title,
                    therapy: therapy._id
                });
                await newSection.save();

                if (section.steps && section.steps.length > 0) {
                    for (let step of section.steps) {
                        const newStep = new Step({
                            title: step.title,
                            content: step.content,
                            section: newSection._id
                        });
                        await newStep.save();
                    }
                }
            }
        }

        // Başarılı yanıt
        res.status(201).json({ message: 'Terapi ve ilgili bölümler/adımlar başarıyla eklendi!', therapy });
    } catch (error) {
        console.error('Error creating therapy:', error);
        res.status(500).json({ message: 'Bir hata oluştu!', error });
    }
});


module.exports = router;
