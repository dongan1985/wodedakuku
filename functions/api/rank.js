export async function onRequest({ request, env }) {
  const db = env.exam_rank_db;
  if (request.method === "GET") {
    const { results } = await db.prepare("SELECT name,score,time,mode FROM exam_rank ORDER BY score DESC, time ASC").all();
    return new Response(JSON.stringify(results), {
      headers: {
        "Content‑Type": "application/json",
        "Access‑Control‑Allow‑Origin": "*"
      }
    })
  }
  if (request.method === "POST") {
    const body = await request.json();
    const {mode,name,score,time} = body;
    await db.prepare("INSERT INTO exam_rank(mode,name,score,time) VALUES (?,?,?,?)").bind(mode,name,score,time).run();
    return new Response(JSON.stringify({ok:true}),{
      headers:{"Content‑Type":"application/json"}
    })
  }
  return new Response("Method Not Allowed", {status:405})
}
