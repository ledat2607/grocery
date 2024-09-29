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
    if (billboardRef.exists()) {
      await updateDoc(
        doc(db, "stores", params.storeId, "billboards", params.billboardId),
        {
          label,
          imageUrl,
          updatedAt: serverTimestamp(),
        }
      );
    } else {
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
      return new NextResponse("Unauthorized", { status: 401 }); // Sử dụng status 401 cho không có quyền
    }

    if (!params.storeId) {
      return new NextResponse("Store not found", { status: 404 });
    }
    if (!params.billboardId) {
      return new NextResponse("Billboard not found", { status: 404 });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));
    if (!store.exists()) {
      return new NextResponse("Store not found", { status: 404 });
    }

    let storeData = store.data();
    if (storeData?.userId !== userId) {
      return new NextResponse("Unauthorized", { status: 403 }); // Sử dụng status 403 cho không có quyền truy cập
    }

    const billboardRef = doc(
      db,
      "stores",
      params.storeId,
      "billboards",
      params.billboardId
    );
    const billboardSnapshot = await getDoc(billboardRef);
    
    if (!billboardSnapshot.exists()) {
      return new NextResponse("Billboard not found", { status: 404 });
    }

    await deleteDoc(billboardRef);

    // Không cần gọi getDoc sau khi đã xóa, có thể trả về một phản hồi thành công
    return new NextResponse("Billboard deleted successfully", { status: 200 });

  } catch (error) {
    console.error("Error deleting billboard:", error); // Log lỗi để kiểm tra
    return new NextResponse("Internal server error", { status: 500 });
  }
};

