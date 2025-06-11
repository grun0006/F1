// start.js setup from learnnode.com by Wes Bos
import Express, { Application, Request, Response, NextFunction } from 'express';
import * as Dotenv from 'dotenv';
Dotenv.config({ path: '.env' });

import IndexRouter from './routes/index.js';
// import { errorHandler } from './middleware/errors/errorHandler.js';

const app: Application = Express();
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3010;

// support json encoded and url-encoded bodies, mainly used for post and update
// test
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

// Set up EJS
app.set('view engine', 'ejs');

// Serve static files from the 'public' base directory
app.use(Express.static('public'));

app.use('/', IndexRouter);

// Error handling
app.use((req: Request, res: Response, next: NextFunction) => {
  try {
    res.render('404');
  } catch (err) {
    next(err);
  }
});
// app.use(errorHandler);

app.listen(port, () => {
  console.log(`🍿 Express running → PORT ${port}`);
});
