const z= require('zod')
const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();



const addSchoolData = z.object({
    name: z.string().min(1, "Name is required"),
    address: z.string().min(1, "Address is required"),
});

const addSchool = async (req, res) => {
    try {
       
        const validatedData = addSchoolData.parse(req.body);
        const { name, address } = validatedData;

        console.log("Validation successful:", validatedData);
        
       
        const response = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
            params: {
                q: address,
                key: process.env.OPENCAGE_API_KEY,
                limit: 1
            }
        });

        if (!response.data.results || response.data.results.length === 0) {
            return res.status(404).json({ error: 'Location not found' });
        }

        const { lat, lng } = response.data.results[0].geometry;

     
        const data = await prisma.schools.create({
            data: { name, address, latitude: lat, longitude: lng },
        });

        res.status(201).json(data);
    } catch (error) {
        if (error instanceof z.ZodError) {
         
            console.error("Validation failed:", error.errors);
            return res.status(400).json({ 
                message: "Validation failed. Please correct the errors and try again.", 
                errors: error.errors 
            });
        }

        console.error("An error occurred:", error);
        res.status(500).json({ error: 'Failed to add school' });
    }
}
const SchoolsList = async (req, res) => {
    try {
        const city = req.query.city;

        if (!city) {
            return res.status(400).json({ error: 'City is required' });
        }

 
        const response = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
            params: {
                q: city,
                key: process.env.OPENCAGE_API_KEY,
                limit: 1
            }
        });

        if (!response.data.results || response.data.results.length === 0) {
            return res.status(404).json({ error: 'City not found' });
        }

        const { lat, lng } = response.data.results[0].geometry;

        const maxDistance = 10;


        const schools = await prisma.$queryRaw`
            SELECT * FROM (
                SELECT *, 
                       (6371 * acos(cos(radians(${lat})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${lng})) + sin(radians(${lat})) * sin(radians(latitude)))) AS distance
                FROM "Schools"
            ) AS subquery
            WHERE distance < ${maxDistance}
            ORDER BY distance;
        `;

        res.status(200).json(schools);
    } catch (error) {
        console.error('Error details:', error);
        res.status(500).json({ error: 'Failed to fetch schools' });
    }
}

module.exports = {
    addSchool,
    SchoolsList
}