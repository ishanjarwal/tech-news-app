import { RequestHandler } from "express";
import slugify from "../utils/slugify";
import Tag from "../models/Tag";

// create a tag
export const createTag: RequestHandler = async (req, res) => {
  try {
    const { name, summary, thumbnail } = req.body;
    const slug = slugify(name);
    const newTag = new Tag({
      name,
      slug,
      summary,
      thumbnail,
    });
    await newTag.save();
    res.success(200, "success", "Tag created", { tagId: newTag._id });
    return;
  } catch (error) {
    res.error(500, "error", "Something went wrong", error);
    return;
  }
};
// fetch all tags (filter and sorting)

// fetch a tag by slug

// update a tag

// delete a tag (if posts for that are zero)
