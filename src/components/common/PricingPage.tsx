"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Mail } from "lucide-react";

const pricingPlans = {
  monthly: [
    {
      name: "Free",
      price: "₹0",
      description: "Basic practice with voice and DSA interviews",
      features: [
        "2 Interviews per month",
        "Limited AI feedback",
        "No export or reports",
      ],
      cta: "Current Plan",
      disabled: true,
    },
    {
      name: "Pro",
      price: "₹499",
      description: "Unlimited practice with advanced AI assistance",
      features: [
        "Unlimited Interviews",
        "AI-generated feedback",
        "Code execution & scoring",
      ],
      cta: "Upgrade to Pro",
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For startups, bootcamps, and teams",
      features: [
        "Team onboarding",
        "Custom voice assistant",
        "Priority Support",
      ],
      cta: "Contact Sales",
      enterprise: true,
    },
  ],
  yearly: [
    {
      name: "Free",
      price: "₹0",
      description: "Basic practice with voice and DSA interviews",
      features: [
        "2 Interviews per month",
        "Limited AI feedback",
        "No export or reports",
      ],
      cta: "Current Plan",
      disabled: true,
    },
    {
      name: "Pro (Yearly)",
      price: "₹4999",
      description: "Get 2 months free with yearly billing",
      features: [
        "Unlimited Interviews",
        "Full AI Feedback & Reporting",
        "Export Results",
      ],
      cta: "Upgrade Yearly",
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For startups, bootcamps, and teams",
      features: [
        "Team onboarding",
        "Custom voice assistant",
        "Priority Support",
      ],
      cta: "Contact Sales",
      enterprise: true,
    },
  ],
};

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const plans = pricingPlans[billingCycle];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold">Simple pricing for every learner</h2>
        <p className="text-gray-600 mt-2">
          Whether you're a fresher or preparing for FAANG — we’ve got you.
        </p>

        <div className="inline-flex mt-6 bg-gray-100 p-1 rounded-lg">
          <Button
            variant={billingCycle === "monthly" ? "default" : "ghost"}
            onClick={() => setBillingCycle("monthly")}
            className="rounded-l-md"
          >
            Monthly
          </Button>
          <Button
            variant={billingCycle === "yearly" ? "default" : "ghost"}
            onClick={() => setBillingCycle("yearly")}
            className="rounded-r-md"
          >
            Yearly
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`transition hover:shadow-md ${
              plan.name === "Pro" || plan.name?.includes("Yearly")
                ? "border-blue-500 ring-2 ring-blue-300"
                : ""
            }`}
          >
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {plan.name}
                {plan.enterprise && (
                  <Badge variant="outline" className="text-xs">
                    Team
                  </Badge>
                )}
              </CardTitle>
              <p className="text-xl font-semibold">
                {plan.price} {billingCycle === "monthly" && `/mo`}
              </p>
              <p className="text-gray-500 text-sm">{plan.description}</p>
            </CardHeader>

            <CardContent className="space-y-3">
              <ul className="space-y-2 text-sm">
                {plan.features?.map((feature: any, idx: number) => (
                  <li key={idx} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                className="w-full mt-4"
                variant={plan.disabled ? "outline" : "default"}
                disabled={plan.disabled}
                onClick={() => {
                  if (plan.enterprise) {
                    window.location.href = "mailto:contact@rethwrit.com";
                  } else if (!plan.disabled) {
                    // TODO: Redirect to Stripe or upgrade route
                    alert("Redirecting to upgrade page...");
                  }
                }}
              >
                {plan.enterprise ? (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    {plan.cta}
                  </>
                ) : (
                  plan.cta
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
