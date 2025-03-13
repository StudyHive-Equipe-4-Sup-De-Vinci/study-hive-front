import axiosI from "../axiosInterceptor";
import { Post } from "../pages/course/Course";

export async function sendFile({
  file,
  title,
}: //   matiere,
{
  file: File;
  title: string;
  //   matiere: string;
}) {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("title", title);
  formData.append("category_id", "1");
  formData.append("description", "test description");

  const res = await axiosI.post("/post", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export async function getPost({ id }: { id: string }): Promise<Post | null> {
  const post = await axiosI.get("/api/posts/" + id);
  if (post.data.message) {
    return post.data.post;
  } else {
    return null;
  }
}
