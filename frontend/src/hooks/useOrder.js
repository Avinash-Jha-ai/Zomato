import {setOrder,setSuccess,setLoading,setError,resetOrderState} from "../states/order.slice.js"
import {createOrder,verifyPayment} from "../services/order.service.js"
import { useDispatch } from "react-redux"

const useOrder =()=>{
    const dispatch =useDispatch();

    const handleCreateOrder = async ({ items, totalAmount, user }) => {
    try {
      dispatch(setLoading(true));
      const data = await createOrder({ items, totalAmount });
      dispatch(setOrder(data));
      const loadRazorpay = () =>
        new Promise((resolve) => {
          if (window.Razorpay) return resolve(true);

          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });

      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        throw new Error("Razorpay SDK failed to load");
      }

      const { razorpayOrder } = data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Food App",
        description: "Order Payment",
        order_id: razorpayOrder.id,

        handler: async (response) => {
          try {
            await verifyPayment(response);
            dispatch(setSuccess(true));
          } catch (err) {
            dispatch(setError("Payment verification failed"));
          }
        },

        prefill: {
          name: user?.username || "",
          email: user?.email || "",
          contact: user?.phone || "",
        },

        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    handleCreateOrder,
  };
};
