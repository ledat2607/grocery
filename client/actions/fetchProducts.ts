// src/actions/fetchProducts.ts
import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Products } from "@/type-db";

export async function fetchProducts(): Promise<Products[]> {
  const productSnapshot = await getDocs(
    collection(doc(db, "stores", "Dig8zntOmcTZ2jURnCr5"), "products")
  );
  return productSnapshot.docs.map((doc) => doc.data()) as Products[];
}
