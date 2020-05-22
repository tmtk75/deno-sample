const token = Deno.env.get("GITHUB_TOKEN");

export const headers = {
  authorization: `token ${token}`,
  accept: "application/vnd.github.inertia-preview+json",
};
