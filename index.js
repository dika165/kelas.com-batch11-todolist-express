/*
    1. buat Endpoint untuk
    - update data user berdasarkan id, berikan response berupa data yang sudah di update di database
    - get data user berdasarkan id
    - Modifikasi endpoint create user, ketika berhasil created berikan response data yang berhasil dibuat di database
    2. Buat REST API CRUD untuk table task yang pada sesi 3 dibuat.
*/

import express from 'express';
import userRouter from './routes/userRouter.js';

const app = express();
const port = 8080;
const host = "localhost";
app.use(express.json());
app.use("/users",userRouter);

app.listen(port, host, () => {
    console.log(`Server berjalan di http://${host}:${port}`);
})