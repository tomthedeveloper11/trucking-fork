import { CookieParseOptions } from './../../../../node_modules/@types/cookie/index.d';
import { NextApiRequest, NextApiResponse } from 'next';
import transactionService from '../../../../src/transaction/transaction.service';
import connectDb from '../../../../src/mongodb/connection';
import _ from 'lodash';
import initMiddleware from '../../../../src/middlewares/init-middleware';
import { check, validationResult } from 'express-validator';
import validateMiddleware from '../../../../src/middlewares/validate-middleware';
import * as jwt from 'jsonwebtoken';

interface TransactionSummaryRequest extends NextApiRequest {
  query: {
    startDate: Date;
    endDate: Date;
  };
}

const transactionSummaryValidator = initMiddleware(
  validateMiddleware(
    [
      check('month').isString().isLength({ min: 1 }).exists(),
      check('year').isString().isLength({ min: 4 }).exists(),
    ],
    validationResult
  )
);

export default async function handler(
  req: TransactionSummaryRequest,
  res: NextApiResponse
) {
  let conn;
  try {
    switch (req.method) {
      case 'GET':
        const { access_token } = req.headers;
        const user = jwt.decode(access_token, process.env.SECRET_KEY);

        conn = await connectDb();
        const truckTransactions =
          await transactionService.getGroupedTruckTransactions(req.query);
        await conn.close();

        // if (user?.role === 'user'){
        //  TODO: delete selling price sama margin
        // }

        res.status(200).json({ data: truckTransactions });
        break;
    }
  } catch (error) {
    res.status(500).json({ message: _.get(error, 'message') });
  }
}
