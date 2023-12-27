const express = require('express');
const cors = require('cors');
const sql = require('msnodesqlv8');

const app = express();
const port = 3300;

app.use(cors());
app.use(express.json());

const conn_str = "Driver={ODBC Driver 17 for SQL Server};Server=DESKTOP-C71347J\\SQLEXPRESS;UID=DESKTOP-C71347J\\furen;PWD=12300;Database=db_TravelMolodechno;Trusted_Connection=Yes;";

app.get('/loadLandMark', (req, res) => {
  sql.open(conn_str, function (err, conn) {
    if (err) {
      console.error('Error opening the connection:', err);
      res.status(500).json({ error: 'Ошибка при открытии соединения с базой данных' });
      return;
    }

    conn.query('SELECT NameLandMark FROM tbl_LandMark', function (err, result) {
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

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
