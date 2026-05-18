import axios from "axios";

export default async function handler(req, res) {
  const pdfUrl = req.query.url;

  const response = await axios.get(pdfUrl, {
    responseType: "arraybuffer",
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "inline");
  res.send(response.data);
}
