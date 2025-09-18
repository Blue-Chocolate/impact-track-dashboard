// src/components/ui/Button.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import Button, { type ButtonProps } from "./Button";

const meta: Meta<ButtonProps> = {
  title: "UI/Button",
  component: Button,
  args: {
    children: "Click Me",
    variant: "primary",
    size: "md",
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["primary", "secondary", "danger"],
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
    },
      
  },
};

export default meta;

type Story = StoryObj<ButtonProps>;

export const Default: Story = {};
