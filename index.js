const express = require('express');
const cors = require('cors');
const sql = require('msnodesqlv8');
const multer = require('multer');
const bodyParser = require('body-parser');


const app = express();
const port = 3300;

app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const conn_str = "Driver={ODBC Driver 17 for SQL Server};Server=DESKTOP-C71347J\\SQLEXPRESS;UID=DESKTOP-C71347J\\furen;PWD=12300;Database=db_TravelMolodechno;Trusted_Connection=Yes;";

app.get('/loadLandMark', (req, res) => {
  sql.open(conn_str, function (err, conn) {
    if (err) {
      console.error('Error opening the connection:', err);
      res.status(500).json({ error: 'Ошибка при открытии соединения с базой данных' });
      return;
    }

    // Измененный SQL-запрос для выбора и NameLandMark, и ImageData
    conn.query('SELECT ID, NameLandMark, ImageData, ImageMapData FROM tbl_LandMark', function (err, result) {
      if (err) {
        console.error('Ошибка при выполнении запроса:', err);
        res.status(500).json({ error: 'Ошибка при выполнении запроса к базе данных' });
      } else {
        res.json(result);
      }

      conn.close();
    });
  });
});

app.get('/loadEntertaiment', (req, res) => {
  sql.open(conn_str, function (err, conn) {
    if (err) {
      console.error('Error opening the connection:', err);
      res.status(500).json({ error: 'Ошибка при открытии соединения с базой данных' });
      return;
    }

    // Измененный SQL-запрос для выбора данных о развлечениях
    conn.query('SELECT Title_Entertaiment, En_Description, ImageData FROM tbl_Entertaiment', function (err, result) {
      if (err) {
        console.error('Ошибка при выполнении запроса:', err);
        res.status(500).json({ error: 'Ошибка при выполнении запроса к базе данных' });
      } else {
        if (!result) {
          res.json([]); // Return an empty array if the result is null
        } else {
          res.json(result);
        }
      }

      conn.close();
    });
  });
});


app.post('/addLandmark', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'mapImage', maxCount: 1 }]), (req, res) => {
  sql.open(conn_str, function (err, conn) {
    if (err) {
      console.error('Error opening the connection:', err);
      res.status(500).json({ error: 'Ошибка при открытии соединения с базой данных' });
      return;
    }

    const nameLandmark = req.body.nameLandmark;
    const imageBinary = req.files['image'][0].buffer;
    const mapImageBinary = req.files['mapImage'][0].buffer;

    // Пример запроса в базу данных для сохранения данных
    const query = "INSERT INTO tbl_LandMark (NameLandMark, ImageData, ImageMapData) VALUES (?, ?, ?)";
    const parameters = [nameLandmark, imageBinary, mapImageBinary];

    conn.query(query, parameters, function (err, result) {
      if (err) {
        console.error('Ошибка при выполнении запроса:', err);
        res.status(500).json({ error: 'Ошибка при выполнении запроса к базе данных' });
      } else {
        res.status(200).json({ success: true });
      }

      conn.close();
    });
  });
});

// Modify the endpoint to handle only one image
app.post('/addEntertainment', upload.single('image'), (req, res) => {
  sql.open(conn_str, function (err, conn) {
    if (err) {
      console.error('Error opening the connection:', err);
      res.status(500).json({ error: 'Ошибка при открытии соединения с базой данных' });
      return;
    }

    const titleEntertainment = req.body.titleEntertainment;
    const enDescription = req.body.enDescription;
    const imageBinary = req.file.buffer;

    // Modify the SQL query to insert data into tbl_Entertaiment
    const query = "INSERT INTO tbl_Entertaiment (Title_Entertaiment, En_Description, ImageData) VALUES (?, ?, ?)";
    const parameters = [titleEntertainment, enDescription, imageBinary];

    conn.query(query, parameters, function (err, result) {
      if (err) {
        console.error('Ошибка при выполнении запроса:', err);
        res.status(500).json({ error: 'Ошибка при выполнении запроса к базе данных' });
      } else {
        res.status(200).json({ success: true });
      }

      conn.close();
    });
  });
});


app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
