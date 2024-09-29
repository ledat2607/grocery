import { db } from "@/lib/firebase";
import { Billboards } from "@/type-db";
import { auth } from "@clerk/nextjs/server";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) => {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Un_authorization", { status: 404 });
    }
    const body = await req.json();

    const { label, imageUrl } = body;
    if (!label) {
      return new NextResponse("Billboard label is required", { status: 402 });
    }
    if (!imageUrl) {
      return new NextResponse("Billboard image is required", {
        status: 402,
      });
    }
    if (!params.storeId) {
      return new NextResponse("Store not found", { status: 404 });
    }
    if (!params.billboardId) {
      return new NextResponse("Billboard not found", { status: 404 });
    }
    const store = await getDoc(doc(db, "stores", params.storeId));

    if (store.exists()) {
      let storeData = store.data();
      if (storeData?.userId !== userId) {
        return new NextResponse("Un_authorized", { status: 405 });
      }
    }

    const billboardRef = await getDoc(
      doc(db, "stores", params.storeId, "billboards", params.billboardId)
    );
    const id = billboardRef.id;
    if(billboardRef.exists()){
        await updateDoc(
          doc(db, "stores", params.storeId, "billboards", params.billboardId),
          {
            ...billboardRef.data(),
            label,
            imageUrl,
            updatedAt: serverTimestamp(),
          }
        );
    }else{
        return new NextResponse("Billboard not found", { status: 401 });
    }
    const billboard = (
      await getDoc(
        doc(db, "stores", params.storeId, "billboards", params.billboardId)
      )
    ).data() as Billboards;
    return NextResponse.json(billboard);
  } catch (error) {
    return new NextResponse("Internal server error", { status: 500 });
  }
};


export const DELETE = async (
    req: Request,
    { params }: { params: { storeId: string; billboardId: string } }
  ) => {
    try {
      const { userId } = await auth();
      if (!userId) {
        return new NextResponse("Un_authorization", { status: 404 });
      }

      if (!params.storeId) {
        return new NextResponse("Store not found", { status: 404 });
      }
      if (!params.billboardId) {
        return new NextResponse("Billboard not found", { status: 404 });
      }
      const store = await getDoc(doc(db, "stores", params.storeId));

      if (store.exists()) {
        let storeData = store.data();
        if (storeData?.userId !== userId) {
          return new NextResponse("Un_authorized", { status: 405 });
        }
      }

      const billboardRef = doc(
        db,
        "stores",
        params.storeId,
        "billboards",
        params.billboardId
      );

      await deleteDoc(billboardRef);

      const billboard = (
        await getDoc(
          doc(db, "stores", params.storeId, "billboards", params.billboardId)
        )
      ).data() as Billboards;
      return NextResponse.json(billboard);
    } catch (error) {
      return new NextResponse("Internal server error", { status: 500 });
    }
  };