import Box from "@/components/box";
import Container from "@/components/container";
import { db } from "@/lib/firebase";
import { Order } from "@/type-db";
import { auth } from "@clerk/nextjs/server";
import { collection, doc, getDocs } from "firebase/firestore";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import OrderContent from "./order-content";

export const revalidate = 0;

const OrderPage = async({ params }: { params: { storeId: string } }) => {
    const { userId } = auth();
    const orderData = (
      await getDocs(
        collection(doc(db, "stores", "GsGFvwku3vPwlUyXKUnn"), "orders")
      )
    ).docs.map((doc) => doc.data()) as Order[];
const formatedOrder = orderData.filter((item) => item?.userId === userId);
  return (
    <>
      <Container className="bg-white rounded-lg my-4">
        <Box className="text-neutral-700 text-sm items-center pl-12">
          <Link href={"/"} className="flex items-center gap-2">
            <Home className="w-6 h-6 cursor-pointer" />
            Main page
          </Link>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
          <Link href={"/orders"} className="flex items-center gap-2">
            Order
          </Link>
        </Box>
        <h2 className="my-4 text-xl pl-12 uppercase font-semibold text-neutral-700">
          My orders
        </h2>
        <OrderContent orders={formatedOrder} />
      </Container>
    </>
  );
};
 
export default OrderPage;