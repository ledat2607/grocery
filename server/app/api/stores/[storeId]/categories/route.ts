import { db } from "@/lib/firebase";
import { Category } from "@/type-db";
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

// Reusable CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// CORS wrapper for responses
const withCORS = (response: NextResponse) => {
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
};

// Handle OPTIONS request for CORS preflight
const handleOptionsRequest = () => {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
};

// POST handler with CORS
export const POST = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  if (req.method === "OPTIONS") {
    return handleOptionsRequest(); // Return preflight response for CORS
  }

  try {
    const { userId } = await auth();
    if (!userId) {
      return withCORS(new NextResponse("Unauthorized", { status: 401 }));
    }

    const body = await req.json();
    const { name, billboardId } = body;

    if (!name || !billboardId || !params.storeId) {
      return withCORS(new NextResponse("Missing required fields", { status: 400 }));
    }

    const store = await getDoc(doc(db, "stores", params.storeId));
    if (!store.exists() || store.data()?.userId !== userId) {
      return withCORS(new NextResponse("Store not found or unauthorized", { status: 404 }));
    }

    const billboardRef = await getDoc(doc(db, "stores", params.storeId, "billboards", billboardId));
    if (!billboardRef.exists()) {
      return withCORS(new NextResponse("Billboard not found", { status: 404 }));
    }

    const categoryData = {
      name,
      billboardLabel: billboardRef.data()?.label,
      billboardId,
      createdAt: serverTimestamp(),
    };

    const categoryRef = await addDoc(
      collection(db, "stores", params.storeId, "categories"),
      categoryData
    );
    const id = categoryRef.id;

    await updateDoc(doc(db, "stores", params.storeId, "categories", id), {
      ...categoryData,
      id,
      updatedAt: serverTimestamp(),
    });

    return withCORS(NextResponse.json({ id, ...categoryData }));
  } catch (error) {
    console.error("Error creating category:", error);
    return withCORS(new NextResponse("Internal server error", { status: 500 }));
  }
};

// GET handler with CORS
export const GET = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    if (!params.storeId) {
      return withCORS(new NextResponse("Store not found", { status: 404 }));
    }

    const sizeData = (
      await getDocs(collection(doc(db, "stores", params.storeId), "categories"))
    ).docs.map((doc) => doc.data()) as Category[];

    return withCORS(NextResponse.json(sizeData));
  } catch (error) {
    console.error("Error fetching sizes:", error);
    return withCORS(new NextResponse("Internal server error", { status: 500 }));
  }
};
