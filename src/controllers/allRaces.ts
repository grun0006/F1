import { Request, Response } from 'express';
import * as Dotenv from 'dotenv';
Dotenv.config({ path: '.env' });

export const getAllRaces = async (req: Request, res: Response): Promise<void> => {
  res.render('allRaces');
};
