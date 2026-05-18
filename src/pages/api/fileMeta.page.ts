import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

type FileType = "image" | "pdf" | "other";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const fileUrl = req.query.url as string;

  try {
    const head = await axios.head(fileUrl);

    const size = head.headers["content-length"];

    let name = fileUrl.split("/").pop()?.split("?")[0] || "file";
    const disposition = head.headers["content-disposition"];

    if (disposition?.includes("filename=")) {
      name = disposition.split("filename=")[1].replace(/"/g, "");
    }

    const ext = name.split(".").pop()?.toLowerCase() || "";

    // ✅ EXTENSION-BASED TYPE DETECTION (FIX)
    let type: FileType = "other";
    if (["png", "jpg", "jpeg", "webp", "gif", "bmp"].includes(ext)) {
      type = "image";
    } else if (ext === "pdf") {
      type = "pdf";
    }

    res.status(200).json({
      name,
      ext,
      size: size ? Number(size) : null,
      type,
    });
  } catch {
    res.status(200).json({
      name: "Unknown",
      ext: "",
      size: null,
      type: "other",
    });
  }
}
