import { NextRequest, NextResponse } from "next/server";
import { cjFetch } from "@/lib/cj";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get("q") ?? "pet";
  const page = parseInt(searchParams.get("page") ?? "1");

  try {
    const data = await cjFetch(
      `/product/list?pageNum=${page}&pageSize=20&keyword=${encodeURIComponent(keyword)}&categoryId=`
    );

    console.log("[CJ products] response:", JSON.stringify(data).slice(0, 300));

    if (!data.result) {
      return NextResponse.json({ error: data.message ?? "CJ API error" }, { status: 502 });
    }

    return NextResponse.json({
      products: data.data?.list ?? [],
      total: data.data?.total ?? 0,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[CJ products] error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
