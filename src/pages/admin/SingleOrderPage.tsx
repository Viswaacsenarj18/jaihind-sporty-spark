import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { ORDER_ROUTES } from "@/config/api";

export default function SingleOrderPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    axios.get(ORDER_ROUTES.GET_USER(id || ""))
      .then(res => setOrder(res.data.order))
      .catch(err => console.error(err));
  }, [id]);

  if (!order) {
    return <p className="p-10 text-center">Loading order...</p>;
  }

  return (
    <div className="p-10 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Order Details</h1>

      <Card>
        <CardContent className="p-4 space-y-4">

          <div>
            <h2 className="font-bold text-xl">Customer Info</h2>
            <p><strong>Name:</strong> {order.customer.firstName} {order.customer.lastName}</p>
            <p><strong>Email:</strong> {order.customer.email}</p>
            <p><strong>Phone:</strong> {order.customer.phone}</p>
          </div>

          <div>
            <h2 className="font-bold text-xl">Items</h2>
            {order.items.map((it: any, i: number) => (
              <div key={i} className="border p-2 my-2 rounded">
                <p>{it.name}</p>
                <p>Qty: {it.quantity}</p>
                <p>Price: ₹{it.price}</p>
              </div>
            ))}
          </div>

          <div>
            <h2 className="font-bold text-xl">Summary</h2>
            <p><strong>Total:</strong> ₹{order.summary.total}</p>
          </div>

        </CardContent>
      </Card>

    </div>
  );
}
