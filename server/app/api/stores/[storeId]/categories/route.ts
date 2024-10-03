import { db } from "@/lib/firebase";
import { Billboards, Category } from "@/type-db";
import { auth } from "@clerk/nextjs/server";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Hoặc thay "*" bằng domain cụ thể như "http://localhost:3000"
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const POST = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  if (req.method === "OPTIONS") {
    return new NextResponse(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401, headers: corsHeaders });
    }

    const body = await req.json();
    const { name, billboardId } = body;

    if (!name || !billboardId || !params.storeId) {
      return new NextResponse("Missing required fields", { status: 400, headers: corsHeaders });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));
    if (!store.exists() || store.data()?.userId !== userId) {
      return new NextResponse("Store not found or unauthorized", { status: 404, headers: corsHeaders });
    }

    const billboardRef = await getDoc(doc(db, "stores", params.storeId, "billboards", billboardId));
    if (!billboardRef.exists()) {
      return new NextResponse("Billboard not found", { status: 404, headers: corsHeaders });
    }

    const categoryData = {
      name,
      billboardLabel: billboardRef.data()?.label,
      billboardId,
      createdAt: serverTimestamp(),
    };

    const categoryRef = await addDoc(collection(db, "stores", params.storeId, "categories"), categoryData);
    const id = categoryRef.id;

    await updateDoc(doc(db, "stores", params.storeId, "categories", id), {
      ...categoryData,
      id,
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ id, ...categoryData }, { headers: corsHeaders });
  } catch (error) {
    console.error("Error creating category:", error);
    return new NextResponse("Internal server error", { status: 500, headers: corsHeaders });
  }
};

export const GET = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  if (req.method === "OPTIONS") {
    return new NextResponse(null, { status: 200, headers: corsHeaders });
  }

  try {
    if (!params.storeId) {
      return new NextResponse("Store not found", { status: 404, headers: corsHeaders });
    }

    const categories = (
      await getDocs(collection(doc(db, "stores", params.storeId), "categories"))
    ).docs.map((doc) => doc.data()) as Category[];

    return NextResponse.json(categories, { headers: corsHeaders });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return new NextResponse("Internal server error", { status: 500, headers: corsHeaders });
  }
};
