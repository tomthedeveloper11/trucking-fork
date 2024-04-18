import { NextApiRequest, NextApiResponse } from 'next';
import connectDb from '../../../src/mongodb/connection';
import transactionService from '../../../src/transaction/transaction.service';
import _ from 'lodash';
import axios from 'axios';

interface PrintSummaryRequest extends NextApiRequest {
  query: {
    startDate: Date;
    endDate: Date;
  };
}

export default async function handler(
  req: PrintSummaryRequest,
  res: NextApiResponse
) {
  let conn;
  switch (req.method) {
    case 'GET':
      try {
        conn = await connectDb();
        const html: any = await transactionService.printSummary(req.query);
        // await conn.close();
        res.statusCode = 200;
        res.send(html);
      } catch (err) {
        res.status(500).json({ message: _.get(err, 'message') });
      }
      break;
  }
}
