import { NextApiRequest, NextApiResponse } from 'next';
import { check, validationResult } from 'express-validator';
import transactionService from '../../../src/transaction/transaction.service';
import initMiddleware from '../../../src/middlewares/init-middleware';
import validateMiddleware from '../../../src/middlewares/validate-middleware';
import { TruckTransaction } from '../../../types/common';
import connectDb from '../../../src/mongodb/connection';

interface TruckTransactionsAPIRequest extends NextApiRequest {
  body: TruckTransaction;
  query: {
    truckId: string;
  };
}

const createTruckTransactionValidator = initMiddleware(
  validateMiddleware(
    [
      check('truckId').isString().exists(),
      check('transactionType').isString().exists(),
      check('cost').isNumeric().exists(),
      check('invoiceNo').isString().optional(),
      check('containerNo').isString().optional(),
      check('customer').isString().optional(),
      check('destination').isString().optional(),
      check('sellingPrice').isNumeric().optional(),
      check('details').isString().optional(),
    ],
    validationResult
  )
);

export default async function handler(
  req: TruckTransactionsAPIRequest,
  res: NextApiResponse
) {
  let conn;
  switch (req.method) {
    case 'POST':
      await createTruckTransactionValidator(req, res);

      conn = await connectDb();
      const truckTransactionPayload = req.body;
      const truckTransaction = await transactionService.createTransaction(
        truckTransactionPayload
      );
      await conn.close();

      res.status(200).json({ data: truckTransaction });
      break;

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
