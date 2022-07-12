import { NextApiRequest, NextApiResponse } from 'next';
import connectDb from '../../../src/mongodb/connection';
import transactionService from '../../../src/transaction/transaction.service';

interface PrintTransactionsAPIRequest extends NextApiRequest {
  body: {
    transactionIds: string;
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
        const { transactionIds } = JSON.parse(req.body);
        const pdf = await transactionService.printTransaction(transactionIds);
        await conn.close();
        res.statusCode = 200;
        res.send(pdf);
      } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
      }

    // res.status(200).json({ data: 'Print Successful', fuck: 'u' });
    // break;
  }
}
