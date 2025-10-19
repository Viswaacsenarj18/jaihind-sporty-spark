import { Link } from "react-router-dom";

const Shipping = () => {
  return (
    <div className="container mx-auto p-6 md:p-12">
      {/* Page Title */}
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">Shipping Information</h1>

      {/* Introduction */}
      <p className="text-base md:text-lg mb-6 text-gray-700 text-center">
        We aim to deliver your products quickly and safely. Here’s everything you need to know about our shipping policies.
      </p>

      {/* Shipping Methods */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Shipping Methods</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li><strong>Standard Shipping:</strong> 3-7 business days depending on location.</li>
          <li><strong>Express Shipping:</strong> 1-3 business days for urgent deliveries.</li>
          <li><strong>International Shipping:</strong> 7-15 business days depending on the country.</li>
        </ul>
      </section>

      {/* Shipping Charges */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Shipping Charges</h2>
        <p className="text-gray-700 mb-2">
          Standard shipping is free on orders over ₹2,000. For orders below ₹2,000, a shipping fee of ₹150 will be applied.
        </p>
        <p className="text-gray-700">
          Express shipping charges vary based on the location and will be displayed at checkout.
        </p>
      </section>

      {/* Delivery Time */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Delivery Time</h2>
        <p className="text-gray-700 mb-2">
          Orders are processed within 24-48 hours after payment confirmation.
        </p>
        <p className="text-gray-700">
          Delivery time may vary due to public holidays, remote locations, or unforeseen circumstances.
        </p>
      </section>

      {/* Contact Information */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Contact Us</h2>
        <p className="text-gray-700">
          For any questions regarding your order or shipping, feel free to contact us at:
        </p>
        <ul className="list-disc list-inside text-gray-700 mt-2">
          <li>Phone: 86374 50696 / 80568 91366</li>
          <li>Email: <a href="mailto:sethupathi51469@gmail.com" className="text-blue-600 hover:underline">sethupathi51469@gmail.com</a></li>
        </ul>
      </section>

      {/* Back to Home */}
      <div className="text-center mt-8">
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-primary text-white font-medium rounded hover:bg-primary/90 transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Shipping;
