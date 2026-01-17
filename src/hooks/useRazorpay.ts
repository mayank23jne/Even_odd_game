export const useRazorpayPayment = () => {
  const startPayment = async (
    amount: number,
    user: any,
    onSuccess: (paymentData: any) => void,
    onError?: (err: any) => void
  ) => {
    if (!(window as any).Razorpay) {
      return;
    }

    const options = {
      key: "rzp_test_Rgm5t9JTnbpSaO",
      amount: amount * 100,
      currency: "INR",
      name: "Even Odd Game",
      description: "Donation Payment",
      notes: {
        platform: "Even Odd Game"
      },

      handler: function (response: any) {
        onSuccess(response);
      },

      prefill: {
        name: user?.name || "",
        email: user?.email || "",
        contact: user?.mobile || "",
      },

      theme: {
        color: "#f97a1f",
      },

      modal: {
        ondismiss: function () {
          console.log("Payment popup closed");
        },
      },
    };

    const rzp = new (window as any).Razorpay(options);

    rzp.on("payment.failed", function (response: any) {
      console.error("PAYMENT FAILED:", response);
      if (onError) onError(response);
    });

    rzp.open();
  };

  return { startPayment };
};
