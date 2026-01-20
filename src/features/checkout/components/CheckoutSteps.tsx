"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: string;
  title: string;
  description: string;
}

interface CheckoutStepsProps {
  currentStep: string;
  steps: Step[];
  className?: string;
}

export function CheckoutSteps({ currentStep, steps, className }: CheckoutStepsProps) {
  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <div className={cn("mb-8", className)}>
      <nav aria-label="Progress">
        <ol className="flex items-center justify-center">
          {steps.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isCurrent = step.id === currentStep;

            return (
              <li key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  {/* Step Circle */}
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                      {
                        "border-gold-600 bg-gold-600 text-white": isCompleted,
                        "border-gold-600 bg-white text-gold-600": isCurrent,
                        "border-gray-300 bg-white text-gray-400": !isCompleted && !isCurrent,
                      }
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </div>

                  {/* Step Title */}
                  <div className="mt-2 text-center">
                    <div
                      className={cn(
                        "text-sm font-medium transition-colors",
                        {
                          "text-gold-600": isCompleted || isCurrent,
                          "text-gray-500": !isCompleted && !isCurrent,
                        }
                      )}
                    >
                      {step.title}
                    </div>
                    <div
                      className={cn(
                        "text-xs transition-colors",
                        {
                          "text-gold-600": isCompleted || isCurrent,
                          "text-gray-400": !isCompleted && !isCurrent,
                        }
                      )}
                    >
                      {step.description}
                    </div>
                  </div>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "mx-4 h-px w-16 transition-colors",
                      {
                        "bg-gold-600": isCompleted,
                        "bg-gray-300": !isCompleted,
                      }
                    )}
                  />
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}