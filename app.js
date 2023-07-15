const express = require('express');

const { PORT = 3000 } = process.env;

const app = express();

app.get('/', (req, res) => {
  res.send(
    `<html>
          <body>
              <p>Ответ на сигнал из далёкого космоса!!</p>
          </body>
          </html>`,
  );
});

app.listen(PORT, () => {});
