import type { Meta, StoryObj } from "@storybook/react";
import Toast, { type ToastType } from "./Toast";
import { useState } from "react";

const meta: Meta<typeof Toast> = {
  title: "UI/Toast",
  component: Toast,
};
export default meta;

type Story = StoryObj<typeof Toast>;

export const Default: Story = {
  render: () => {
    const [show, setShow] = useState(true);
    return show ? <Toast message="Hello!" type="info" onClose={() => setShow(false)} /> : null;
  },
};

export const Success: Story = {
  render: () => {
    const [show, setShow] = useState(true);
    return show ? <Toast message="Success!" type="success" onClose={() => setShow(false)} /> : null;
  },
};

export const Error: Story = {
  render: () => {
    const [show, setShow] = useState(true);
    return show ? <Toast message="Error occurred" type="error" onClose={() => setShow(false)} /> : null;
  },
};
