const express = require('express');


const app = express();


const schoolRoutes = require('./routes/schools')

app.use(express.json());

app.use('/api/v1/schools',schoolRoutes)


app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
 