// /pages/api/todos.js

import { getToken } from "next-auth/jwt";
import { Octokit } from " @octokit/rest";

export default async function handler(req, res) {
  const token = await getToken({ req });

  if (!token?.accessToken) return res.status(401).json({ error: "Not signed in" });

  const octokit = new Octokit({ auth: token.accessToken });

  const owner = "yourusername";
  const repo = "todo-data";
  const path = "todos.json";

  if (req.method === "GET") {
    const { data } = await octokit.repos.getContent({ owner, repo, path });
    const content = Buffer.from(data.content, "base64").toString();
    res.status(200).json(JSON.parse(content));
  }

  if (req.method === "POST") {
    const { message, todos } = req.body;

    const { data: fileData } = await octokit.repos.getContent({ owner, repo, path });

    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message: message || "Update todos",
      content: Buffer.from(JSON.stringify(todos, null, 2)).toString("base64"),
      sha: fileData.sha,
    });

    res.status(200).json({ success: true });
  }
}
