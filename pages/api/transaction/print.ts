import { NextApiRequest, NextApiResponse } from 'next';
import connectDb from '../../../src/mongodb/connection';
import transactionService from '../../../src/transaction/transaction.service';

import fs from 'fs';
import puppeteer from 'puppeteer';
import handlers from 'handlebars';

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
      // const { transactionIds } = req.body;
      const data = JSON.parse(req.body);
      // const customerName = name || 'John Doe';

      try {
        // read our invoice-template.html file using node fs module
        const file = fs.readFileSync('./asd.html', 'utf8');

        // compile the file with handlebars and inject the customerName variable
        const template = handlers.compile(`${file}`);
        const html = template(JSON.parse(JSON.stringify(data)));

        // simulate a chrome browser with puppeteer and navigate to a new page
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // set our compiled html template as the pages content
        // then waitUntil the network is idle to make sure the content has been loaded
        await page.setContent(html, { waitUntil: 'networkidle0' });

        // convert the page to pdf with the .pdf() method
        const pdf = await page.pdf({ format: 'A4' });
        await browser.close();

        // send the result to the client
        res.statusCode = 200;
        res.send(pdf);
      } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
      }

    // await transactionService.printTransaction(transactionIds);
    // await conn.close();

    // res.status(200).json({ data: 'Print Successful', fuck: 'u' });
    // break;
  }
}
