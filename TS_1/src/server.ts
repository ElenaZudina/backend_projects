import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const port = 3000;

app.use(express.static(path.join (__dirname, '..')));
app.use(express.json({ limit: '10mb' }));

app.post('/save', (req: Request, res: Response) => {
    const { image, name } = req.body;
    const base64Data = image.replace(/^data:image\/png;base64,/, '');
    const imgDir = path.join(__dirname, '..', 'img') // путь к папке img

    let safeName = name.replace(/[^a-z0-9а-яё\s_-]/gi, ''); // убираем странные символы
    let imageName = `${safeName}.png`;
    let counter = 1;
    //const imageName = `${safeName}-${Date.now()}.png`; // уникальное имя файла
    // const imagePath = path.join(__dirname, '..', 'img', imageName);

    while (fs.existsSync(path.join(imgDir, imageName))) {
        imageName = `${safeName}(${counter}).png`;
        counter++;
    }

    const imagePath = path.join(imgDir, imageName);

    fs.writeFile(imagePath, base64Data, 'base64', (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: 'Failed to save image' });
        }
        res.json({ message: 'Image saved successfully', file: imageName});
        //res.json({message: 'Image saved successfully', displayName: safeName, file: imageName });
    });
});

app.get('/images', (req: Request, res: Response) => {
    const imgDir = path.join(__dirname, '..', 'img');
    fs.readdir(imgDir, (err, files) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Failed to read images' });
        }
        res.json(files);
    });
});

app.delete('/images/:filename', (req: Request, res: Response) => {
    const { filename } = req.params;
    const imagePath = path.join(__dirname, '..', 'img', filename);

    fs.unlink(imagePath, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Failed to delete image' });
        }
        res.json({ message: 'Image deleted successfully '});
    });
});

app.delete('/images', (req, res) => {
    const imgDir = path.join(__dirname, '..', 'img');
    fs.readdir(imgDir, (err, files) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: 'Failed to clear gallery' });
        }
        for (const file of files) {
            fs.unlinkSync(path.join(imgDir, file));
        }
        res.json({ message: 'Gallery is cleared successfully'});
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});