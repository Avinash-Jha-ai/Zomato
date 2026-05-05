import { setOrder, setSuccess, setLoading, setError, resetOrderState, setOrders } from "../states/order.slice.js";
import { createOrder, verifyPayment, getMyOrders } from "../services/order.service.js";
import { useDispatch } from "react-redux";
import { clearCart } from "../services/cart.service.js";
import { setCart } from "../states/cart.slice.js";

import { useNavigate } from "react-router-dom";

export const useOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGetMyOrders = async () => {
    try {
      dispatch(setLoading(true));
      const data = await getMyOrders();
      dispatch(setOrders(data.orders));
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleCreateOrder = async ({ items, totalAmount, user }) => {
    try {
      dispatch(setLoading(true));
      const data = await createOrder({ items, totalAmount });
      dispatch(setOrder(data));

      const loadRazorpay = () => new Promise((resolve) => {
        if (window.Razorpay) return resolve(true);
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });

      const isLoaded = await loadRazorpay();
      if (!isLoaded) throw new Error("Razorpay SDK failed to load");

      const { razorpayOrder } = data;
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "DarkStore",
        description: "Order Payment",
        order_id: razorpayOrder.id,
        handler: async (response) => {
          try {
            await verifyPayment(response);
            dispatch(setSuccess(true));
            // Automatically clear cart after successful payment
            await clearCart();
            dispatch(setCart([]));
            navigate("/orders");
          } catch {
            dispatch(setError("Payment verification failed"));
          }
        },
        prefill: {
          name: user?.username || "",
          email: user?.email || "",
          contact: user?.phone || "",
        },
        theme: { color: "#FF6B35" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      dispatch(setError(error.message));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  return { handleCreateOrder, handleGetMyOrders };
};
