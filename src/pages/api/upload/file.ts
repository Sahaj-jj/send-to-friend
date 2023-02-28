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

    const newEntity = {
      [key]: {
        name: filename,
        type: filetype,
      },
    };

    // Add the new file to data
    fs.readFile("data.json", (err, data) => {
      if (err) {
        if (err.code === "ENOENT") {
          fs.writeFileSync("data.json", JSON.stringify(newEntity));
        } else {
          throw err;
        }
      } else {
        const con = fs.readFileSync("data.json").toString();
        fs.writeFileSync(
          "data.json",
          JSON.stringify({ ...JSON.parse(con), newEntity })
        );
      }
    });

    // Delete file after a certain time
    setTimeout(() => {
      fs.unlink(filename, (err) => {
        console.log("Error unlink");
      });
    }, 1 * 60 * 1000);

    // Send the generated key as response
    res.status(200).json({
      key,
    });
  }
}
