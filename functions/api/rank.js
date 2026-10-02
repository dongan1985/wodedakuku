export async function onRequest({ request, env }) {
  try {
    // 获取D1数据库实例
    const db = env.exam_rank_db;
    if (!db) {
      return new Response(JSON.stringify({msg:"D1绑定失效"}), {
        status: 500,
        headers: { "Content-Type": "application/json;charset=utf-8" }
      });
    }

    // GET：读取排行榜
    if (request.method === "GET") {
      const { results } = await db.prepare(`
        SELECT mode, name, score, time FROM exam_rank ORDER BY score DESC, time ASC
      `).all();
      return new Response(JSON.stringify(results), {
        headers: { "Content-Type": "application/json;charset=utf-8" }
      });
    }

    // POST：提交分数
    if (request.method === "POST") {
      const body = await request.json();
      await db.prepare(`
        INSERT INTO exam_rank(mode,name,score,time) VALUES (?,?,?,?)
      `).bind(body.mode, body.name, body.score, body.time).run();
      return new Response(JSON.stringify({ ok: true }), {
        headers: { "Content-Type": "application/json;charset=utf-8" }
      });
    }

    return new Response(JSON.stringify({msg:"请求方式不允许"}), {status:405});
  } catch (err) {
    // 捕获所有异常，返回错误详情，不再触发1101崩溃页
    return new Response(JSON.stringify({
      error: err.message,
      stack: err.stack
    }), {
      status: 500,
      headers: { "Content-Type": "application/json;charset=utf-8" }
    });
  }
}
