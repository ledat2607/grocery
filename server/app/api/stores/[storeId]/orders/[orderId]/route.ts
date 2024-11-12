import { db } from "@/lib/firebase";
import { Billboards, Category, Order, Product, Size } from "@/type-db";
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
  { params }: { params: { storeId: string; orderId: string } }
) => {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { order_status, product } = body;

    // Chuyển đổi productQuantities thành mảng nếu không phải là mảng
    const quantities = Array.isArray(product.productQuantities)
      ? product.productQuantities
      : [product.productQuantities];

    if (!order_status) {
      return new NextResponse("Order status is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store not found", { status: 404 });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));
    if (!store.exists()) {
      return new NextResponse("Store not found", { status: 404 });
    }

    const storeData = store.data();
    // if (storeData?.userId !== userId) {
    //   return new NextResponse("Unauthorized", { status: 403 });
    // }

    const orderRef = await getDoc(
      doc(db, "stores", params.storeId, "orders", params.orderId)
    );

    if (!orderRef.exists()) {
      return new NextResponse("Order not found", { status: 404 });
    }

    const orderData = orderRef.data() as Order;

    // Cập nhật trạng thái đơn hàng
    await updateDoc(
      doc(db, "stores", params.storeId, "orders", params.orderId),
      {
        ...orderData,
        order_status,
        updatedAt: serverTimestamp(),
      }
    );

    // Nếu trạng thái là "Deliveried", cập nhật số lượng sản phẩm
    if (order_status === "Deliveried") {
      await Promise.all(
        quantities.map(async (item: any) => {
          const productId = item.productId; // Lấy id sản phẩm từ productQuantities
          const qty = item.qty; // Lấy số lượng tương ứng

          // Tìm sản phẩm trong Firestore
          const productRef = doc(
            db,
            "stores",
            params.storeId,
            "products",
            productId
          );
          const productDoc = await getDoc(productRef);

          if (productDoc.exists()) {
            const productData = productDoc.data() as Product;

            // Giả định giảm số lượng sản phẩm theo qty từ đơn hàng
            const updatedQty = productData.qty - qty;

            // Đảm bảo số lượng không âm
            if (updatedQty < 0) {
              return new NextResponse(
                `Not enough stock for product ${productData.name}`,
                { status: 400 }
              );
            }

            // Cập nhật sản phẩm
            await updateDoc(productRef, {
              qty: updatedQty,
              sold_out: productData.sold_out + qty, // Tăng số lượng sản phẩm đã bán
              updatedAt: serverTimestamp(),
            });
          } else {
            return new NextResponse(`Product with ID ${productId} not found`, {
              status: 404,
            });
          }
        })
      );
    }

    // Trả về chỉ id của đơn hàng đã cập nhật
    return NextResponse.json({ id: params.orderId });
  } catch (error) {
    console.error("Error in PATCH:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};







export const DELETE = async (
  req: Request,
  { params }: { params: { storeId: string; orderId: string } }
) => {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse("Store not found", { status: 404 });
    }
    if (!params.orderId) {
      return new NextResponse("Order not found", { status: 404 });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));
    if (!store.exists()) {
      return new NextResponse("Store not found", { status: 404 });
    }

    let storeData = store.data();
    if (storeData?.userId !== userId) {
      return new NextResponse("Unauthorized", { status: 403 }); // Sử dụng status 403 cho không có quyền truy cập
    }

    const sizeRef = doc(db, "stores", params.storeId, "orders", params.orderId);
    const sizeSnapshot = await getDoc(sizeRef);

    if (!sizeSnapshot.exists()) {
      return new NextResponse("Billboard not found", { status: 404 });
    }

    await deleteDoc(sizeRef);

    return new NextResponse("Deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Error deleting:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
