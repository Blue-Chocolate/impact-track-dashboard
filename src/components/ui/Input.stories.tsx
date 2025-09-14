import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./Input";

const meta: Meta<typeof Input> = {
  title: "UI/Input",
  component: Input,
  args: {
    label: "Email",
    placeholder: "Enter email",
  },
};
export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {};
export const WithError: Story = { args: { error: "Invalid email address" } };
