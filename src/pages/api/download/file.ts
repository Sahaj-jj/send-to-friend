// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const key = req.query.key as string;
    const con = fs.readFileSync("data.json").toString();

    const filename = JSON.parse(con)[key].name;
    const filetype = JSON.parse(con)[key].type;

    res.writeHead(200, {
      "Content-Type": filetype,
      "Content-Disposition": "attachment; filename=" + filename,
    });

    fs.createReadStream(filename).pipe(res);
  }
}
