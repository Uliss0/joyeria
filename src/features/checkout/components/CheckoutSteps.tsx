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
                      "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-200",
                      isCompleted && "border-gold-600 bg-gold-600 text-white shadow-sm",
                      isCurrent && "border-gold-500 bg-card text-gold-600 dark:text-gold-400 ring-4 ring-gold-500/20 font-semibold shadow-md",
                      !isCompleted && !isCurrent && "border-border bg-card text-muted-foreground opacity-60"
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
                        isCompleted || isCurrent ? "text-gold-600 dark:text-gold-400 font-semibold" : "text-muted-foreground"
                      )}
                    >
                      {step.title}
                    </div>
                    <div
                      className={cn(
                        "text-xs transition-colors hidden sm:block",
                        isCompleted || isCurrent ? "text-foreground font-normal" : "text-muted-foreground/70"
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
                      "mx-3 sm:mx-4 h-0.5 w-12 sm:w-20 transition-colors",
                      isCompleted ? "bg-gold-600" : "bg-border"
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