import { NextApiRequest, NextApiResponse } from 'next';
import connectDb from '../../../src/mongodb/connection';
import transactionService from '../../../src/transaction/transaction.service';

interface PrintTransactionsAPIRequest extends NextApiRequest {
  body: {
    transactionIds: string[];
  };
}

export default async function handler(
  req: PrintTransactionsAPIRequest,
  res: NextApiResponse
) {
  let conn;
  switch (req.method) {
    case 'POST':
      conn = await connectDb();
      const { transactionIds } = req.body;
      await transactionService.printTransaction(transactionIds);
      await conn.close();
      res.status(200).json({ data: 'Print Successful', fuck: 'u' });
      break;
  }
}
