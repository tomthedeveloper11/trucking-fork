import { NextApiRequest, NextApiResponse } from 'next';
import connectDb from '../../../src/mongodb/connection';
import transactionService from '../../../src/transaction/transaction.service';
import _ from 'lodash';

interface PrintTransactionsAPIRequest extends NextApiRequest {
  body: {
    invoiceNum: string;
    transactionIds: string[];
    type: string;
  };
}

export default async function handler(
  req: PrintTransactionsAPIRequest,
  res: NextApiResponse
) {
  let conn;
  switch (req.method) {
    case 'POST':
      try {
        conn = await connectDb();
        const {invoiceNum, transactionIds, type } = req.body;
        const pdf = await transactionService.printTransaction(
          invoiceNum,
          transactionIds,
          type
        );
        await conn.close();
        res.statusCode = 200;
        res.send(pdf);
      } catch (err) {
        console.log(err);
        res.status(500).json({ message: _.get(err, 'message') });
      }
      break;
  }
}
