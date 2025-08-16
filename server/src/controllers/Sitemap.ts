import { RequestHandler } from "express";
import Post from "../models/Post";

export const fetchPostSlugs: RequestHandler = async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 250;
    const skip = (page - 1) * limit;

    const sortField = "created_at";
    const sortOrder = -1;

    const slugs = await Post.find({ status: "published" })
      .select("slug -_id")
      .sort({ sortField: sortOrder })
      .limit(limit)
      .skip(skip);

    res.success(200, "success", "slugs fetched for sitemap", slugs);
  } catch (error) {
    console.error(error);
    res.error(500, "error", "Something went wrong", {});
  }
};
