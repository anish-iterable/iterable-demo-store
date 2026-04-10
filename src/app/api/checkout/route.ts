import { supabase } from "@/lib/supabase";
import {
  iterableTrackPurchase,
  iterableUsersUpdate,
} from "@/lib/iterable-server";
import { NextResponse } from "next/server";

type CheckoutItem = {
  product_id: number;
  quantity: number;
  unit_price: number;
  name?: string;
  slug?: string;
  image_url?: string | null;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      firstName,
      lastName,
      email,
      items,
    }: {
      firstName: string;
      lastName: string;
      email: string;
      items: CheckoutItem[];
    } = body;

    if (!firstName || !lastName || !email || !items?.length) {
      return NextResponse.json(
        { error: "Missing required checkout data." },
        { status: 400 }
      );
    }

    let customerId: number | null = null;

    const { data: existingCustomer } = await supabase
      .from("customers")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existingCustomer) {
      customerId = existingCustomer.id;
    } else {
      const { data: newCustomer, error: customerError } = await supabase
        .from("customers")
        .insert([
          {
            first_name: firstName,
            last_name: lastName,
            email,
          },
        ])
        .select("id")
        .single();

      if (customerError || !newCustomer) {
        return NextResponse.json(
          { error: customerError?.message || "Failed to create customer." },
          { status: 500 }
        );
      }

      customerId = newCustomer.id;
    }

    const totalAmount = items.reduce(
      (sum, item) => sum + item.quantity * item.unit_price,
      0
    );

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          customer_id: customerId,
          total_amount: totalAmount,
          status: "placed",
        },
      ])
      .select("id")
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: orderError?.message || "Failed to create order." },
        { status: 500 }
      );
    }

    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      return NextResponse.json(
        { error: itemsError.message },
        { status: 500 }
      );
    }

    await iterableUsersUpdate({
      email,
      dataFields: {
        firstName,
        lastName,
        lastOrderId: order.id,
        lastOrderTotal: totalAmount,
        lastPurchaseAt: new Date().toISOString(),
      },
    });

    await iterableTrackPurchase({
      email,
      total: totalAmount,
      items: items.map((item) => ({
        id: String(item.product_id),
        sku: String(item.product_id),
        name: item.name ?? `Product ${item.product_id}`,
        price: item.unit_price,
        quantity: item.quantity,
        imageUrl: item.image_url ?? null,
        url: item.slug
          ? `${process.env.NEXT_PUBLIC_SITE_URL}/products/${item.slug}`
          : undefined,
      })),
      dataFields: {
        orderId: order.id,
        source: "website_checkout",
      },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}