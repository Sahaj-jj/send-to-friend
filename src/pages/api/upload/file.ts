// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const filename = req.query.filename as string;
    const filetype = req.query.filetype as string;

    // Append the chunk to file
    req.on("data", (chunk) => {
      fs.appendFileSync(filename, chunk);
    });

    // Generate random 6-digit key
    const key = [...Array(6)]
      .map((_) => (Math.random() * 10) | 0)
      .join(``)
      .toString();

    // Add the new file to data
    const con = fs.readFileSync("data.json").toString();
    const newData = JSON.stringify({
      ...JSON.parse(con),
      [key]: {
        name: filename,
        type: filetype,
      },
    });
    fs.writeFileSync("data.json", newData);

    // Delete file after a certain time
    setTimeout(() => {
      fs.unlink(filename, (err) => {
        console.log("Error unlink");
      });
    }, 1 * 60 * 1000);

    // Send the generated key as response
    res.json({
      key,
    });
  }
}
