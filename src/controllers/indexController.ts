import { Request, Response } from 'express';
import { ArticleResponse } from '../utils/interfaces.js';
import * as Dotenv from 'dotenv';
Dotenv.config({ path: '.env' });
import { getData } from '../utils/ajax.js';

const apiUrl: string = process.env.API_URL;

export const getIndex = async (req: Request, res: Response): Promise<void> => {
  const data: ArticleResponse = await getData(apiUrl + 'location?session_key=latest&driver_number=81');
  res.render('index', { data: data });
};
