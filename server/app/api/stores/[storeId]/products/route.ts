import { db } from "@/lib/firebase";
import { Billboards, Product, Size } from "@/type-db";
import { auth } from "@clerk/nextjs/server";
import {
  addDoc,
  and,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { NextResponse } from "next/server";
import { json } from "stream/consumers";

export const POST = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Un_authorization", { status: 404 });
    }
    const body = await req.json();

    const {
      name,
      price,
      discountPrice,
      category,
      size,
      cuisine,
      images,
      isFeatured,
      isArchived,
      qty,
    } = body;
    if (!name) {
      return new NextResponse("Size name is required", { status: 402 });
    }
    if (!images || !images.length) {
      return new NextResponse("Image is required", {
        status: 402,
      });
    }
    if (!price || !discountPrice) {
      return new NextResponse("Price is required", {
        status: 402,
      });
    }
    if (!params.storeId) {
      return new NextResponse("Store not found", { status: 404 });
    }
    const store = await getDoc(doc(db, "stores", params.storeId));

    if (store.exists()) {
      let storeData = store.data();
      if (storeData?.userId !== userId) {
        return new NextResponse("Un_authorized", { status: 405 });
      }
    }
    const productData = {
      name,
      price,
      discountPrice,
      category,
      size,
      cuisine,
      images,
      isFeatured,
      isArchived,
      qty,
      createdAt: serverTimestamp(),
    };

    const productRef = await addDoc(
      collection(db, "stores", params.storeId, "products"),
      productData
    );
    const id = productRef.id;
    await updateDoc(doc(db, "stores", params.storeId, "products", id), {
      ...productData,
      id,
      updatedAt: serverTimestamp(),
    });
    return NextResponse.json({ id, ...productData });
  } catch (error) {
    return new NextResponse("Internal server error", { status: 500 });
  }
};

export const GET = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    if (!params.storeId) {
      return new NextResponse("Store not found", { status: 404 });
    }

    const { searchParams } = new URL(req.url);

    const productRef = collection(
      doc(db, "stores", params.storeId),
      "products"
    );
    let productQuery;

    let queryContraints = [];

    // Filler by size
    const size = searchParams.get("size");
    if (size) {
      queryContraints.push(where("size", "==", size));
    }

    // Filler by category
    const category = searchParams.get("category");
    if (category) {
      queryContraints.push(where("category", "==", category));
    }

    // Filler by cuisine
    const cuisine = searchParams.get("cuisine");
    if (cuisine) {
      queryContraints.push(where("cuisine", "==", cuisine));
    }

    // Filler by isFeatured
    const isFeatured = searchParams.get("isFeatured");
    if (isFeatured) {
      queryContraints.push(where("isFeatured", "==", isFeatured === "true"));
    }
    const isArchived = searchParams.get("isArchived");
    if (isArchived) {
      queryContraints.push(where("isArchived", "==", isArchived === "true"));
    }

   
    if (queryContraints.length > 0) {
      productQuery = query(productRef, and(...queryContraints));
    } else {
      productQuery = query(productRef);
    }

    const querySnapshot = await getDocs(productQuery);

    const productData: Product[] = querySnapshot.docs.map(
      (doc) => doc.data() as Product
    );

    return NextResponse.json(productData);
  } catch (error) {
    console.error("Error fetching products:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
