import React from "react";

const AboutUs: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto mt-5 mb-5">
      <section className="mb-8">
        <h1 className="text-4xl font-bold text-center mb-4">About Us</h1>
        <h2 className="text-2xl font-semibold mb-2">Introduction</h2>
        <p className="text-gray-700 leading-relaxed">
          Welcome to <strong>Chevron CEMCS</strong>, your one-stop destination
          for all your shopping needs. We are an eCommerce platform that
          specializes in providing a wide range of products and services,
          including groceries, vehicles, electronics, and travel experiences.
          With our user-friendly website and seamless shopping experience, we
          aim to make your online shopping journey convenient and enjoyable.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Our Mission</h2>
        <p className="text-gray-700 leading-relaxed">
          At <strong>Chevron CEMCS</strong>, our mission is to provide our
          customers with high-quality products and exceptional services as well
          as to consistently deliver superior and sustainable value to members,
          the community, and partners by leveraging available resources within
          the confines of applicable rules and regulations. We strive to meet
          and exceed your expectations by offering a diverse selection of
          groceries, vehicles, electronics, travel options, and more. Our team
          is dedicated to ensuring your satisfaction and making your shopping
          experience hassle-free.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">Why Choose Us</h2>
        <ul className="list-disc list-inside text-gray-700 leading-relaxed">
          <li>
            Wide selection of products and services in multiple categories.
          </li>
          <li>Competitive prices and regular promotions.</li>
          <li>User-friendly website with intuitive navigation.</li>
          <li>Secure and convenient payment options.</li>
          <li>Fast and reliable shipping/delivery.</li>
          <li>
            Dedicated customer support team to assist you with any inquiries or
            concerns.
          </li>
        </ul>
        <p className="mt-4 text-gray-700 leading-relaxed">
          At <strong>Chevron CEMCS</strong>, we are committed to providing you
          with a seamless and enjoyable shopping experience. Join us today and
          discover the convenience of online shopping for groceries, vehicles,
          electronics, travel services, and more.
        </p>
      </section>
    </div>
  );
};

export default AboutUs;
