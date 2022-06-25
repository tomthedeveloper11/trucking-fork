import { NextApiRequest, NextApiResponse } from 'next';
import { check, validationResult } from 'express-validator';
import transactionService from '../../../src/transaction/transaction.service';
import initMiddleware from '../../../src/middlewares/init-middleware';
import validateMiddleware from '../../../src/middlewares/validate-middleware';
import { TruckTransaction } from '../../../types/common';
import connectDb from '../../../src/mongodb/connection';

interface TruckDetailProps extends NextApiRequest {
  query: {
    truckId: string;
  };
}

export default async function handler(
  req: TruckDetailProps,
  res: NextApiResponse
) {
  let conn;
  switch (req.method) {
    case 'GET':
      conn = await connectDb();

      const truckId = req.query.truckId;
      const transactions = await transactionService.getTruckTransactions(
        truckId
      );
      await conn.close();
      res.status(200).json({ data: transactions });
      break;
  }
}
