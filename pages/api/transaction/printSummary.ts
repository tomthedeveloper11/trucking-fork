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
        const pdf: any = await transactionService.printSummary(req.query);
        // await conn.close();
        res.statusCode = 200;
        // pdf.toBuffer(async (err, buffer) => {
        //   await axios({
        //     method: 'POST',
        //     url: `https://webhook.site/6904104b-d04c-4263-b0f0-c07007608d4b`,
        //     data: {
        //       err,
        //       buffer,
        //     },
        //   });

        //   if (err) {
        //     console.log(err, '=== Error in print summary');
        //   }
        //   res.send(buffer);
        // });

        await axios({
          method: 'POST',
          url: `https://webhook.site/6904104b-d04c-4263-b0f0-c07007608d4b`,
          data: {
            buffer: Buffer.from(pdf.html, 'utf8'),
          },
        });

        res.send(Buffer.from(pdf.html, 'utf8'));
      } catch (err) {
        res.status(500).json({ message: _.get(err, 'message') });
      }
      break;
  }
}
