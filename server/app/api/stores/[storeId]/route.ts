import { db, storage } from "@/lib/firebase";
import { Store } from "@/type-db";
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
import { deleteObject, ref } from "firebase/storage";
import { NextResponse } from "next/server";

//update store
export const PATCH = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Un_authorization", { status: 404 });
    }
    if(!params.storeId){
        return new NextResponse("Store not found", { status: 403 });
    }
    const body = await req.json();

    const { name } = body;
    
    if (!name) {
      return new NextResponse("Store name is required", { status: 402 });
    }

    const docRef = doc(db,'stores',params.storeId)

    await updateDoc(docRef, { name });

    const store = (await getDoc(docRef)).data() as Store;
    
    return NextResponse.json(store);
  } catch (error) {
    return new NextResponse("Internal server error", { status: 500 });
  }
};

//DELETE Store
export const DELETE = async (
    req: Request,
    { params }: { params: { storeId: string } }
  ) => {
    try {
      const { userId } = await auth();

      if (!userId) {
        return new NextResponse("Un_authorization", { status: 404 });
      }
      if (!params.storeId) {
        return new NextResponse("Store not found", { status: 403 });
      }

      const docRef = doc(db, "stores", params.storeId);

      //delete billboards
      const billboardQuerySnapshot = await getDocs(
        collection(db, `/stores/${params.storeId}/billboards`)
      );
      billboardQuerySnapshot.forEach(async (billboardDoc) => {
        await deleteDoc(billboardDoc.ref);

        const imageUrl = billboardDoc.data().imageUrl;
        if (imageUrl) {
          const imageRef = ref(storage, imageUrl);
          await deleteObject(imageRef);
        }
      });

      //delete categories
      const categoryQuerySnapshot = await getDocs(
        collection(db, `/stores/${params.storeId}/categories`)
      );
      categoryQuerySnapshot.forEach(async (category) => {
        await deleteDoc(category.ref);
      });

      //delete cuisine
      const cuisineQuerySnapshot = await getDocs(
        collection(db, `/stores/${params.storeId}/cuisines`)
      );
      cuisineQuerySnapshot.forEach(async (cuisine) => {
        await deleteDoc(cuisine.ref);
      });

      //delete size
      const sizeQuerySnapshot = await getDocs(
        collection(db, `/stores/${params.storeId}/sizes`)
      );
      sizeQuerySnapshot.forEach(async (size) => {
        await deleteDoc(size.ref);
      });

      //delet product
      const productQuerySnapshot = await getDocs(
        collection(db, `/stores/${params.storeId}/products`)
      );
      productQuerySnapshot.forEach(async (productDoc) => {
        await deleteDoc(productDoc.ref);

        const imageArray = productDoc.data().images;

        if (imageArray && Array.isArray(imageArray)) {
          await Promise.all(imageArray.map(async(imageUrl)=>{
            const imageRef = ref(storage, imageUrl.url);
            await deleteObject(imageRef);
          }))
        }
      });

      //delete order
      const orderQuerySnapshot = await getDocs(
        collection(db, `/stores/${params.storeId}/orders`)
      );
      orderQuerySnapshot.forEach(async(order)=>{
        await deleteDoc(order.ref);

        const orderItem = order.data().orderItems;
        if (orderItem && Array.isArray(orderItem)) {
          await Promise.all(
            orderItem.map(async (item) => {
              const itemImageArray = item.images;
              if (itemImageArray && Array.isArray(itemImageArray)) {
                await Promise.all(
                  itemImageArray.map(async (i) => {
                    const imgRef = ref(storage, i.url);
                    await deleteObject(imgRef);
                  })
                );
              }
            })
          );
        }
      })


      await deleteDoc(docRef);

      const store = (await getDoc(docRef)).data() as Store;

      return NextResponse.json({ msg: "Delete successfull" });
    } catch (error) {
      return new NextResponse("Internal server error", { status: 500 });
    }
  };