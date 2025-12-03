import { useState } from "react";
import Link from "next/link";

export default function PricingSection() {
  const [billingType, setBillingType] = useState("monthly");

  const handleBillingToggle = (type) => {
    setBillingType(type);
  };

  const plans = [
    {
      title: "Free Trial",
      desc: "Explore the application for 14 days. No Credit Card details required*",
      monthlyPrice: 0,
      yearlyPrice: 0,
      priceDesc: "/month",
      employees: "(Limited Employees)",
      addon: "Not applicable",
      link: "/signup",
      features: [
        "Onboarding",
        "Employee database management",
        "Document management",
        "Time-off management (Leave)",
        "HR reports",
        "Zia AI bot",
      ],
    },
    {
      title: "Professional Plan",
      desc: "Unlock advanced automation features and seamless HR management",
      monthlyPrice: 3500,
      yearlyPrice: Math.round(3500 * 12 * 0.8), // 20% discount
      priceDesc: "/month",
      employees: "(Including 50 employees)",
      addon: "₹71 per additional employee",
      link: "/signup",
      features: [
        "Onboarding",
        "Employee database management",
        "Document management",
        "Time-off management (Leave)",
        "HR reports",
        "Zia AI bot",
      ],
    },
    {
      title: "Enterprise Plan",
      desc: "Comprehensive plan designed to engage employees and take your organization to new heights.",
      monthlyPrice: 5666,
      yearlyPrice: Math.round(5666 * 12 * 0.8), // 20% discount
      priceDesc: "/month",
      employees: "(Including 50 employees)",
      addon: "₹125 per additional employee",
      link: "/signup",
      highlighted: true,
      recommended: true,
      features: [
        "Onboarding",
        "Employee database management",
        "Document management",
        "Time-off management (Leave)",
        "HR reports",
        "Zia AI bot",
      ],
    },
  ];

  const getPrice = (plan) =>
    billingType === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;

  return (
    <div className="card">
      <div className="card-body">

        {/* Billing Switch */}
        <div className="billing-switch-container float-end mb-5">
          <div className="billing-toggle">
            <button
              className={`toggle-option ${billingType === "monthly" ? "active" : ""}`}
              onClick={() => handleBillingToggle("monthly")}
            >
              Monthly
            </button>
            <button
              className={`toggle-option ${billingType === "yearly" ? "active" : ""}`}
              onClick={() => handleBillingToggle("yearly")}
            >
              Yearly
            </button>
          </div>
          <div className="discount-badge">Save more than 20%</div>
        </div>

        {/* Pricing Plans */}
        <div className="pricing-container w-100">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`plan ${plan.highlighted ? "highlighted" : ""}`}
            >
              {plan.recommended && <h5>Recommended</h5>}
              <h2>{plan.title}</h2>
              <p className="plan-desc">{plan.desc}</p>

              <div className="price">
                <span className="p-amount">₹{getPrice(plan).toLocaleString()}</span>
                <div className="p-desc">{plan.priceDesc}</div>
              </div>

              <div className="p-emp">{plan.employees}</div>
              <div className="addon-emp">
                <div className="p-desc">{plan.addon}</div>
              </div>

              <Link href={plan.link} className="freetrial-btn">
                Start Free Trial
              </Link>

              <div className="pricing-table-line"></div>

              <div className="item-list">
                <ul>
                  {plan.features.map((feature, index) => (
                    <li key={index}>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
