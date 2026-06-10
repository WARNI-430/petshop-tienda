import { NextRequest, NextResponse } from "next/server";
import { cjFetch } from "@/lib/cj";

// Buscar productos en CJ para importar al catálogo
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get("q") ?? "pet";
  const page = parseInt(searchParams.get("page") ?? "1");

  const data = await cjFetch(
    `/product/list?pageNum=${page}&pageSize=20&keyword=${encodeURIComponent(keyword)}&categoryId=`
  );

  if (!data.result) {
    return NextResponse.json({ error: data.message ?? "CJ API error" }, { status: 502 });
  }

  return NextResponse.json({
    products: data.data?.list ?? [],
    total: data.data?.total ?? 0,
  });
}
